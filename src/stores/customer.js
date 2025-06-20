import axios from "axios";
import { defineStore } from "pinia";

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        allCustomer: []
    }),
    getters: {
        listOfAllCustomer: (state) => state.allCustomer
    },
    actions: {
        async getCustomer() {
            try {
                const resp = await axios.get(`/production/project/customer/list`);

                this.allCustomer = resp.data.data;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async storeCustomer(payload) {
            try {
                return await axios.post(`/production/project/customer/add`, payload);
            } catch (error) {
                return error;
            }
        }
    }
});