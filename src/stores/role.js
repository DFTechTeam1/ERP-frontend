import { defineStore } from "pinia";
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useRoleStore = defineStore('role', {
    state: () => ({
        roles: [],
        permissions: [],
        totalRoles: 0,
        errorValidation: null,
        storeDataResult: null,
        detailRole: null,
    }),
    getters: {
        listOfRoles: (state) => state.roles,
        listOfPermissions: (state) => state.permissions,
        totalOfRoles: (state) => state.totalRoles,
        errorValidationData: (state) => state.errorValidation,
    },
    actions: {
        async initRoles(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.search.value : ''
            };

            await axios.get('/roles', {
                params: params
            })
                .then((res) => {
                    this.roles = res.data.data.paginated;
                    this.totalRoles = res.data.data.totalData;
                })
                .catch()
        },
        async getAllRoles() {
            try {
                const resp = await axios.get('/roles/getAll');

                return resp;
            } catch (error) {
                return error;
            }
        },
        async initPermissions() {
            await axios.get('/permissions/getAll')
                .then((res) => {
                    this.permissions = res.data.data
                })
        },
        async getAllUsers() {
            await axios.get('/roles/all')
                .then((res) => {
                    this.allUsers = res.data.data;
                })
                .catch()
        },
        async storeData(payload) {
            try {
                if (payload.detailData) {
                    this.storeDataResult = await axios.put('/roles/' + payload.detailData.uid, payload)
                } else {
                    this.storeDataResult = await axios.post('/roles', payload)
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
                var detail = await axios.get('/roles/' + payload.uid)
                this.detailRole = detail.data.data.role;
                return this.detailRole;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/roles/bulk', {
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