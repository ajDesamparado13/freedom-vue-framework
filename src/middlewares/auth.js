const defaultOnUnauthenticated = ({store,next,to,from}) => {
    return { name:'sign-in'}

}

const withIn = (user_role,roles)=>{
    if(user_role){
        for(let r in roles){
            var role = roles[r];
            if(user_role == role){
                return true;
            }
        }
    }
    return false;
}

export default function(_permissions,params={}){
    let onUnauthenticated = params.onUnauthenticated ? params.onUnauthenticated : defaultOnUnauthenticated;

    let permissions = _permissions;
    if(!Array.isArray(_permissions) && permissions ){
        permissions = permissions.indexOf('|') !== -1 ? permissions.split('|') : [permissions];
    }


    return function({store,next,to,from}){
        let context = {store,next,to,from}
        let isAuthenticated = store.getters['Auth/isAuthenticated'];

        if(!isAuthenticated){
            return next(typeof onUnauthenticated == 'function' ? onUnauthenticated(context) : onUnauthenticated);
        }

        store.dispatch('Auth/check');

        if(_permissions === 'authenticated'){
            return next();
        }

        let role = store.getters['Auth/role'];
        if(!withIn(role,permissions)){
            return next(typeof onUnauthenticated == 'function' ? onUnauthenticated(context) : onUnauthenticated);
        }
        return next();
    }
}
