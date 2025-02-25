import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";
import { showNotification } from "@/compose/notification";

const { notify } = useNotification();

export const useEmployeesStore = defineStore('employees', {
    state: () => ({
        employees: [],
        employeeFamilies: [],
        employeeEmergencyContact: [],
        allEmployees: [],
        previewImport: [],
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
        selectedPreviewImport: null,
        totalWrongPreviewImport: 0,
        totalCorrectPreviewImport: 0,
    }),
    getters: {
        listOfEmployees: (state) => state.employees,
        listOfFamilies: (state) => state.employeeFamilies,
        listOfEmergencyContact: (state) => state.employeeEmergencyContact,
        listOfAllProjectManagers: (state) => state.allProjectManagers,
        listOfAllEmployees: (state) => state.allEmployees,
        totalOfEmployees: (state) => state.totalEmployees,
        detailOfEmployee: (state) => state.detailEmployee,
        errorValidationData: (state) => state.errorValidation,
        formEmployee: (state) => state.completeFormEmployee,
        listOfPreviewImport: (state) => state.previewImport,
        detailOfSelectedPreviewImport: (state) => state.selectedPreviewImport,
        totalOfWrongImport: (state) => state.totalWrongPreviewImport,
        totalOfCorrectImport: (state) => state.totalCorrectPreviewImport
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
            try {
                var url = '/employees/all';
                if (payload) {
                    url += '?min_level=' + payload.min_levelt;
                }
    
                const resp = await axios.get(url);

                this.allEmployees = resp.data.data;

                return resp;
            } catch (error) {
                return error
            }
        },
        async getProjectManager(payload = null) {
            try {
                var date = '';
                if (payload) {
                    date = payload.date;
                }

                const resp = await axios.get(`/employees/getProjectManagers?date=${date}`);
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
        storeGeneralInformation(payload) {
            this.employeeGeneralInformation = payload;
            console.log('employeeGeneralInformation', this.employeeGeneralInformation);
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
        },
        async uploadImport(payload) {
            try {
                const resp = await axios.post('/employees/import', payload)

                this.previewImport = resp.data.data

                var wrongFormat = resp.data.data.filter((elem) => {
                    return elem.wrong_format
                }).length

                var correctFormat = resp.data.data.filter((elem) => {
                    return !elem.wrong_format
                }).length

                this.totalWrongPreviewImport = wrongFormat
                this.totalCorrectPreviewImport = correctFormat

                return resp
            } catch (error) {
                return error
            }
        },
        async submitImport() {
            try {
                if (this.previewImport.length) {
                    const resp = await axios.post('/employees/submitImport', this.previewImport)

                    notify({
                        title: 'Success',
                        text: resp.data.message,
                        type: 'success',
                    });

                    return resp
                }
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async getVJ(projectUid) {
            try {
                const resp = await axios.get(`/employees/getVJ/${projectUid}`)

                return resp
            } catch (error) {
                return error
            }
        },
        async updateBasicInfo(payload, employeeUid) {
            try {
                const resp = await axios.put(`employees/${employeeUid}/basicInfo`, payload)

                showNotification(resp.data.message)

                this.detailEmployee = resp

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async updateIdentity(payload, employeeUid) {
            try {
                const resp = await axios.put(`employees/${employeeUid}/identity`, payload)

                showNotification(resp.data.message)

                this.detailEmployee = resp

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async storeFamily(payload, employeeUid) {
            try {
                const resp = await axios.post(`employees/${employeeUid}/storeFamily`, payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async updateFamily(payload, familyUid) {
            try {
                const resp = await axios.put(`employees/${familyUid}/updateFamily`, payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async initFamily(employeeUid) {
            try {
                const resp = await axios.get(`employees/${employeeUid}/initFamily`)

                this.employeeFamilies = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        },
        async deleteFamily(familyUid) {
            try {
                const resp = await axios.delete(`employees/${familyUid}/deleteFamily`)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async initEmergency(employeeUid) {
            try {
                const resp = await axios.get(`employees/${employeeUid}/initEmergency`)

                this.employeeEmergencyContact = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        },
        async storeEmergency(payload, employeeUid) {
            try {
                const resp = await axios.post(`employees/${employeeUid}/storeEmergency`, payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async updateEmergency(payload, familyUid) {
            try {
                const resp = await axios.put(`employees/${familyUid}/updateEmergency`, payload)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async deleteEmergency(emergencyUid) {
            try {
                const resp = await axios.delete(`employees/${emergencyUid}/deleteEmergency`)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')
                return error
            }
        },
        async updateEmployment(values, employeeUid) {
            try {
                const resp = await axios.put(`employees/${employeeUid}/updateEmployment`, values)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        async resign(values, employeeUid) {
            try {
                const resp = await axios.post(`employees/${employeeUid}/resign`, values)

                showNotification(resp.data.message)

                return resp
            } catch(error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        }
    }
})
