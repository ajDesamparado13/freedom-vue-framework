
import Vue from 'vue';
import framework from '@framework'
import preloadStore from './preload-store'

export default function initialize(AppComponent,{
    options={},
    vuex={},
    router={},

})  {

    var options = {
        el: '#main',
        render: h => h(AppComponent)
    }

    //CONFIGURE VUEX
    vuex.attachTo = options;
    vuex.modules['Preload'] = preloadStore;
    vuex.persistLocal.paths.push('Preload');

    router.attachTo = options;

    Vue.use(framework,{ vuex,router });

    const preload = JSON.parse(localStorage.getItem('preload'));

    if(preload){
        options.store.commit('Preload/set',preload.data);
    }

    setTimeout(()=>{
        localStorage.removeItem('preload');
        window.localStorage.removeItem('preload')
        delete localStorage.preload
    },1000)

    const app = new Vue(options);
    options.router.onReady(()=>{
        app.$mount(options.el);
    })

    //ADD GLOBAL ACCESS FOR DEBUGGING IN NON PRODUCTION ENVIRONMENT
    if(process.env.MIX_APP_ENV != 'production'){
        window.store = options.store;
    }
    window.Vue = Vue;

    return app;
}
