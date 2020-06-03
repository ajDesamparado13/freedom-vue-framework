//npm package dependencies here
import VueBus from 'vue-bus'

const dependencies ={
    VueBus,
}

dependencies.install = (Vue) => {
    for(let name in dependencies){
        var dependency = dependencies[name]
        if (dependency && name !== 'install') {
            Vue.use(dependency)
        }
    }
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(dependencies);
}

export default dependencies
