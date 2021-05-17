import Vue from 'vue'
import Arr from 'freedom-js-support/src/utilities/arr';

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
            has_verified_2fa:false,
        },
        getters : {
            hasVerified2FA(state){ return state.has_verified_2fa; },
            isAuthenticated(state){return state.authenticated && Boolean(state.token)},
            hasToken(state){return Boolean(state.token)},
            getToken(state){return state.token},
            role(state){return state.role},
            profile(state){return state.profile},
            getRememberEmail(state){ return state.email_remember},
        },
        mutations : {
            hasVerified2FA( state ,value=true){
                return state.has_verified_2fa = Boolean(value);
            },
            refresh(state,token){
                state.token = token
            },
            clear(state){
                state.token = null;
            },
            update(state,payload){
                state.profile = payload;
            },
            set(state,payload){
                state.authenticated = true;
                state.profile = Arr.getProperty(payload,'user',null);
                state.role = Arr.getProperty(payload,'user.role', Arr.getProperty(payload,'role',''));
                state.token = Arr.getProperty(payload,'token',null)
            },
            remove(state) {
                state.authenticated = false
                state.profile = profile
                state.role = null
                state.token = null
                state.has_verified_2fa = false
            },
            setEmail(state, email) {
                state.email_remember = email;
            }
        },
        actions : {
            logout(context,payload={}){
                const preventDefault = Arr.getProperty(payload,'preventDefault',false)
                api.logout();
                context.commit('remove');
                if(!preventDefault){
                    Vue.bus.emit('logout')
                }
            },
            check(context) {
                return new Promise( async (resolve,reject)=>{
                    if(context.getters['isAuthenticated']) {
                        try{
                            await api.check();
                        }catch(error){ }
                    }
                    resolve();
                })
            },
            refresh(context) {
                return new Promise(async(resolve,reject)=>{
                    try{
                        let response = await api.refresh();
                        context.commit('refresh', Arr.getProperty(response,'data.token',null))
                        resolve(response);
                    }catch(error){
                        if(!context.getters['isAuthenticated']){
                            context.commit('remove')
                            Vue.bus.emit('logout')
                        }
                        reject(error);
                    }
                })
            },
            login(context, payload) {
                return new Promise( async (resolve,reject)=>{
                    try{
                        let response = await api.login(payload);
                        payload = Arr.getProperty(response,'data',payload );
                        context.commit('set',payload);
                        Vue.bus.emit('login',payload);
                        resolve(payload);
                    }catch(error){
                        reject(Arr.getProperty(error,'data',null));
                    }
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
