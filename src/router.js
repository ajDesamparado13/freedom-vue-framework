import routerPipeline from './routerPipeline'

import VueRouter from 'vue-router'

const router_dependency = {
}

router_dependency.install = (Vue,options) => {

    Vue.use(VueRouter)

    var routes = options.routes;
    var attachTo = options.attachTo;
    var afterEach = options.afterEach;
    let beforeEach = options.beforeEach;
    var scroll = {x:0,y:0}

    var base = ""
    var suffix = options.base || "";

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
    }

    base += suffix;

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
    router.beforeEach((to,from,next,next) => {

        if(typeof beforeEach === 'function'){
            beforeEach(to,from,next,router);
        }

        if(!to.meta.middleware){
            return next();
        }

        const middlewares = Array.isArray(to.meta.middleware) ? to.meta.middleware : [ to.meta.middleware];
        const context = { to,from,next,store:attachTo.store}
        return middlewares[0]({...context,next:routerPipeline(context,middlewares,1)});

    });

    router.afterEach((router) => {
        if(typeof afterEach == 'function'){
            afterEach(router);
        }
    })


    attachTo.router = router;
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(router_dependency);
}

export default router_dependency;
