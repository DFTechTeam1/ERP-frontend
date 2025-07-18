import axios from "axios";
import { defineStore } from "pinia";

export const useFinanceStore = defineStore('finance', {
    state: () => ({}),
    getters: {},
    actions: {
        async createTransaction({payload, projectDealUid}) {
            try {
                return await axios.post(`/finance/transaction/${projectDealUid}`, payload);
            } catch (error) {
                return error;
            }
        },
        async generateBillInvoice(payload, projectDealUid) {
            try {
                return await axios.post(`/finance/${projectDealUid}/billInvoice`, payload);
            } catch (error) {
                return error;
            }
        }
    }
})