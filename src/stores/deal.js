export const useDealStore = defineStore('deal', {
    state: () => ({
        projects: [],
        totalProjects: 0,
        projectParams: {},
    }),
    getters: {
        listOfProjects: (state) => state.projects,
    },
    actions: {
        async initProjectDeals() {
            try {
                let params = {
                    page: this.projectParams ? this.projectParams.page : 1,
                    itemsPerPage: this.projectParams ? this.projectParams.itemsPerPage : 10,
                    sortBy: this.projectParams ? this.projectParams.sortBy : [],
                    search: this.projectParams ? this.projectParams.filter : '',
                    filter_month: this.projectParams ? this.projectParams.filter_month : true,
                    filter_today: this.projectParams ? this.projectParams.filter_today : false,
                    filter_year: this.projectParams ? this.projectParams.filter_year : false,
                };

                this.projects = []
                this.totalProjects = 0
                const resp = await axios.get('/production/project/deals', {
                    params: params
                });

                this.projects = resp.data.data.paginated;
                this.totalProjects = resp.data.data.totalData

                this.projects = resp.data.data.paginated;

                console.log("projects", this.projects);

                return resp;
            } catch (error) {
                return error;
            }
        }
    }
});