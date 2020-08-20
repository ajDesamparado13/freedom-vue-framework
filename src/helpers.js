export const removeElement = (element) => {
    if(typeof element.remove == 'function'){
        return element.remove();
    }
    let parent  = element.parentNode;
    return parent.removeChild(element)
}


export const appendQueryStringMark = (str) => {
    return str.startsWith('?') ? str : "?" + str;
};
export const removeSlashPrefix = (str) =>{
    return str.startsWith('/') ? str.slice(1,str.length) : str;
}

export const removeSlashSuffix = (str) =>{
    return str.endsWith('/') ? str.slice(0,str.length - 1) : str;
}