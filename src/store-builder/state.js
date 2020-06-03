const listing = function (){
    return {
        search: "",
        meta: {
            current_page: 0,
            from: 0,
            last_page: 0,
            per_page: 15,
            to: 0,
            total: 0
        },
        list: []
    };
}


const record = function(config={}){
    const model = config.model || {}
    return Object.assign({},model)
}


export default { listing,record };
