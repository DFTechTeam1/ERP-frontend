import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useEmployeesStore = defineStore('employees', {
    state: () => ({
        employees: [],
        allEmployees: [],
        allProjectManagers: [],
        employeeGeneralInformation: null,
        employeeJobDetail: null,
        employeeEducation: null,
        employeeDocuments: null,
        deleteEmployeeDocuments: null,
        completeFormEmployee: null,
        totalEmployees: 0,
        errorValidation: null,
        storeDataResult: null,
        detailEmployee: null,
    }),
    getters: {
        listOfEmployees: (state) => state.employees,
        listOfAllProjectManagers: (state) => state.allProjectManagers,
        listOfAllEmployees: (state) => state.allEmployees,
        totalOfEmployees: (state) => state.totalEmployees,
        detailOfEmployee: (state) => state.detailEmployee,
        errorValidationData: (state) => state.errorValidation,
        formEmployee: (state) => state.completeFormEmployee,
    },
    actions: {
        async initEmployees(payload) {
            let params = {
                page: payload ? payload.page : 1,
                itemsPerPage: payload ? payload.itemsPerPage : 10,
                sortBy: payload ? payload.sortBy : [],
                search: payload ? payload.filter : ''
            };

            await axios.get('/employees', {
                params: params
            })
                .then((res) => {
                    this.employees = res.data.data.paginated;
                    this.totalEmployees = res.data.data.totalData;
                })
                .catch()
        },
        async checkEmail(payload) {
            const isValid = await axios.get('/employees/checkEmail?email=' + payload.email)

            return isValid.data.data.is_available;
        },
        async checkIdNumber(payload) {
            const isValid = await axios.get('/employees/checkIdNumber?id_number=' + payload.id_number)
    
            return isValid.data.data.is_available;
        },
        async getAll(payload = null) {
            var url = '/employees/all';
            if (payload) {
                url += '?min_level=' + payload.min_levelt;
            }

            await axios.get(url)
                .then((res) => {
                    this.allEmployees = res.data.data;
                });
        },
        async getProjectManager(payload = null) {
            try {
                var date = '';
                if (payload) {
                    date = payload.date;
                }

                const resp = await axios.get('/employees/getProjectManagers?date=' + date);
                this.allProjectManagers = resp.data.data;
                return resp;
            } catch (error) {
                return error;
            }
        },
        async updateData(payload, uid) {
            try {
                this.storeDataResult = await axios.post('/inventories/' + uid, payload)

                notify({
                    title: 'Success',
                    text: this.storeDataResult.data.message,
                    type: 'success',
                });
                return this.storeDataResult;
            } catch (error) {
                this.errorValidation = error.response.data.errors;
                if (error.response.status != 422) {
                    notify({
                        title: 'Failed',
                        text: error.response.data.message,
                        type: 'error',
                    });
                }
                return error;
            }
        },
        async detailData(payload) {
            try {
                const resp = await axios.get('/employees/' + payload.uid)
                this.detailEmployee = resp;

                return resp.data.data
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/employees/bulk', {
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
        },
        storeGeneralInformation(payload) {
            this.employeeGeneralInformation = payload;
        },
        storeJobDetail(payload) {
            this.employeeJobDetail = payload;
        },
        storeEducation(payload) {
            this.employeeEducation = payload;
        },
        async storeEmployee(param) {
            var payload = {...this.employeeGeneralInformation, ...this.employeeJobDetail, ...this.employeeEducation, ...this.employeeDocuments, ...this.deleteEmployeeDocuments};

            this.completeFormEmployee = payload;

            var formData = new FormData();
            for (let k in payload) {
                if (k == 'banks') {
                    for (let b = 0; b < payload.banks.length; b++) {
                        formData.append(`banks[${b}][bank_name]`, payload.banks[b].bank_name);
                        formData.append(`banks[${b}][account_number]`, payload.banks[b].account_number);
                        formData.append(`banks[${b}][account_holder_name]`, payload.banks[b].account_holder_name);
                        formData.append(`banks[${b}][is_active]`, payload.banks[b].is_active);
                    }
                }

                if (k == 'educations') {
                    for (let d in payload.educations) {
                        formData.append(`educations[${d}]`, payload.educations[d]);
                    }
                }

                if (k == 'relation') {
                    for (let e in payload.relation) {
                        formData.append(`relation[${e}]`, payload.relation[e]);
                    }
                }

                if (k == 'deletedImage') {
                    for (let f in payload.deletedImage) {
                        formData.append(`deleted_image[${f}]`, payload.deletedImage[f]);
                    }
                }

                if (k != 'banks' && k != 'educations' && k != 'relation' && k != 'deletedImage') {
                    formData.append(k, payload[k]);
                }
            }

            if (param.uid != '') {
                formData.append('_method', 'PUT');
                this.storeDataResult = await axios.post('/employees/' + param.uid, formData);
            } else {
                this.storeDataResult = await axios.post('/employees', formData);
            }

            notify({
                title: 'Success',
                text: this.storeDataResult.data.message,
                type: 'success',
            });
            
            return this.storeDataResult;
        },
        storeDocuments(payload) {
            this.employeeDocuments = payload.images
            this.deleteEmployeeDocuments = payload.deleted
        },
        async generateEmployeeId() {
            const employeeIdRaw = await axios('/employees/generateEmployeeId');
            
            if (employeeIdRaw.status < 300) {
                return employeeIdRaw.data.data.employee_id;
            }

            return false;
        },
        async addToUser(payload) {
            await axios.post('/employees/addAsUser', payload)
                .then((res) => {
                    console.log('res', res);
                    notify({
                        title: 'Success',
                        text: res.data.message,
                        type: 'success',
                    });
                })
                .catch(err => {
                    notify({
                        title: 'Failed',
                        text: err.response.data.message,
                        type: 'error',
                    });
                })
        },
        async getByPosition(payload) {
            try {
                const resp = await axios.get('employees?itemsPerPage=10&page=1&search[position_id][0]=' + payload.id);

                return resp;
            } catch (error) {
                return error;
            }
        }
    }
})