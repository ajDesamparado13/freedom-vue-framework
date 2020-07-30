export const querifier = {
    querifyable : ['search','with','searchFields','searchJoin','filter','orderBy','meta'],
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
            const is_queryfyable = this.querifyable.includes(key);
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

            if(val === "" || val === null || typeof val === 'undefined'){
                continue;
            }

            if(Array.isArray(val)){
                if(val.length > 0){
                    searches.push(`${key}:${val.join(',')}`)
                }
                continue;
            }

            searches.push(`${key}:${val}`);
        }
        return key+"="+searches.join(';');
    },
}

export default function( Vue ){

    if(Vue._querifier){
        return;
    }

    Vue._querifier = querifier

    Object.defineProperties(Vue.prototype,{
        $querifier:{
            get:() => {
                return Vue._querifier;
            }
        }
    })
}