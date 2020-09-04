import Vuex from 'vuex'
import * as Cookies from 'js-cookie'
import createPersistedState from 'vuex-persistedstate'
import preloadStore from './preload-store'
//const debug = process.env.NODE_ENV !== 'production'
const debug = false

const vuex_dependency = {
    install : (Vue,options) => {
        Vue.use(Vuex)
        var modules = options.modules;
        modules['Preload'] = preloadStore;


        var persistLocal = options.persistLocal;
        persistLocal.paths.push('Preload');
        var persistSession = options.persistSession;
        var attachTo = options.attachTo;

        if (!('localStorage' in window)) {
            persistLocal.storage = {
                getItem: key => Cookies.get(key),
                setItem: (key, value) => Cookies.set(key, value, { expires: 1, secure: true }),
                removeItem: key => Cookies.remove(key)
            }
        }

        persistSession.storage = window.sessionStorage

        const storage_key = Vue._config.storage_key;

        persistLocal.key = storage_key
        persistSession.key = storage_key

        var store = new Vuex.Store({
            modules,
            strict: debug,
            plugins: [
                createPersistedState(persistLocal),
                createPersistedState(persistSession),
            ]
        })

        const preload = JSON.parse(localStorage.getItem('preload'));
        if(preload){
            for(let key in preload){
                let storeDef = null;
                key.split('/').forEach((k) => {
                    storeDef = !storeDef ? Object.assign({},modules[k]) : storeDef.modules[k]
                })

                if(storeDef){
                    let data = preload[key];
                    store.commit(`${key}/set`,data);
                    delete(preload[key])
                }
            }
            store.commit('Preload/set',preload.data);
        }


        setTimeout(()=>{
            localStorage.removeItem('preload');
            window.localStorage.removeItem('preload')
            delete localStorage.preload
        },1000)

        attachTo.store = store;
    }
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(vuex_dependency);
}

export default vuex_dependency;
