import routerPipeline from './routerPipeline'

import VueRouter from 'vue-router'

const router_dependency = {
}

router_dependency.install = (Vue,options) => {

    Vue.use(VueRouter)

    var routes = options.routes;
    var attachTo = options.attachTo;
    var scroll = {x:0,y:0}

    var base = options.base || "";
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
        const context = { to,from,next,store:attachTo.store}
        return middlewares[0]({...context,next:routerPipeline(context,middlewares,1)});
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
