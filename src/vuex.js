import Vuex from 'vuex'
import * as Cookies from 'js-cookie'
import createPersistedState from 'vuex-persistedstate'
import preloadStore from './preload-store'
//const debug = process.env.NODE_ENV !== 'production'
const debug = false

const vuex_dependency = {
    install : (Vue,options) => {
        Vue.use(Vuex)

        const storage_key = Vue._config.storage_key;
        var persistLocal = Object.assign(options.persistLocal,{ key:storage_key });
        var persistSession = Object.assign(options.persistSession,{ key:storage_key });

        if (!('localStorage' in window)) {
            persistLocal.storage = {
                getItem: key => Cookies.get(key),
                setItem: (key, value) => Cookies.set(key, value, { expires: 1, secure: true }),
                removeItem: key => Cookies.remove(key)
            }
        }

        var modules = Object.assign(options.modules,{ Preload:preloadStore });

        persistLocal.paths.push('Preload');
        persistSession.storage = window.sessionStorage

        var store = new Vuex.Store({
            modules,
            strict: debug,
            plugins: [
                createPersistedState(persistLocal),
                createPersistedState(persistSession),
            ]
        })

        const preload_key = Vue._config.preload_key || 'preload';
        const preload = JSON.parse(localStorage.getItem(preload_key)) || {};
        Object.keys(preload).forEach((key)=>{
                if(store.hasModule(key)){
                    let data = preload[key];
                    store.commit(`${key}/set`,data);
                    delete(preload[key])
                }
        })
        store.commit('Preload/set',preload.data);

        setTimeout(()=>{
            localStorage.removeItem('preload');
            window.localStorage.removeItem('preload')
            delete localStorage.preload
        },1000)

        options.attachTo.store = store;
    }
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(vuex_dependency);
}

export default vuex_dependency;
