import builder from './builder';

export default function (model={},config={}){
    let api = Object.assign({
        check(payload){
            const url = this.makeUrl('check-token',payload);
            return this.getHttp().get(url);
        },
        refresh(payload,headers={}){
            const url = this.makeUrl('refresh',payload);
            return this.getHttp().post(url);
        },
        login(payload,headers={}){
            const url = this.makeUrl('login');
            return this.getHttp().post(url,payload,{withCredentials:true});
        },
        logout(payload={},headers={}){
            const url = this.makeUrl('logout');
            return this.getHttp().post(url,payload);
        },
        forgot_password(payload,headers={}){
            const url = this.makeUrl('forgot-password');
            return this.getHttp().post(url,payload);
        },
        change_password(payload,headers={}){
            const url = this.makeUrl('change-password');
            return this.getHttp().post(url,payload);
        },
    },model)
    config.baseOnly = true;
    return builder(api,config)
}