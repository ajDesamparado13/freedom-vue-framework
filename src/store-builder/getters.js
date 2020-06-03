const listing = function () {
    return {
        all: state => {
            return state.list.filter(item => {
                return Boolean(item);
            });
        },
        find: state => (id, namespace, key = "id") => {
            id = key == "id" ? Number(id) : id;
            return state.list.find(item => {
                return item[key] == id;
            });
        },
        limit: state => (count, start = 0) => {
            return state.list.slice(start, count);
        },
        offset: state => (count, end = state.list.length) => {
            return state.list.slice(count, end);
        },
        isEmpty(state) {
            return state.list.length == 0;
        },
        last: (state) => (key="id") => {
            return _.maxBy(state.list,(item)=>{
                return item[key]
            });
        }
    }
}
const record = function (config){
    let model = config.model || {}
    let definition = {
        data : state => {
            return state;
        }
    }

    for(let key in model){
        definition[key] = (state) =>{
            return state[key]
        }
    }
    return definition;
}

export default { listing,record };
