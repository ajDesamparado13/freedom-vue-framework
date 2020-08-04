import Vue from 'vue'


export default function(model={},config={}){
    const api = config.api || null;
    var profile = config.profile || { id:'', first_name: '', last_name: '', email: '', }

    if(!api){
        console.error('AN API FOR AUTH IS REQUIRED')
        throw 'AN API FOR AUTH IS REQUIRED'
    }

    if(typeof model != 'object' || Array.isArray(model)){
        console.error('MODEL PARAM MUST BE STORE MODULE OBJECT')
        throw 'MODEL PARAM MUST BE STORE MODULE OBJECT'
    }


    let store = {
        namespaced:true,
        state : {
            authenticated: false,
            profile,
            token: null,
            role: null,
            email_remember: '',
        },
        getters : {
            isAuthenticated(state){return state.authenticated},
            hasToken(state){return Boolean(state.token)},
            getToken(state){return state.token},
            role(state){return state.role},
            profile(state){return state.profile},
            getRememberEmail(state){ return state.email_remember},
        },
        mutations : {
            refresh(state,token){
                if(token) {
                    state.token = token
                }
            },
            clear(state){
                state.token = null;
            },
            update(state,payload){
                state.profile = payload;
            },
            set(state,payload){
                state.authenticated = true;
                state.profile = payload.user;
                state.role = payload.user.role;
                if(payload.token) {
                    state.token = payload.token
                }
            },
            remove(state) {
                state.authenticated = false
                state.profile = profile
                state.role = null
                state.token = null
            },
            setEmail(state, email) {
                state.email_remember = email;
            }
        },
        actions : {
            logout(context,payload={}){
                const preventDefault = payload.preventDefault || false
                api.logout();
                context.commit('remove');
                if(!preventDefault){
                    Vue.bus.emit('logout')
                }
            },
            check(context, payload) {
                return new Promise( async (resolve,reject)=>{
                    if(context.state.authenticated) {
                        try{
                            let response = await api.check();
                        }catch(error){
                        }
                    }
                    resolve();
                })
            },
            refresh(context, payload) {
                return new Promise((resolve,reject)=>{
                    api.refresh().then(success=>{
                        var store_payload = success.data['token'];
                        context.commit('refresh', store_payload)
                        resolve();
                    },error=>{
                        //todo: change code when has more user types
                        if(context.state.authenticated != true){
                            context.commit('remove')
                            Vue.bus.emit('logout')
                        }
                        reject();
                    })
                })
            },
            login(context, payload) {
                var next = payload.to;
                return new Promise((resolve,reject)=>{
                    api.login(payload).then(success=>{
                        payload = success.data;
                        context.commit('set',payload);
                        if(!next){
                            Vue.bus.emit('login',payload);
                        }else{
                            Vue.bus.emit('login',payload);
                        }
                        resolve(payload);
                    },error=>{
                        context.commit('remove');
                        reject(error.data);
                    });
                })
            },
        }
    }

    Object.keys(model).forEach((key)=>{
        let definition = model[key];
        if(typeof definition === 'object'){
            store[key] = Object.assign(store[key],model[key])
        }
    })

    return store;
}
