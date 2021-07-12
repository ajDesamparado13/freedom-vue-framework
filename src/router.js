import Arr from 'freedom-js-support/src/utilities/arr'
import routerPipeline from './routerPipeline'

import VueRouter from 'vue-router'

const router_dependency = {
}

router_dependency.install = (Vue,options) => {

    Vue.use(VueRouter)

    var attachTo = options.attachTo;

    let scrollBehavior= Arr.getProperty(options,'scrollBehavior',(to,from,next)=>{
        let scrollBehavior = { behavior:'smooth' }
        if(to.hash){
            Object.assign(scrollBehavior,{selector:to.hash});
        }
        if(to.path != from.path){
            Object.assign(scrollBehavior,{ x:0, y:0})
        } 
        return scrollBehavior;
    })

    let base = Arr.getProperty(options,'base','');
    let domain = Vue._config.app_domain
    let url = Vue._config.app_url 
    if(domain && domain != url ){
        base = Vue._Str.joinWith(url,base,'/')
    }

    var router = new VueRouter({
        routes : Arr.getProperty(options,'routes',[]),
        savedPosition: Arr.getProperty(options,'savedPosition',true),
        hashbang: Arr.getProperty(options,'hashbang',true),
        history: Arr.getProperty(options,'history',true),
        mode: Arr.getProperty(options,'model','history'),
        linkActiveClass: Arr.getProperty(options,'linkActiveClass','active'),
        scrollBehavior,
        base,
    })

    let beforeEachList = []
    let afterEachList = []

    router.beforeEach((to,from,next,router) => {

        for(let key in beforeEachList){
            beforeEachList[key](to,from,next,router);
        }


        let matched = to.matched;
        let hasMiddleware =  !!to.meta.middleware ||  matched.some(record => record.meta.middleware)

        if(!hasMiddleware){
            return next();
        }

        let middlewares = [];

        for(let matches in matched){
            let match = matched[matches]

            if(typeof match.meta.middleware != 'undefined'){
                middlewares = middlewares.concat(Array.isArray(match.meta.middleware) ? match.meta.middleware : [ match.meta.middleware])
            }

        }
        const context = { Vue,to,from,next,store:attachTo.store, app:attachTo }
        let nextRoute = middlewares[0]({...context,next:routerPipeline(context,middlewares,1)});
        return nextRoute ? next(nextRoute) : nextRoute;

    });

    router.afterEach((router) => {
        for(let key in afterEachList){
            afterEachList[key](router);
        }
    })

    router.appendBeforeEach = (middleware)=> {
        beforeEachList.push(middleware);
    }

    router.appendAfterEach = (middleware)=> {
        afterEachList.push(middleware);
    }

    attachTo.router = router;
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(router_dependency);
}

export default router_dependency;
