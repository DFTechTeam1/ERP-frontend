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
                return await axios.get(`/production/project/customer/list`);
            } catch (error) {
                return error;
            }
        }
    }
});