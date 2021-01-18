const model = function({ api={}}) {
    return {
        set(context,payload){
            return new Promise((resolve,reject) => {
                context.commit('set',payload)
                resolve(payload);
            });
        },
        find(context, params) {
            return new Promise((resolve, reject) => {
                api.find(params).then(
                    response => {
                        //var item = response.data.data;
                        //context.commit('add',item);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        all(context, params) {
            return new Promise((resolve, reject) => {
                api.all(params).then(
                    response => {
                        var items = response.data.data;
                        context.commit("set", items);
                        resolve(response.data);
                    },
                    response => {
                        reject(response);
                    }
                );
            });
        },
        index(context, params) {
            var join = !params ? false : params.join ? params.join : false;
            if (params && params.join) {
                delete params.join;
            }
            return new Promise((resolve, reject) => {
                api.index(params).then(
                    response => {
                        var items = response.data.data;
                        context.commit(join ? "join" : "set", items);
                        resolve(response.data);
                    },
                    response => {
                        reject(response);
                    }
                );
            });
        },
        indexSet(context,params){
            return new Promise((resolve, reject) => {
                api.index(params).then(
                    response => {
                        var items = response.data.data;
                        context.commit("set", items);
                        resolve(response.data);
                    },
                    response => {
                        reject(response);
                    }
                );
            });
        },
        indexAppend(context,params){
            return new Promise((resolve, reject) => {
                api.index(params).then(
                    response => {
                        var items = response.data.data;
                        context.commit("join", items);
                        resolve(response.data);
                    },
                    response => {
                        reject(response);
                    }
                );
            });
        },
        get(context, id) {
            id = Number(id);
            return new Promise((resolve, reject) => {
                api.show(id).then(
                    response => {
                        var item = response.data.data;
                        context.commit("add", item);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        remove(context, datum) {
            var rm_id = datum.id ? datum.id : datum;
            var params = datum.params ? datum.params : null;
            if (params) {
                delete rm_id.params;
            }
            return new Promise((resolve, reject) => {
                api.destroy(rm_id, params).then(
                    response => {
                        context.commit("remove", datum);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        update(context, datum) {
            var payload = datum.data ? datum.data : datum;
            var params = datum.params ? datum.params : null;
            if (params) {
                delete payload.params;
            }
            return new Promise((resolve, reject) => {
                api.update(payload.id, payload, params).then(
                    response => {
                        var store_payload = response.data.data;
                        context.commit("update", store_payload);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        add(context, datum) {
            var payload = datum.data ? datum.data : datum;
            return new Promise((resolve, reject) => {
                api.store(payload).then(
                    response => {
                        var store_payload = response.data.data;
                        context.commit("add", store_payload);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        upload(context, datum) {
            var payload = datum.data ? datum.data : datum;
            var params = datum.params;
            if (payload.params) {
                delete payload.params;
            }
            return new Promise((resolve, reject) => {
                api.upload(payload, params).then(
                    response => {
                        var store_payload = response.data.data;
                        context.commit("add", store_payload);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        clear(context) {
            context.commit("clear");
        },
        api(context) {
            return api;
        },
        validateAdd(context, datum) {
            var payload = datum.data ? datum.data : datum;
            return new Promise((resolve, reject) => {
                api.store(payload,{_actionName:'validate'}).then(
                    response => {
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        validateUpdate(context, datum) {
            var payload = datum.data ? datum.data : datum;
            return new Promise((resolve, reject) => {
                api.update(payload,{_actionName:'validate'}).then(
                    response => {
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
    };
};

const listing = function({api}) {
    return model({api})
}

const record =  function({api}){
    let basis  = Object.assign((({ api,clear,set,upload })=> ({api,clear,set,upload }))(model({api})),
    {
        get(context, id) {
            id = Number(id);
            return new Promise((resolve, reject) => {
                api.self().then(
                    response => {
                        var item = response.data.data;
                        context.commit("set", item);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        update(context, datum) {
            var payload = datum.data ? datum.data : datum;
            var params = datum.params ? datum.params : null;
            if (params) {
                delete payload.params;
            }
            return new Promise((resolve, reject) => {
                api.selfUpdate(payload, params).then(
                    response => {
                        var store_payload = response.data.data;
                        context.commit("set", store_payload);
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        validateUpdate(context, datum) {
            var payload = datum.data ? datum.data : datum;
            return new Promise((resolve, reject) => {
                api.selfUpdate(payload,{_actionName:'validate'}).then(
                    response => {
                        resolve(response.data);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
    });
    return basis;
}

export default { listing,record };
