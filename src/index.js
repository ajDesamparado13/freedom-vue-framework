import Vue from 'vue';
import bootstrap from './bootstrapper'

export default function initialize(VueOptions={},configuration={})  {

    //CONFIGURE VUEX
    configuration.attachTo = VueOptions;
    Vue.use(bootstrap, configuration);
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
