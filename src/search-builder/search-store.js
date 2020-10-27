
export default {
    namespaced:true,
    state:{ },
    getters:{
    },
    mutations:{
        create(state,search){
            let search = {};
            let id = "random";
            state[id] = search;
        },
        update(context,search){
            state[id] = search;
        }
    },
    actions:{
        dispatch(context,{payload,store,action,id}){
            let mutation = context.state[id]? 'update' : 'create';
            let search =  context.commit(mutation,payload)
            return context.dispatch(`${store}/${action}`,payload, { root:true });
        }
    },
}
