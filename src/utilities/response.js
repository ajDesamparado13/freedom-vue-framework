export default function( Vue ){

    Vue._response={
        getData(response,config={}){
            return response.data || {}

        },
        getError(response,config={}){
            let error = response;
            do {
                error = !error.error ? response.data : error.error;
            }while(error.data || error.error)

            return error || {};
        },
        getMessage(data,config={}){
            return {}
            let type = config['type'] || 'error';
            return data[type];
        }
    }

    Object.defineProperties(Vue.prototype,{
        $response:{
            get:() => {
                return Vue._response;
            }
        }
    })
}
