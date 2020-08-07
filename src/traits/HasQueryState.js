export default {
    getQueryState(queryString="",key="")
    {
        if(!queryString){
            queryString = this.$route.query.queryString || ""
        }
        if( queryString && this.queryString != queryString){
            this.queryString = queryString
        }
        let state = this.$querifier.objectify(this.queryString);
        return ( key ? state.search[key] : state ) || state
    },
}
