/*
* DEFINITION OF TERMS
* params = QUERY STRING PARAMETER OF URL
* payload = DATA OBJECT TO BE PASSED ONTO API
*/

import Vue from 'vue';
import Arr from 'freedom-js-support/src/utilities/arr'
import { removeSlashPrefix , removeSlashSuffix, appendQueryStringMark} from '../helpers'

export const file = {
    download(res,file_name=""){
        var blob = res;
        if(res && typeof res.blob == 'function' ){
            res.blob().then(n_blob=>{
                this.load_file(n_blob,file_name);
            })
        }else{
            this.load_file(blob,file_name);
        }

    },
    load_file(blob,file_name){
        if(window.navigator.msSaveBlob){
            window.navigator.msSaveOrOpenBlob(blob,file_name);
        }else{
            //var blob = new Blob([new Uint8Array(byteArray)],{type:'text/csv;charset=UTF-16LE'});
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = file_name;
            document.body.appendChild(link);
            link.target="_self";
            link.style.display='none';
            link.click();
            document.body.removeChild(link);
        }
    },
}


const createBase = ({resource=null,http=null,querifier=null})=>{
    if(resource === null){
        console.error('A RESOURCE PARAM IS REQUIRED')
        throw 'A RESOURCE PARAM IS REQUIRED'
    }
    resource = removeSlashPrefix(resource);

    return {
        web_resource:resource,
        api_resource:resource,
        removeSlashPrefix,
        removeSlashSuffix,
        appendQueryStringMark,
        getPrefix(useApi=true){
            if(!useApi){
                return Vue._config.web_prefix || Vue._config.app_url ;
            }
            return Vue._config.api_prefix 
        },
        getResource(config={}){
            const useApi = Arr.getProperty(config,'useApi',true);
            let prefix = this.removeSlashSuffix(this.getPrefix(useApi));
            let resource = this.api_resource;;
            if(!resource){
                return prefix;
            }
            return prefix + "/" + resource
        },
        getQuerifier(){
            let util = querifier || Vue._querifier;
            if(util === null){
                console.error('A QUERIFIER UTILITY IS REQUIRED')
                throw 'A QUERIFIER UTILITY IS REQUIRED'
            }
            return util;
        },
        getHttp(){
            let util = http || Vue.http;
            if(util === null){
                console.error('A HTTP UTILITY IS REQUIRED')
                throw 'A HTTP UTILITY IS REQUIRED'
            }
            return util;
        },
        makeUrl(url,params,config={}){
            const endpoint = url ? this.removeSlashSuffix(this.removeSlashPrefix(url)) : "" ;
            const queryString = params ? this.appendQueryStringMark(this.getQueryString(params)) : ""

            return this.getResource(config) + "/" + endpoint + queryString;
        },
        /*
        * TRANSFORM A REQUEST PAYLOAD INTO FORM DATA PAYLOAD
        * Intended for api request with file upload
        */
        getFormData(payload,action="POST",simple=true){
            let fdata = new FormData();
            var file_keys = this.file_keys;
            let payload_file_keys  = payload.fileKey.split(';');
            if(payload_file_keys.length > 0){
                file_keys = file_keys.concat(payload_file_keys);
            }
            var n_payload;

            if(simple){
                //do simple deep clone with stringify
                //stringify will convert date/time to string
                n_payload = JSON.parse(JSON.stringify(payload));
                n_payload = Object.assign({},payload);
            }else{
                //do deep clone of payload
                //unlike stringify which only clone date/time by string
            }

            for(let i in file_keys){
                var key = file_keys[i];
                if(payload[key]){
                    var file = payload[key];
                    delete(n_payload[key]);

                    if(typeof file.name == 'string'){
                        fdata.append(key,file);
                    }
                }
            }


            for ( var key in n_payload) {
                var load = n_payload[key];

                if(!key || typeof load == 'undefined' || (typeof load == 'string' && load.length==0)){
                    continue;
                }

                load = typeof load == 'boolean'?Number(load):load;

                if(Array.isArray(load)){
                    fdata.append(key,JSON.stringify(load));
                }else if(typeof load == 'object') {
                    fdata.append(key, JSON.stringify(load))
                }else if(typeof load == 'number' || load){
                    fdata.append(key,load)
                }
            }

            fdata.append('_method',action);
            return fdata;
        },

        getQueryString(params)
        {
            let querifier = this.getQuerifier();
            return querifier.getQueryString(params)
        },
    }
}

export default function (model={},{resource=null,http=null,querifier=null,baseOnly=false}) {

    let base = createBase({ resource,querifier,http });

    if(baseOnly){
        return Object.assign(base,model);
    }

    return Object.assign(base,{
        /*
        * EXECUTE A GENERIC API REQUEST
        */
        request(path,options){
            var method = typeof options == 'object' && options.method ? options.method : 'get';
            var params = typeof options == 'object' && options.param ? options.param : "";
            let url = this.makeUrl(path,params);
            return this.getHttp()[method](url,{timeout:0});
        },
        /*
        * SEND GET REQUEST TO  API INDEX
        * Intended for getting a collection or paginated api resource data
        */
        index(params="",config={}){
            var headers = config['headers'] || {}
            const url = this.makeUrl('',params);
            return this.getHttp().get(url,{timeout:0,headers},);
        },
        /*
        * SEND POST REQUEST TO  API INDEX
        * Intended for adding an api resource data
        */
        store(payload,params="",config={}){
            var headers = config['headers'] || {}

            if(this.form_methods.includes('store')){
                payload = this.getFormData(payload,'POST')
            }

            const url = this.makeUrl('',params);
            return this.getHttp().post(`${url}`,payload,config);
        },
        /*
        * SEND DELETE REQUEST TO  API INDEX
        * Intended for deleting an api resource data
        */
        destroy(id,params="", config={} ){
            const url = this.makeUrl(id,params);
            return this.getHttp().delete(`${url}`,config);
        },
        /*
        * SEND PUT REQUEST TO  API INDEX
        * Intended for updating an api resource data
        */
        update(id,payload, params="", config={} ){
            const url = this.makeUrl(id,params);

            if(this.form_methods.includes('update')){
                payload = this.getFormData(payload,'PUT')
            }
            return this.getHttp().put(url,payload,config);
        },
        /*
        * SEND GET REQUEST TO  API SHOW
        * Intended for getting specific api resource data
        */
        show(id,params="",config={}){
            const url = this.makeUrl(id,params);
            return this.getHttp().get(`${url}`,config);
        },
        self(params="",config={}){
            const url = this.makeUrl('self',params);
            return this.getHttp().get(`${url}`,config);
        },
        selfUpdate(payload, params="", config={} ){
            const url = this.makeUrl('self',params);

            if(this.form_methods.includes('update')){
                payload = this.getFormData(payload,'PUT')
                return this.getHttp().post(`${url}`,payload,config);
            }
            return this.getHttp().put(`${url}`,payload,config);
        },
        /*
        * DOWNLOAD FROM API
        * Intended for download
        */
        download(endpoint,payload={},params=null){
            const url = this.makeUrl(endpoint,params,{useApi:false});
            return file.download(this.getHttp().post(url,payload,{responseType:"blob"}));
        },
        /*
        * UPLOAD PAYLOAD INTO API
        * Intended for api request with file upload
        */
        upload(payload,params,config={}){
            var fdata = this.getFormData(payload);
            const url = this.makeUrl('upload',params);
            return this.getHttp().post(`${url}`,fdata,config);
        },

        /*
        * WHICH PAYLOAD KEY IS A FILE
        */
        file_keys:['file'],

        /*
        *  METHODS THAT WOULD TRANSFORM A REQUEST PAYLOAD INTO FORM DATA PAYLOAD
        */
        form_methods:['upload'],
    },model);
}
