import config from './config'
import response from './response'

const HelperUtility = {
    config,
    response,
}


HelperUtility.install = (Vue) => {
    for(let name in HelperUtility){
        var utility = HelperUtility[name]
        if (utility && name !== 'install') {
            Vue.use(utility);
        }
    }
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(HelperUtility);
}

export default HelperUtility
