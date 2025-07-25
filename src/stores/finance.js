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
        },
        async updateInvoice(payload) {
            try {
                return await axios.post(`/finance/projectdealuid/invoices/temporary`, payload);
            } catch (error) {
                return error;
            }
        },
        async approveInvoiceChanges(invoiceUid, pendingUpdateId) {
            try {
                return await axios.get(`/finance/projectDealUid/invoices/${invoiceUid}/approve/${pendingUpdateId}`);
            } catch (error) {
                return error;
            }
        },
        async rejectInvoiceChanges(invoiceUid, pendingUpdateId) {
            try {
                return await axios.get(`/finance/projectDealUid/invoices/${invoiceUid}/reject/${pendingUpdateId}`);
            } catch (error) {
                return error;
            }
        },
    }
})