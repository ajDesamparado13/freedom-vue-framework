const defaultOnAuthenticated = ({store,next,to,from}) => {
    return { name:'home'}
}


export default function(params={}){

    let onAuthenticated = params.onAuthenticated ? params.onAuthenticated : defaultOnAuthenticated;

    return function ({store,next,to,from}){

        let context = {store,next,to,from}

        let isAuthenticated = store.getters['Auth/isAuthenticated']

        if(isAuthenticated){
            return next(typeof onAuthenticated == 'function' ? onAuthenticated(context) : onAuthenticated);
        }
        return next();
    }

}
