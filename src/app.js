
import Vue from 'vue';
import framework from '@framework'
import preloadStore from './preload-store'

export default function initialize(VueOptions={},{
    vuex={},
    router={},

})  {

    //CONFIGURE VUEX
    vuex.attachTo = VueOptions;
    vuex.modules['Preload'] = preloadStore;
    vuex.persistLocal.paths.push('Preload');

    router.attachTo = VueOptions;

    Vue.use(framework,{ vuex,router });

    const preload = JSON.parse(localStorage.getItem('preload'));

    if(preload){
        VueOptions.store.commit('Preload/set',preload.data);
    }

    setTimeout(()=>{
        localStorage.removeItem('preload');
        window.localStorage.removeItem('preload')
        delete localStorage.preload
    },1000)

    const app = new Vue(VueOptions);
    VueOptions.router.onReady(()=>{
        app.$mount(VueOptions.el);
    })

    //ADD GLOBAL ACCESS FOR DEBUGGING IN NON PRODUCTION ENVIRONMENT
    if(process.env.MIX_APP_ENV != 'production'){
        window.store = VueOptions.store;
    }
    window.Vue = Vue;

    return app;
}
