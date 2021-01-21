export default {
    methods:{
        getForm(){
            return this.form || {};
        },
        sanitizeValue(value,key){
            return value;
        },
        setValue(value,key){
            let form = this.getForm()
            if(form.hasOwnProperty(key)){
                form[key] = this.sanitizeValue(value,key)
            }
            return this;
        },
        addValue(value,key){
            this.getForm()[key] = this.sanitizeValue(value,key)
            return this;
        },
        deleteValue(key){
            let form = this.getForm()
            if(form.hasOwnProperty(key)){
                delete form[key]
            }
            return this;
        },
    }
}

