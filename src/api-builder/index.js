import base from './base';

const app_url = process.env.MIX_APP_URL;
const api_prefix = `${app_url}/api`;
const web_prefix = `${app_url}`;

if(process.env.MIX_APP_ENV != 'production'){
    window.api_builder = base;
    window.example_a = {
        search: {field1: "value_1", field2: "value_2", field3: "value_3", field4: "value_4"},
        orderBy: "orderValue",
        sortedBy: "sortedValue",
    }
    window.example_b = {
        search: {field1: "value_1", field2: "value_2", field3: "value_3", field4: "value_4"},
        orderBy: { field1:'orderValue1',field2:'orderValue2'},
        sortedBy: "sortedValue",
    }
    //example usage window.api_builder.getQueryString(window.example_a)
}

export {
    base,
    api_prefix,
    web_prefix,
}

export function build(part,basis=base){
    for(let p in basis){
        if(!part[p]){
            var prop = basis[p];
            part[p] = prop;
        }
    }
    return part
}

export default build;
