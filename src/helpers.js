import Arr from 'freedom-js-support/src/utilities/arr'
import Str from 'freedom-js-support/src/utilities/str'
export const removeElement = (element) => {
    if(typeof element.remove == 'function'){
        return element.remove();
    }
    let parent  = element.parentNode;
    return parent.removeChild(element)
}


export const appendQueryStringMark = (value) => {
    let str = value.toString();
    return str.charAt(0) === '?' ? str : "?" + str;
};
export const removeSlashPrefix = (value) =>{
    let str = value.toString();
    return str.charAt(0) === '/' ? str.slice(1,str.length) : str;
}

export const removeSlashSuffix = (value) =>{
    let str = value.toString();
    return str.charAt(str.length - 1) === '/' ? str.slice(0,str.length - 1) : str;
}


export const assets = (path="",storage="") => {
    let storage_path = Arr.getProperty(Vue._config,`storage.${storage}` , Vue._config.assets_url ) || ""
    return Str.joinWith(storage_path, path,"/");
}


export const VUE_INSTALLER = function( Vue ,config={}){

    Vue._assets = assets;

    Object.defineProperties(Vue.prototype,{
        $_assets:{
            get:() => {
                return Vue._assets;
            }
        }
    })
}