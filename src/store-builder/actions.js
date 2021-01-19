import Arr from 'freedom-js-support/src/utilities/arr'

const model = function({ api={}}) {
    return {
        set(context,payload){
            return new Promise((resolve,reject) => {
                context.commit('set',payload)
                resolve(payload);
            });
        },
        find(context, params) {
            return new Promise(async (resolve, reject) => {
                try{
                    let response = api.find(params)
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        all(context, params) {
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.all(params)
                    context.commit("set", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response);
                }
            });
        },
        index(context, params) {
            let join = Arr.getProperty(params,'join',false)
            if (params && params.join) {
                delete params.join;
            }
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.index(params)
                    context.commit(join ? "join" : "set", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response);
                }
            });
        },
        indexSet(context,params){
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.index(params)
                    context.commit("set", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response);
                }
            });
        },
        indexAppend(context,params){
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.index(params)
                    context.commit("join", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response);
                }
            });
        },
        get(context, params) {
            let id = Arr.getProperty(params,'id',params);
            if(Arr.hasProperty(params,'id')){
                delete params.id;
            }
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.show(id,params)
                    context.commit("add", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        remove(context, payload) {
            let ids = Arr.getProperty(payload,'id',payload);
            var params = Arr.getProperty(payload,'params',null)
            if (params && payload.params) {
                delete payload.params;
            }
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.destroy(ids, params)
                    context.commit("remove", payload);
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        update(context, payload) {
            let id = Arr.getProperty(payload,'id',null);
            let params = Arr.getProperty(payload,'params',null);
            if (params && payload.params) {
                delete payload.params;
            }
            return new Promise(async(resolve, reject) => {
                try{
                    let response = await api.update(id, payload, params)
                    context.commit("update", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        add(context, payload) {
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.store(payload);
                    context.commit("add", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response.data)
                }
            });
        },
        upload(context, payload) {
            let params = Arr.getProperty(payload,'params',null)
            if (params && payload.params) {
                delete payload.params;
            }
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.upload(payload, params)
                    context.commit("add", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        clear(context) {
            context.commit("clear");
        },
        api(context) {
            return api;
        },
        validateAdd(context, payload) {
            let params = Arr.getProperty(payload,'params',null)
            if(params){
                delete payload.params;
            }
            return new Promise(async(resolve, reject) => {
                try{
                    let response = await api.store(payload,Object.assign({_actionName:'validate'},params));
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        validateUpdate(context, payload) {
            let id = Arr.getProperty(payload,'id');
            let params = Arr.getProperty(payload,'params',null)
            if(params && payload.params){
                delete payload.params;
            }
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.update(id,payload,Object.assign({_actionName:'validate'},params);
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
    };
};

const listing = function({api}) {
    return model({api})
}

const record =  function({api}){
    let basis  = Object.assign((({ api,clear,set,upload })=> ({api,clear,set,upload }))(model({api})),
    {
        get(context, params) {
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.self(params);
                    context.commit("set", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        update(context, payload) {
            var params = Arr.getProperty(payload,'params',null)
            if (params && payload.params) {
                delete payload.params;
            }
            return new Promise(async (resolve, reject) => {
                try{
                    let response = await api.selfUpdate(payload, params)
                    context.commit("set", response.data.data);
                    resolve(response.data);
                }catch(response){
                    reject(response.data);
                }
            });
        },
        validateUpdate(context, payload) {
            let params = Arr.getProperty(payload,'params',null)
            if(params && payload.params){
                delete payload.params;
            }
            return new Promise( async (resolve, reject) => {
                try{
                    let response = await api.selfUpdate(payload,Object.assign({_actionName:'validate'},params));
                    resolve(response.data);
                }catch(response){
                    reject(response.data)
                }
            });
        },
    });
    return basis;
}

export default { listing,record };
