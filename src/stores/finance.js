import axios from "axios";
import { defineStore } from "pinia";

export const useFinanceStore = defineStore('finance', {
    state: () => ({}),
    getters: {},
    actions: {
        async createTransaction({payload, quotationId}) {
            try {
                return await axios.post(`/finance/transaction/${quotationId}`, payload);
            } catch (error) {
                return error;
            }
        }
    }
})