import _config from './config'
import _vuex from './vuex'
import _utilities from 'freedom-js-support/index'
import _resource from './resource'
import _dependencies from './dependencies'
import _router from './router';

const installer = {};
installer.install = (Vue,{attachTo={},config={},resource={},router={},vuex={},dependencies={},utilities={}}) => {
    vuex.attachTo = attachTo;
    router.attachTo = attachTo;

    Vue.use(_config,config)
    Vue.use(_utilities,utilities)

    Vue.use(_dependencies,dependencies);
    Vue.use(_vuex,vuex)
    Vue.use(_resource,resource)
    Vue.use(_router,router)
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(installer);
}

export default installer
