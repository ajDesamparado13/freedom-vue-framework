import axios from 'axios'

const resource_dependency = {
    install : (Vue,options) => {

        const http = axios.create({
            baseURL:Vue._config.app_url,
        })
        //http.defaults.withCredentials = true;
        //axios.defaults.headers.common = {
        //    //'X-Requested-With':'XMLHTTPRequest',
        //}


        //SET X-CSRF-TOKEN IN HEADERS
        const csrf = document.getElementsByName('x-csrf-token')[0]
        if(csrf){
            http.defaults.headers.common['X-CSRF-TOKEN'] = csrf.getAttribute('content')
            csrf.remove();
        }

        //SET X-APP-TOKEN IN HEADERS
        const app_token = document.getElementsByName('x-app-token')[0]
        if(app_token){
            http.defaults.headers.common['X-APP-TOKEN'] = app_token.getAttribute('content')
            app_token.remove();
        }

        //SETUP HEADERS
        const storage_key = Vue._config.storage_key;
        if(localStorage[storage_key]){
            const storage = JSON.parse(localStorage[storage_key]);
            //SETUP AUTHORIZATION BEARER TOKEN
            var token = storage.Auth.token;
            if(token){
                http.defaults.headers.common.Authorization =  'Bearer ' + token
            }
            //SETUP CUSTOM HEADERS FROM PRELOAD
            for(let header in storage.Preload.headers ){
                http.defaults.headers.common[header] = storage.Preload.headers[header]
            }
        }



        http.defaults.baseURL = Vue._config.app_url
        http.defaults.headers.common.Accept =  "application/json"

        //    //DISPLAY RETURNED MESSAGE FROM API
        var notification = (response)=>{
            //var data = response.data;
            //if(data.message && data.display && !data.await){
            //    var display = data.display.split('|');
            //    var type = display[1];

            //    switch(type){
            //        case 'successful':
            //        case 'success':
            //            type = "info"
            //            break;
            //        case 'failed':
            //        case 'fail':
            //        case 'error':
            //            type = "error"
            //            break;
            //    }

            //    switch(display[0]){
            //        case 'alert':
            //        case 'notification': Vue.prototype.$notification.show({ message:data.message,type });break;
            //        case 'toast': Vue.prototype.$toast.show({ message:data.message,type });break;
            //    }
            //}
        }
        http.interceptors.request.use((request)=>{
            return request;
        },(error)=>{
            return Promise.reject(error);
        });
        http.interceptors.response.use(response=>{
            return response;
        },error=>{
            notification(error.response);
            return Promise.reject(error.response)

        })

        Vue.http = http;
        Vue.prototype.$http = http
        Vue.use(http)
        window.http = http;
    }
}

if(typeof window != 'undefined' && window.Vue){
    window.Vue.use(resource_dependency);
}

export default resource_dependency;
