import Vue from 'vue';
export default {
    namespaced:true,
    state:{
        headers:{},
        data:null
    },
    getters:{
        get: state => {
            return state.data;
        }
    },
    mutations:{
        addHeader(state,payload){
            state.headers = Object.assign(state.headers,payload);

        },
        set(state,payload)
        {
            state.data = payload;
        }
    },
    actions:{
        pop(context){
            return new Promise((resolve,reject)=>{
                var data = context.state.data;
                context.state.data = null;
                resolve(data);
            });
        },
        load(context,route){
            return new Promise((resolve,reject)=>{
                Vue.http.get(route).then((res)=>{
                    var data = res.data.data;
                    resolve(data);
                });
            })
        },
        addHeader(context,payload){
            return new Promise((resolve,reject) => {
                context.commit('addHeader',payload);
            })
        }

    },
}
