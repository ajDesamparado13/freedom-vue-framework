import _actions from './actions'
import _getters from './getters'
import _mutations from './mutations'
import _state from './state'
//import _auth from './auth'

/*
* BASE DEFINITION OF STORE FROM BUILDER
*/
const base = {
    actions : _actions,
    getters : _getters,
    mutations : _mutations,
    state   : _state,
}

/*
* @param part is the given definition of store key which would add/override to the builder base definition
* @param key is the key for store definition i.e actions,getters,mutations,state
* @param config is the object for store config { model, api, type }
*/
export function assign(part,key,config={}){
    let store_definition = part || {}
    let type = config['type'] || 'listing';
    var definition = base[key][type](config);
    return Object.assign(definition,store_definition)
}

/*
* @param store is the given definition of store which would add/override to the builder base definition
* @param config is the object for store config { model, api, type }
* @param name is the name of the store used for debugging store definition in console environment
*/
export function build(store={},config={}){

    store['namespaced'] = typeof config.namespaced != 'undefined' ? config.namespaced : true
    //key refers to actions,getters,mutations, and state
    for(let key in base){
        store[key] = assign(store[key],key,config)
    }

    return store;
}

//export function auth_builder(store={},config={}){
//    return _auth;
//}

export default build;
