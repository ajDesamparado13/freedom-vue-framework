export default {
    data(){
        return {
            queryString:'',
        }

    },
    methods:{
        setQueryString(str){
            this.queryString = str;
        },
        getQueryString(str){
            return this.queryString;
        },
        clear(){
            var search = this.value;
            var defaults = this.defaultValues
            Object.keys(search).forEach((key)=>{
                if(typeof defaults == 'object' && defaults[key]){
                    search[key] =  defaults[key];
                    return
                }
                search[key] = "";
            });
            this.search();
            return search;
        },
        trim(search=this.value){
            Object.keys(search).forEach(( key )=>{
                let val = search[key] 
                if(typeof val !== 'string' ){
                    return;
                }

                if(!val.trim()){
                    delete search[name];
                }
            });
            return search;
        },
        async search(search=this.value){
            search = this.trim(this.getValues());
            let is_valid = this.$validator.validateAll();
            if(is_valid){
                this.$emit('search',search)
            }
        },
        getQueryState  (queryString="",key="") {
            if(!queryString){
                queryString = this.$route.query.queryString || ""
            }
            if( queryString && this.queryString != queryString){
                this.queryString = queryString
            }
            let state = this.$_querifier.getQueryObject(this.queryString);
            return ( key ? state[key] : state ) || state
        }

    },
    props:{
        value:{ type:[Object,String], default:'', },
        getValues:{
            type:Function,
            default:()=>{ return ()=>{
                var search = this.value;
                if(typeof search == 'string'){
                    search = {search}
                }

                var values = Object.assign({},search);
                for(let name in search){
                    var val = search[name];
                    if(!val && typeof val != 'number'){
                        delete values[name];
                        continue;
                    }

                    if(!val){
                        delete values[name];break;
                    }
                }
                return values;
            }}
        },
        defaultValues:{
            type:[ Object,String ],
            default:'',
        },
    },
}
