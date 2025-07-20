import axios from "axios";
import { defineStore } from "pinia";

export const useDeadlineChangeReasonStore = defineStore('deadlineChangeReason', {
    state: () => ({
        totalDeadlineChangeReason: 0,
        deadlineChangeReasons: [],
        deadlineChangeReasonParam: {},
    }),
    getters: {
        lisfOfDeadlineChangeReasons: (state) => state.deadlineChangeReasons,
        totalOfDeadlineChangeReasons: (state) => state.totalDeadlineChangeReason,
    },
    actions: {
        setReasonParam(payload) {
            this.deadlineChangeReasonParam.page = payload.page;
            this.deadlineChangeReasonParam.itemsPerPage = payload.itemsPerPage;
            this.deadlineChangeReasonParam.sortBy = payload.sortBy;
        },
        async initDeadlineChangeReason() {
            try {
                let params = {
                    page: this.deadlineChangeReasonParam ? this.deadlineChangeReasonParam.page : 1,
                    itemsPerPage: this.deadlineChangeReasonParam ? this.deadlineChangeReasonParam.itemsPerPage : 10,
                    sortBy: this.deadlineChangeReasonParam ? this.deadlineChangeReasonParam.sortBy : []
                };
    
                this.deadlineChangeReasons = [];
                this.totalDeadlineChangeReason = 0;
    
                const resp = await axios.get(`/production/deadlineReason`, {
                    params: params
                });
    
                this.deadlineChangeReasons = resp.data.data.paginated;
                this.totalDeadlineChangeReason = resp.data.data.totalData;
    
                return resp;
            } catch (error) {
                return error;
            }
        },
        async createReason(payload) {
            try {
                const resp = await axios.post(`/production/deadlineReason`, payload);
                return resp;
            } catch (error) {
                return error;
            }
        },
        async updateReason(payload, id) {
            try {
                const resp = await axios.put(`/production/deadlineReason/${id}`, payload);
                return resp;
            } catch (error) {
                return error;
            }
        },
        async deleteReason(id) {
            try {
                const resp = await axios.delete(`/production/deadlineReason/${id}`);
                return resp;
            } catch (error) {
                return error;
            }
        },
    }
});