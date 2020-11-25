import _camelCase from 'lodash/camelCase'
import _pick from 'lodash/pick'
import Arr from 'freedom-js-support/src/utilities/arr'
import Querifier from 'freedom-js-support/src/utilities/querifier'
import Vue from 'vue';

const addMutation = (mutations,key) => {
    let type = _camelCase(key)
    mutations[type] = (state,value) => {
        if(!state.hasOwnProperty(key)){
            return
        }
        if(typeof value !== 'object' || value === null){
            return  Vue.set(state,key,value)
        }
        Object.keys(value).forEach((field)=>{
            Vue.set(state[key],field,value[field])
        });
    }
    return mutations;
}

const addGetter = (getters,key) => {
    let type = _camelCase(key);

    getters[type] = (state) => {
        return state[ key ];
    }
    return getters;
}

export const types = {
    PER_PAGE:'per_page',
    PAGE:'page',
    SEARCH:'search',
    ORDER_BY:'orderBy',
    TOTAL:'total',
    META:'meta',
    GET_PARAMS:'getParams',
    SET_PARAMS:'setParams',
    SET_QUERY_STRING:'setQueryString',
    GET_QUERY_STRING:'getQueryString',
}

const exclude = ['total','meta','queryString'];

const _defaults = {
    per_page : 15,
    page : 1,
    search : {},
    orderBy : {},
    total : 0,
    meta: {},
    queryString:'',
    isLoaded:false,
}

export default function(store,config){
    let handler = Arr.getProperty(config,'handler',null);
    let block = Arr.getProperty(config,'block',null);
    let bus = Arr.getProperty(config,'bus','search')
    let parameters = [types.PER_PAGE,types.PAGE,types.SEARCH,types.ORDER_BY,types.TOTAL]
        .concat(Arr.getProperty(config,'parameters',[]))
        .filter((value,index,self)=>{
            return self.indexOf(value) === index;
        })
    let defaults = Object.assign(_defaults,store.state);
    let state = Object.assign({ },defaults);

    if(handler === null){
        console.error('A SEARCH HANDLER PARAM IS REQUIRED')
        throw 'A SEARCH HANDLER PARAM IS REQUIRED'
    }

    let getters = Object.assign({
        from(state){
            return Arr.getProperty(state.meta,'from',0)
        },
        to(state){
            return Arr.getProperty(state.meta,'to',0)
        },
        total(state){
            return Arr.getProperty(state.meta,'total',0)
        },
        lastPage(state){
            return Arr.getProperty(state.meta,'last_page',0)
        },
        getParams(state){
            return _pick(state,parameters);
        },
        getQueryString(state){
            return state['queryString']
        },
        getQueryObject(state){
            return Querifier.querifyable.reduce((query,key,index)=>{
                if(!state.hasOwnProperty(key) ||
                   !state[key] ||
                   ( typeof state[key] === 'object' && Object.keys(state[key]).length <= 0)){
                    return query;
                }
                let isObject = typeof state[key] == 'object' && !Array.isArray(state[key])
                query[key] = isObject ? Querifier.getCriteriaString(state[key],key,{decode: false, valueOnly:true }) : state[key]
                return query;
            },{})
        },
        isLoaded(state){
            return state.isLoaded;
        }
    },store.getters);

    let mutations = Object.assign({
        setIsLoaded(state,payload){
            Vue.set(state,'isLoaded',Boolean(payload));
        },
        orderBy(state,payload){
            Vue.set(state,types.ORDER_BY,payload);
        },
        setQueryString(state){
            let queryables = Object.keys(state).reduce(( queryables,key,index )=>{
                if(!exclude.includes(key)){
                    queryables[key] = state[key];
                }
                return queryables;
            },{});
            Vue.set(state,'queryString',Querifier.querify(queryables).join('&'))
        },
        search(state,payload){
            state[types.SEARCH] = {...payload};
        }
    },store.mutations)

    Object.values(types).forEach((key)=>{
        if(key.indexOf('set') < 0 && !getters.hasOwnProperty(key)){
            getters = addGetter(getters,key)
        }
        if(key.indexOf('get') < 0 && !mutations.hasOwnProperty(key)){
            mutations = addMutation(mutations,key)
        }
    });


    let actions = Object.assign({
        search(context,payload){
            context.commit(types.SEARCH,payload);
            context.commit(types.PAGE,1);
            context.commit(types.TOTAL,null)
            Vue.bus.emit(`${bus}:search`,payload);
            return context.dispatch('handle');
        },
        orderBy(context,payload){
            context.commit(types.ORDER_BY,payload);
            Vue.bus.emit(`${bus}:orderBy`,payload);
            return context.dispatch('handle');
        },
        page(context,payload){
            context.commit(types.PAGE,payload);
            Vue.bus.emit(`${bus}:page-change`,payload);
            return context.dispatch('handle');
        },
        perPage(context,payload){
            context.commit(_camelCase(types.PER_PAGE),payload);
            Vue.bus.emit(`${bus}:per-page-change`,payload);
            return context.dispatch('handle');
        },
        clear({ state }){
            let original = Object.assign({ },defaults);

            Object.keys(state).forEach((field)=>{
                let value = original[field]
                Vue.set(state,field,value)
                if(typeof value === 'object' && value && !Array.isArray(value)){
                    state[field] = Object.assign({},value)
                }
            });
            Vue.bus.emit(`${bus}:clear-state`,original);
        },
        recount(state){
            context.commit(_camelCase(types.TOTAL),undefined)
            Vue.bus.emit(`${bus}:recount`);
            return context.dispatch('handle');
        },
        handle(context,payload={}){
            let process = () => {
                context.commit(types.SET_PARAMS,payload);
                let params =  Object.assign(_pick(context.state,parameters),payload);
                Vue.bus.emit(`${bus}:loading`,{ state: context.state, params } );

                let promise = handler(context,params);
                promise.then((response)=>{
                    let meta = Arr.getProperty(response,types.META,defaults[types.META]);
                    let pagination = Arr.getProperty(meta,'pagination',meta);
                    context.commit(types.META, pagination)
                    context.commit(types.TOTAL, Arr.getProperty(pagination,'total',undefined));
                    context.commit(types.SET_QUERY_STRING);
                    context.commit('setIsLoaded',true);
                    Vue.bus.emit(`${bus}:load`,{ state: context.state, response} );
                    Vue.bus.emit(`${bus}:loaded`,{ state: context.state, response} );
                })
                return promise;
            }
            return typeof block === 'function' ? block(process) : process();
        },

    },store.actions)

    return {
        namespaced:true,
        state,
        getters,
        mutations,
        actions,
    }
}

