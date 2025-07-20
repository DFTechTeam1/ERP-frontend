import axios from "axios";
import { defineStore } from "pinia";

export const useProjectDealStore = defineStore('projectDeal', {
    state: () => ({
        totalProjectDeals: 0,
        projectDeals: [],
        projectDealParams: {},
        detailProjectDeal: {},
        listFilterValue: {
            filters: [],
            preview: []
        }
    }),
    getters: {
        listOfProjectDeals: (state) => state.projectDeals,
        totalOfProjectDeals: (state) => state.totalProjectDeals,
        detailOfProjectDeal: (state) => state.detailProjectDeal,
        listOfFilterValue: (state) => state.listFilterValue
    },
    actions: {
        setProjectParams(payload) {
            this.projectDealParams.page = payload.page;
            this.projectDealParams.itemsPerPage = payload.itemsPerPage;
            this.projectDealParams.sortBy = payload.sortBy;
        },
        async initProjectDeals(advanceFilter = null) {
            try {
                let params = {
                    page: this.projectDealParams ? this.projectDealParams.page : 1,
                    itemsPerPage: this.projectDealParams ? this.projectDealParams.itemsPerPage : 10,
                    sortBy: this.projectDealParams ? this.projectDealParams.sortBy : []
                };

                // combine advance filter
                if (advanceFilter != null) {
                    params = {...params, ...advanceFilter};
                }

                console.log('params filter', params);
    
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
        },
        async getProjectDetail({projectUid, payload = {}} = {projectUid, payload: {}}) {
            try {
                const resp = await axios.get(`/production/project/deals/${projectUid}`, {
                    params: payload
                });

                this.detailProjectDeal = resp.data.data;

                return resp;
            } catch (error) {
                return error;
            }
        },
        setProjectDealDetailState({value}) {
            this.detailProjectDeal = value;
        },
        async deleteProjectDeal({uid}) {
            try {
                return await axios.delete(`/production/project/deals/${uid}`);
            } catch (error) {
                return error;
            }
        },
        setAdvanceFilterValue(payload) {
            this.listFilterValue.filters = payload.filters;
            this.listFilterValue.preview = payload.preview;
        },
        clearAdvanceFilterValue() {
            this.listFilterValue = [];
        }
    }
});