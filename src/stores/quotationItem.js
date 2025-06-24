import axios from "axios";
import { defineStore } from "pinia";

export const useQuotationItemStore = defineStore('quotationItem', {
    state: () => ({
        totalQuotationItems: 0,
        quotationItems: [],
        quotationItemParam: {},
        detailProjectDeal: {}
    }),
    getters: {
        listOfQuotationItems: (state) => state.quotationItems,
        totalOfQuotationItems: (state) => state.totalQuotationItems,
        detailOfProjectDeal: (state) => state.detailProjectDeal
    },
    actions: {
        setQuotationParam(payload) {
            this.quotationItemParam.page = payload.page;
            this.quotationItemParam.itemsPerPage = payload.itemsPerPage;
            this.quotationItemParam.sortBy = payload.sortBy;
        },
        async initQuotationItems() {
            try {
                let params = {
                    page: this.quotationItemParam ? this.quotationItemParam.page : 1,
                    itemsPerPage: this.quotationItemParam ? this.quotationItemParam.itemsPerPage : 10,
                    sortBy: this.quotationItemParam ? this.quotationItemParam.sortBy : []
                };
    
                this.quotationItems = [];
                this.totalQuotationItems = 0;
    
                const resp = await axios.get(`/production/quotations/pagination`, {
                    params: params
                });
    
                this.quotationItems = resp.data.data.paginated;
                this.totalQuotationItems = resp.data.data.totalData;
    
                return resp;
            } catch (error) {
                return error;
            }
        },
        async createQuotationItem(payload) {
            try {
                const resp = await axios.post(`/production/quotations`, payload);
                return resp;
            } catch (error) {
                return error;
            }
        },
        async updateQuotationItem(payload, id) {
            try {
                const resp = await axios.put(`/production/quotations/${id}`, payload);
                return resp;
            } catch (error) {
                return error;
            }
        },
        async deleteQuotationItem(id) {
            try {
                const resp = await axios.delete(`/production/quotations/${id}`);
                return resp;
            } catch (error) {
                return error;
            }
        },
    }
});