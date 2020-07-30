export const login = {
    createForm(data={},action="login-as",method="POST"){
        let form = document.createElement('form');
        form.setAttribute('method',method);
        form.setAttribute('action',action);

        let csrf_field = document.createElement('input');
        csrf_field.setAttribute('name','_token');
        csrf_field.setAttribute('value',this.getCSRFToken());
        form.appendChild(csrf_field);

        for(let key in data){
            let input = document.createElement('input');
            input.setAttribute('name',key);
            input.setAttribute('value',data[key]);
            form.appendChild(input);
        }
        return form;
    },
    formLoginAs(data={},action="login-as",method="POST"){
        let form = this.createForm(data,action,method);
        document.body.appendChild(form)
        return form.submit();
    },
    getCSRFToken(){
        const csrf = document.getElementsByName('csrf-token')[0]
        if(csrf){
            return csrf.getAttribute('content');
        }
        return '';
    }
}

export default function( Vue ){

    if(Vue._login){
        return;
    }

    Vue._login = login

    Object.defineProperties(Vue.prototype,{
        $login:{
            get:() => {
                return Vue._login;
            }
        }
    })
}