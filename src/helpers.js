export const removeElement = (element) => {
    if(typeof element.remove == 'function'){
        return element.remove();
    }
    let parent  = element.parentNode;
    return parent.removeChild(element)
}
