const APP_URL = process.env.MIX_APP_URL;
const APP_ENV = process.env.MIX_APP_ENV;
const APP_DEBUG = process.env.MIX_APP_DEBUG;
const APP_DOMAIN = process.env.MIX_APP_DOMAIN;
const APP_VERSION = process.env.MIX_APP_VERSION || "v1.0.3";
const APP_NAME = process.env.MIX_APP_NAME || "app";
const APP_PASSWORD_BIT = process.env.MIX_APP_PASSWORD_BIT;

export default function( Vue ,config={}){

    let _config = Object.assign({
        app_env:APP_ENV,
        app_version:APP_VERSION,
        app_password_bit:APP_PASSWORD_BIT,
        app_url:APP_URL,
        app_debug:APP_DEBUG == "true",
        app_domain:APP_DOMAIN,
        storage_key:`${APP_NAME}_${APP_VERSION}`,
        api_prefix : `${APP_URL}/api`,
        web_prefix : `${APP_URL}`,
    },config)

    Vue._config = _config

    Object.defineProperties(Vue.prototype,{
        $_config:{
            get:() => {
                return Vue._config;
            }
        }
    })
}
