import Arr from 'freedom-js-support/src/utilities/arr'
import Str from 'freedom-js-support/src/utilities/str'
export const removeElement = (element) => {
    if(typeof element.remove == 'function'){
        return element.remove();
    }
    let parent  = element.parentNode;
    return parent.removeChild(element)
}

export const assets = {
    install : (Vue,config={})=>{
        Vue._assets = (path="",storage="") => {
            let storage_path = Arr.getProperty(Vue._config, 'assets_url', "");
            if(storage){
                storage_path = Arr.getProperty(Vue._config,`storage.${storage}`, storage_path )
            }
            return Str.joinWith(storage_path, path,"/");
        };

        Object.defineProperties(Vue.prototype,{
            $_assets:{
                get:() => {
                    return Vue._assets;
                }
            }
        })
    }
}

export const VUE_INSTALLER = function( Vue ,config={}){
    Vue.use(assets, Arr.getProperty(config, 'assets'));
}