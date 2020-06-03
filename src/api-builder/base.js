/*
* DEFINITION OF TERMS
* params = QUERY STRING PARAMETER OF URL
* payload = DATA OBJECT TO BE PASSED ONTO API
*/

import Vue from 'vue';
const querifyable = ['search','with','searchFields','searchJoin','filter','sortedBy','orderBy'];
export default {
    /*
    * EXECUTE A GENERIC API REQUEST
    */
    request(path,options){
        var method = typeof options == 'object' && options.method ? options.method : 'get';
        var params = typeof options == 'object' && options.param ? options.param : "";

        var queryString = params?this.getQueryString(params):"";

        path = path ? "/"+path : "";
        var url = `${ this.api_resource }${path}${queryString}`;
        return Vue.http[method](url,{timeout:0});
    },
    /*
    * SEND GET REQUEST TO  API INDEX
    * Intended for getting a collection or paginated api resource data
    */
    index(params="",config={}){
        var headers = config['headers'] || {}
        var url = `${ this.api_resource }${this.getQueryString(params)}`;
        return Vue.http.get(url,{timeout:0,headers},);
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

        var url = `${ this.api_resource }${this.getQueryString(params)}`;
        return Vue.http.post(`${url}`,payload,{ headers });
    },
    /*
    * SEND DELETE REQUEST TO  API INDEX
    * Intended for deleting an api resource data
    */
    destroy(id,params="", config={} ){
        var headers = config['headers'] || {}
        var url = `${ this.api_resource }/${id}${this.getQueryString(params)}`;
        return Vue.http.delete(`${url}`,{headers});
    },
    /*
    * SEND PUT REQUEST TO  API INDEX
    * Intended for updating an api resource data
    */
    update(id,payload, params="", config={} ){
        var headers = config['headers'] || {}
        var url = `${ this.api_resource }/${id}${this.getQueryString(params)}`;

        if(this.form_methods.includes('update')){
            payload = this.getFormData(payload,'PUT')
            return Vue.http.post(`${url}`,payload,{headers});
        }
        return Vue.http.put(`${url}`,payload,{headers});
    },
    /*
    * SEND GET REQUEST TO  API SHOW
    * Intended for getting specific api resource data
    */
    show(id,params="",config={}){
        var headers = config['headers'] || {}
        var url = `${ this.api_resource }/${id}${this.getQueryString(params)}`;
        return Vue.http.get(`${url}`,{headers});
    },
    self(params="",config={}){
        var headers = config['headers'] || {}
        var url = `${ this.api_resource }/self${this.getQueryString(params)}`;
        return Vue.http.get(`${url}`,{headers});
    },
    selfUpdate(payload, params="", config={} ){
        var headers = config['headers'] || {}
        var url = `${ this.api_resource }/self${this.getQueryString(params)}`;

        if(this.form_methods.includes('update')){
            payload = this.getFormData(payload,'PUT')
            return Vue.http.post(`${url}`,payload,{headers});
        }
        return Vue.http.put(`${url}`,payload,{headers});
    },
    /*
    * DOWNLOAD FROM API
    * Intended for download
    */
    download(params,endpoint="/download",payload={},response={responseType:"blob"}){
        const web_resource = this.web_resource;
        var url = `${ web_resource }${endpoint}${this.getQueryString(params)}`;
        return Vue.http.post(url,payload,response);
    },
    /*
    * UPLOAD PAYLOAD INTO API
    * Intended for api request with file upload
    */
    upload(payload,params,config={}){
        var headers = config['headers'] || {}
        var fdata = this.getFormData(payload);
        var url = `${ this.api_resource }/upload${this.getQueryString(params)}`;
        return Vue.http.post(`${url}`,fdata);
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

    /*
    * GET THE QUERY PARAMETER STRING
    * IF OBJECT: { search: {field1:value1, field2:value2 }}
    * TRANSFORMS INTO ?search=field1:value1;field2:value2
    * IF STRING field1=value1
    * TRANSFORM INTO ?field1=value1
    * @returns string
    */
    getQueryString(params){

        if(!params){
            //PARAMETER IS EMPTY RETURN
            return'';
        }

        // IF PARAMETER IS ALREADY A STRING THEN SIMPLY RETURN THE STRING
        if(typeof params == 'string'){
            return params.indexOf('?')!=-1?params:`?${params}`
        }

        var queries = []
        // IF PARAMETER IS AN OBJECT THEN BUILD QUERY STRING FROM OBJECT
        if(typeof params == 'object'){
             queries = queries.concat(this.querify(params,0));
        }

        return queries.length>0?`?${queries.join('&')}`:''
    },
    querify(params,level=1,delimeter="="){
        if(!params){
            return [];
        }
        var queries = [];
        for(let key in params){
            var param = params[key];
            const is_array = Array.isArray(param);
            const is_queryfyable = querifyable.includes(key);
            //if(key === 'search'){
            //    param = encodeURI(param);
            //}
            if(typeof param == 'object' && !is_array && is_queryfyable){
                queries.push( this.getCriteriaString(param,key) );
                continue;
            }

            if(is_array){
                queries.push(`${key}=${param.join( is_queryfyable ? ';' : ',')}`)
            }
            else if(typeof param == 'object'){
                queries = queries.concat(this.querify(param,level+1));
            }
            else if(param || typeof param == 'number'){
                queries.push(key+delimeter+param)
            }
        }
        return queries;
    },
    /*
    * TRANSFORMED Criteria Object INTO STRING
    * refer to http://andersonandra.de/l5-repository/#using-the-requestcriteria for sample query strings
    * @returns string
    */
    getCriteriaString(params,key){
        var searches = [];
        for(let key in params){
            var val = params[key];
            searches.push(`${key}:${val}`);
        }
        return key+"="+searches.join(';');
    },

    /*
    * WHICH PAYLOAD KEY IS A FILE
    */
    file_keys:['file'],

    /*
    *  METHODS THAT WOULD TRANSFORM A REQUEST PAYLOAD INTO FORM DATA PAYLOAD
    */
    form_methods:['upload'],
}
