import { defineStore } from "pinia";
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        allUsers: [],
        totalBrands: 0,
        errorValidation: null,
        storeDataResult: null,
        detailBrand: null,
    }),
    getters: {
        listOfUsers: (state) => state.users,
        listOfAllUsers: (state) => state.allUsers,
        totalOfUsers: (state) => state.totalBrands,
        errorValidationData: (state) => state.errorValidation,
    },
    actions: {
        async initUsers(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.search.value : ''
            };

            await axios.get('/users', {
                params: params
            })
                .then((res) => {
                    this.users = res.data.data.paginated;
                    this.totalBrands = res.data.data.totalData;
                })
                .catch()
        },
        async getAllUsers() {
            await axios.get('/users/all')
                .then((res) => {
                    this.allUsers = res.data.data;
                })
                .catch()
        },
        async storeData(payload) {
            try {
                if (payload.detailData) {
                    this.storeDataResult = await axios.put('/users/' + payload.detailData.uid, payload)
                } else {
                    this.storeDataResult = await axios.post('/users', payload)
                }
                notify({
                    title: 'Success',
                    text: this.storeDataResult.data.message,
                    type: 'success',
                });
                return this.storeDataResult;
            } catch (error) {
                this.errorValidation = error.response.data.errors;
                return error;
            }
        },
        async detailData(payload) {
            try {
                this.detailBrand = await axios.get('/users/' + payload.uid)
                return this.detailBrand;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/users/bulk', {
                    ids: payload,
                });

                notify({
                    title: 'Success',
                    text: deleteResult.data.message,
                    type: 'success',
                });

                return deleteResult;
            } catch (error) {
                return error;
            }
        }
    }
})