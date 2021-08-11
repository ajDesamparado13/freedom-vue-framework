const APP_URL = process.env.MIX_APP_URL;
const APP_ENV = process.env.MIX_APP_ENV;
const APP_DEBUG = process.env.MIX_APP_DEBUG;
const APP_DOMAIN = process.env.MIX_APP_DOMAIN;
const APP_VERSION = process.env.MIX_APP_VERSION || "v1.0.0";
const APP_NAME = process.env.MIX_APP_NAME || "app";
const APP_PASSWORD_BIT = process.env.MIX_APP_PASSWORD_BIT;
const APP_MAINTENANCE_MODE = process.env.APP_MAINTENANCE_MODE;
const APP_MAINTENANCE_SECRET = process.env.APP_MAINTENANCE_SECRET;

const _config = {
    app_env:APP_ENV,
    app_version:APP_VERSION,
    app_password_bit:APP_PASSWORD_BIT,
    app_url:APP_URL,
    app_debug:APP_DEBUG == "true",
    app_domain:APP_DOMAIN,
    app_maintenance_mode : APP_MAINTENANCE_MODE == "true",
    app_maintenance_secret : APP_MAINTENANCE_SECRET,
    storage_key:`${APP_NAME}_${APP_VERSION}`,
    api_prefix : `${APP_URL}/api`,
    web_prefix : `${APP_URL}`,
    storage_prefix : `${APP_URL}`,
    assets_url : `${APP_URL}`,
}

export default function( Vue ,config={}){

    Vue._config = Object.assign(_config,config)

    Object.defineProperties(Vue.prototype,{
        $_config:{
            get:() => {
                return Vue._config;
            }
        }
    })
}
