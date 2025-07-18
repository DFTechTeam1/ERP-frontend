import axios from "axios";
import { defineStore } from "pinia";

export const useDeadlineChangeReasonStore = defineStore('deadlineChangeReason', {
    state: () => ({
        totalDeadlineChangeReason: 0,
        deadlineChangeReasons: [],
        allDeadlineChangeReasons: [],
        deadlineChangeReasonParam: {},
    }),
    getters: {
        lisfOfDeadlineChangeReasons: (state) => state.deadlineChangeReasons,
        totalOfDeadlineChangeReasons: (state) => state.totalDeadlineChangeReason,
        listOfAllDeadlineChangeReasons: (state) => state.allDeadlineChangeReasons
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
                // reset all data
                this.allDeadlineChangeReasons = [];
                
                return resp;
            } catch (error) {
                return error;
            }
        },
        async updateReason(payload, id) {
            try {
                const resp = await axios.put(`/production/deadlineReason/${id}`, payload);
                // reset all data
                this.allDeadlineChangeReasons = [];

                return resp;
            } catch (error) {
                return error;
            }
        },
        async deleteReason(id) {
            try {
                const resp = await axios.delete(`/production/deadlineReason/${id}`);
                // reset all data
                this.allDeadlineChangeReasons = [];

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getAllDeadlineReason() {
            try {
                if (!this.allDeadlineChangeReasons.length) {
                    const resp = await axios.get(`/production/deadlineReason?page=1&itemsPerPage=1&all=1`);
    
                    this.allDeadlineChangeReasons = resp.data.data.paginated;
    
                    return resp.data.data.paginated;
                } else {
                    return this.allDeadlineChangeReasons;
                }
            } catch (error) {
                return error;
            }
        }
    }
});