
import VueRouter from 'vue-router'

const router_dependency = {
}

router_dependency.install = (Vue,options) => {

    Vue.use(VueRouter)

    var routes = options.routes;
    var attachTo = options.attachTo;
    var scroll = {x:0,y:0}

    var base = ""
    var suffix = options.base;

    const domain = Vue._config.app_domain;
    const url = Vue._config.app_url;
    const env = Vue._config.app_env;

    if(env == 'production'){
        if(domain){
            base = url;
            base = base.replace(domain,'');
        }else{
            base = url;
            base = base.replace('https://','');
            base = base.replace('http://','');
            base = base.substring(base.indexOf('/')+1,base.length);
        }
        base += suffix;
    }

    const scrollBehavior = (to,from,next)=>{
        return scroll;
    }

    var router = new VueRouter({
        routes,
        savedPosition:true,
        base,
        hashbang: false,
        history: true,
        mode: 'history',
        linkActiveClass: 'active',
        scrollBehavior,
    })
    attachTo.router = router;
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(router_dependency);
}

export default router_dependency;
