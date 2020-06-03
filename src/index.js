//import router from './router'
import vuex from './vuex'
import utilities from './utilities'
import resource from './resource'
import dependencies from './dependencies'
import router from './router';

const installer = {};
installer.install = (Vue,options) => {
    Vue.use(utilities,options.config)
    Vue.use(dependencies);
    Vue.use(resource,options.resource)
    Vue.use(vuex,options.vuex)
    Vue.use(router,options.router)
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(installer);
}

export default installer
