import { defineStore } from 'pinia'
import axios from 'axios';
import { showNotification } from '@/compose/notification';

export const useProjectClassStore = defineStore('projectClass', {
    state: () => ({
        projectClasses: [],
        allClasses: [],
        totalClass: 0,
    }),
    getters: {
        listOfProjectClasses: (state) => state.projectClasses,
        listOfAllClasses: (state) => state.allClasses,
        totalOfClasses: (state) => state.totalClass,
    },
    actions: {
        async getList(payload) {
            try {
                let params = {
                    page: payload ? payload.page : 1,
                    itemsPerPage: payload ? payload.itemsPerPage : 10,
                    search: payload ? payload.search.value : ''
                };

                const resp = await axios.get('/projectClass', {
                    params: params
                })

                this.projectClasses = resp.data.data.paginated
                this.totalClass = resp.data.data.totalData;
            } catch (error) {
                return error
            }
        },
        async store(payload) {
            try {
                const resp = await axios.post('/projectClass', payload)

                showNotification(resp.data.message);

                return resp
            } catch (error) {
                return error
            }
        },
        async update(payload, id) {
            try {
                const resp = await axios.put(`/projectClass/${id}`, payload)

                showNotification(resp.data.message);

                return resp
            } catch (error) {
                return error
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/projectClass/bulk', {
                    ids: payload,
                });

                showNotification(deleteResult.data.message);

                return deleteResult;
            } catch (error) {
                showNotification(error.response.data.message, 'error');
                return error;
            }
        },
        async getAll() {
            try {
                const resp = await axios.get('/projectClass/getAll')

                this.allClasses = resp.data.data.map((elem) => {
                    return {
                        title: elem.name,
                        value: elem.id,
                    }
                })

                return resp
            } catch (error) {
                return error
            }
        }
    }
})