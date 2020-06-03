import Vue from 'vue';
export default {
    deepClone(list,simple=true){

        if(simple){
            return payload = JSON.parse(JSON.stringify(payload));
        }

        var result = list.slice(0);
        for(let i in result){
            var item = Object.assign({},result[i]);
            var key = item.children?'children':'all_children'
            if(Array.isArray(item[key])){
                for(let o in item[key]){
                    item[key][o] = Object.assign({},item[key][o]);
                }
                item[key] = this.deepClone(item[key])
            }
            result[i] = item;
        }
        return result;
    },
    traverse(list,mapping,key="children"){
        var result = list;
        for(let m in mapping){
            var map = mapping[m];
            if(map == 0){continue;}
            var folder = result.find(item=>{
                if(item.id == map){return item}
            });
            if(folder){
                result = folder[key]
            }
        }
        return result;
    },
    add(list,data){
        data = Array.isArray(data)?data:[data];
        for(let i in data){
            var datum = data[i]
            var exists = list.findIndex((item)=>{return datum.id == item.id});
            if(exists != -1){
                Vue.set(list,exists,datum)
            }else{
                list.push(datum);
            }
        }
        return list;
    },
    remove(list,ids){
        var result = list;
        if(!Array.isArray(ids)){ids = [ids]}
        for(let i in ids){
            var rm_id = ids[i]
            var item = result.find(item=>{
                if(item.id == rm_id){
                    return item;
                }
            });
            var index = result.indexOf(item);
            Vue.delete(list,index);
            //result.splice(index,1);
        }
        return result;
    },
    update(list,data){
        for(let i in data){
            var i_data = data[i]
            var item = list.find(item=>{
                if(item.id == i_data.id){return item;}
            });
            var index = list.indexOf(item);
            Vue.set(list,index,i_data);
            //list[index] = i_data;
        }
        return list;
    },
}
