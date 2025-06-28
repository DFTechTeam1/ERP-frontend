import axios from "axios";
import { defineStore } from "pinia";

export const useFinanceStore = defineStore('finance', {
    state: () => ({}),
    getters: {},
    actions: {
        async createTransaction({payload, quotationId, projectDealUid}) {
            try {
                return await axios.post(`/finance/transaction/${quotationId}/${projectDealUid}`, payload);
            } catch (error) {
                return error;
            }
        }
    }
})