export const removeElement = (element) => {
    if(typeof element.remove == 'function'){
        return element.remove();
    }
    let parent  = element.parentNode;
    return parent.removeChild(element)
}


export const appendQueryStringMark = (value) => {
    let str = value.toString();
    return str.startsWith('?') ? str : "?" + str;
};
export const removeSlashPrefix = (value) =>{
    let str = value.toString();
    return str.startsWith('/') ? str.slice(1,str.length) : str;
}

export const removeSlashSuffix = (value) =>{
    let str = value.toString();
    return str.endsWith('/') ? str.slice(0,str.length - 1) : str;
}


export const assets = (path="",storage="") => {
    let storage_path= storage || Vue.$_config.assets_url || "";
    return removeSlashSuffix(storage_path) + "/" + removeSlashPrefix(path)
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