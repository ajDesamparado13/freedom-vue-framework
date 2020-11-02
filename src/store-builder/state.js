const listing = function (){
    return {
        list: []
    };
}


const record = function(config={}){
    const model = config.model || {}
    return Object.assign({},model)
}


export default { listing,record };
