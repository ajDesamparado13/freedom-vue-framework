import {removeElement} from './helpers'
import axios from 'axios'

const resource_dependency = {
    install : (Vue,options) => {

        const http = axios.create({
            baseURL:Vue._config.app_url,
        })

        //SET X-CSRF-TOKEN IN HEADERS
        const csrf = document.getElementsByName('x-csrf-token')[0]
        if(csrf){
            http.defaults.headers.common['X-CSRF-TOKEN'] = csrf.getAttribute('content')
            removeElement(csrf);
        }

        //SET X-APP-TOKEN IN HEADERS
        const app_token = document.getElementsByName('x-app-token')[0]
        if(app_token){
            http.defaults.headers.common['X-APP-TOKEN'] = app_token.getAttribute('content')
            removeElement(app_token);
        }

        //SETUP HEADERS
        const storage_key = Vue._config.storage_key;

        const _localStorage = localStorage[storage_key] ? JSON.parse(localStorage[storage_key]) : null;
        const _sessionStorage = sessionStorage[storage_key] ? JSON.parse(sessionStorage[storage_key]) : null;

        const auth_storage = ( _localStorage && _localStorage.Auth ) || (_sessionStorage && _sessionStorage.Auth)
        if(auth_storage){
            //SETUP AUTHORIZATION BEARER TOKEN
            var token = auth_storage.token;
            if(token){
                http.defaults.headers.common.Authorization =  'Bearer ' + token
            }
        }

        if(_localStorage && _localStorage.Preload){
            //SETUP CUSTOM HEADERS FROM PRELOAD
            for(let header in _localStorage.Preload.headers ){
                http.defaults.headers.common[header] = _localStorage.Preload.headers[header]
            }
        }

        http.defaults.baseURL = Vue._config.app_url
        http.defaults.headers.common.Accept =  "application/json"

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
