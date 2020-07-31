export default {
    data(){
        return {
            block:null,
            loading: false,
            dataIsLoaded:false,
            page:1,
            meta:{},
            search: {},
            orderBy: {},
            paginationSelector:".ui-pagination",
        }
    },
    props:{
        handler:{ type:Function, required:true, },
        focus: { type: Function, required: false },
        doFocusPagination: { type: Boolean, default: true },
    },
    watch:{
        loading(isLoading){
            isLoading ? this.showBlock() : this.closeBlock()
        },
        page(newValue) {
            if (this.loading || !this.dataIsLoaded) {
                return;
            }
            this.$emit("page:change", newValue);
            this.reload({
                page:newValue,
                focus: this.doFocusPagination ? this.focusPagination : this.focus
            })
        }
    },
    computed:{
        hasData(){
            let meta = this.meta;
            let total = 0;
            if(meta.pagination && meta.pagination.total){
                total = meta.pagination.total;
            }
            return total > 0;
        },
        totalPages(){
            let meta = this.meta;
            let total = 1;
            if(meta.pagination && meta.pagination.total_pages){
                total = meta.pagination.total_pages;
            }
            return total;
        },
    },
    methods:{
        showBlock(){
            this.block = this.$block.show();
        },
        closeBlock(){
            this.block = this.block.close();
        },
        getParams() {
            return {
                page: this.page,
                search: this.search,
                orderBy: this.orderBy
            };
        },
        focusPagination() {
            this.$nextTick(() => {
                let el = document.querySelector(this.paginationSelector);
                if (el) {
                    el.scrollIntoView();
                }
            });
        },
        reload(params = {}) {
            this.load(params)
        },
        async load(params={}){
            this.loading = true;
            let config = Object.assign({},params)
            config.page = config.page ? config.page : this.page;
            config.search = config.search || this.search;
            config.orderBy = config.orderBy || this.orderBy;

            this.page = config.page;
            this.search = config.search;
            this.orderBy = config.orderBy;

            let focus = config.focus || this.focus;
            var promise = this.handler(config);
            if(promise && typeof promise.then == 'function'){
                this.meta = await promise
                if(this.dataIsLoaded && typeof focus == 'function'){
                    this.$nextTick(focus);
                }
            }
            this.dataIsLoaded = true;
            this.loading = false;
            let query = this.$querifier.getQueryString(config,true);
            let baseUrl = this.$router.options.base || "";
            history.replaceState({},'',baseUrl + this.$route.path + query)
        },
    },
}
