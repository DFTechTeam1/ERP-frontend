import axios from "axios";
import { defineStore } from "pinia";

export const useProjectDealStore = defineStore('projectDeal', {
    state: () => ({
        totalProjectDeals: 0,
        projectDeals: [],
        projectDealParams: {}
    }),
    getters: {
        listOfProjectDeals: (state) => state.projectDeals,
        totalOfProjectDeals: (state) => state.totalProjectDeals
    },
    actions: {
        setProjectParams(payload) {
            this.projectDealParams.page = payload.page;
            this.projectDealParams.itemsPerPage = payload.itemsPerPage;
            this.projectDealParams.sortBy = payload.sortBy;
        },
        async initProjectDeals() {
            try {
                let params = {
                    page: this.projectDealParams ? this.projectDealParams.page : 1,
                    itemsPerPage: this.projectDealParams ? this.projectDealParams.itemsPerPage : 10,
                    sortBy: this.projectDealParams ? this.projectDealParams.sortBy : []
                };
    
                this.projectDeals = [];
                this.totalProjectDeals = 0;
    
                const resp = await axios.get(`/production/project/deals`, {
                    params: params
                });

                console.log('deal', resp);
    
                this.projectDeals = resp.data.data.paginated;
                this.totalProjectDeals = resp.data.data.totalData;
    
                return resp;
            } catch (error) {
                return error;
            }
        },
        async publishProject({projectDealId, type}) {
            try {
                const resp = await axios.get(`/production/project/deals/publish/${projectDealId}/${type}`);

                return resp;
            } catch (error) {
                return error;
            }
        }
    }
});