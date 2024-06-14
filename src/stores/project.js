import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from "axios";
import { showNotification } from "@/compose/notification";
import { useEncrypt } from '@/compose/encrypt';

const { notify } = useNotification();

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [],
        detailListRequest: [],
        totalProjects: 0,
        detail: null,
        projectBoards: [],
        detailTask: null,
        teams: [
            {
                uid: '99383',
                name: 'Ilham',
                email: 'ilham@gmail.com',
                image: '/user.png',
                current_task: 'Create 3D modelling',
                last_update: '1 April 2024 10:15'
            },
            {
                uid: '99383',
                name: 'Meru',
                email: 'meru@gmail.com',
                image: '/user.png',
                current_task: 'Create 3D modelling',
                last_update: '1 April 2024 10:15'
            },
            {
                uid: '99383',
                name: 'Gumilang',
                email: 'gumilang@gmail.com',
                image: '/user.png',
                current_task: 'Create 3D modelling',
                last_update: '1 April 2024 10:15'
            },
        ],
        equipments: [
            {
                uid: '88383',
                name: 'Laptop',
                image: '/user.png',
                qty: '1',
                status_text: 'requested',
                status_color: 'primary',
            },
            {
                uid: '88384',
                name: 'Mouse',
                image: '/user.png',
                qty: '1',
                status_text: 'ready',
                status_color: 'success',
            },
        ],
    }),
    getters: {
        detailProject: (state) => state.detail,
        detailOfTask: (state) => state.detailTask,
        listOfDetailRequestEquipment: (state) => state.detailListRequest,
        listOfTeams: (state) => state.teams,
        listOfPorjectBoards: (state) => state.projectBoards,
        listOfProjects: (state) => state.projects,
        totalOfProjects: (state) => state.totalProjects,
    },
    actions: {
        async getDetail(payload) {
            try {
                const resp = await axios.get('/production/project/' + payload.id);

                const saltKey = import.meta.env.VITE_SALT_KEY;
                const { decodedString } = useEncrypt(resp.data.data.detail, saltKey);

                console.log('decodedString', decodedString);

                this.detail = decodedString;
                this.projectBoards = decodedString.boards;

                return resp;
            } catch (error) {
                return error;
            }
        },
        getTeams() {
            this.teams = this.detail.teams;

            return this.teams;
        },
        setDetailTask(payload) {
            this.detailTask = payload;
        },
        getEquipments() {
            return this.equipments;
        },
        async editBasicInformation(payload, uid) {
            try {
                const resp = await axios.put('/production/project/basic/' + uid, payload);
                
                this.detail = resp.data.data;

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });
    
                return resp;
            } catch (error) {
                return error;
            }
        },
        async editMoreDetail(payload, uid) {
            try {
                const resp = await axios.put('/production/project/moreDetail/' + uid, payload);

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                this.detail = resp.data.data;
    
                return resp;
            } catch (error) {
                return error;
            }
        },
        async initProjects(payload) {
            try {
                let params = {
                    page: payload ? payload.page : 1,
                    itemsPerPage: payload ? payload.itemsPerPage : 10,
                    sortBy: payload ? payload.sortBy : [],
                    search: payload ? payload.filter : ''
                };

                const resp = await axios.get('/production/project', {
                    params: params
                });

                this.projects = resp.data.data.paginated;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async initEventTypes() {
            try {
                const resp = await axios.get('/production/eventTypes');

                return resp;
            } catch (error) {
                return error;
            }
        },
        async initProjectStatus() {
            try {
                const resp = await axios.get('/production/status');

                return resp;
            } catch (error) {
                return error;
            }
        },
        async initClassList() {
            try {
                const resp = await axios.get('/production/classList');

                return resp;
            } catch (error) {
                return error;
            }
        },
        async storeReferences(payload, id) {
            try {
                const resp = await axios.post(`production/project/${id}/references`, payload);

                if (this.detail) {
                    this.detail.references = resp.data.data;
                }

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async deleteReference(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/references/delete`, payload);

                if (this.detail) {
                    this.detail.references = resp.data.data;
                }

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async storeProject(payload) {
            try {
                const resp = await axios.post('/production/project', payload);

                notify({
                    title: "Success",
                    text: resp.data.message,
                    type: "success",
                });

                return resp;
            } catch (error) {
                return error;
            }
        },
        async addTask(payload, boardId) {
            try {
                const resp = await axios.post('/production/project/' + boardId + '/task', payload);

                this.projectBoards = resp.data.data.boards;
                this.detail = resp.data.data;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async storeDescription(payload, taskId) {
            try {
                const resp = await axios.post('/production/project/' + taskId + '/description', payload);

                // replace description in state
                // this.detailTask.task.description = payload.description;
                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getPMMembers(payload) {
            try {
                const resp = await axios.get('/production/project/' + payload.project_id + '/getProjectMembers/' + payload.task_id);
                console.log('resp pm member', resp);
                return resp;
            } catch (error) {
                return error;
            }
        },
        async assignMemberToTask(payload, taskId) {
            try {
                const resp = await axios.post('/production/project/' + taskId + '/task/assignMember', payload);

                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getTaskTypes() {
            try {
                const resp = await axios.get('/production/project/taskType');

                return resp;
            } catch (error) {
                return error;
            }
        },
        async deleteTask(payload) {
            try {
                const resp = await axios.delete('/production/project/' + payload[0] + '/task');

                this.detail = resp.data.data;
                this.projectBoards = resp.data.data.boards;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async requestEquipment(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/equipment`, {items: payload.equipments})

                showNotification(resp.data.message);

                this.detail = resp.data.data;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async listRequestEquipment(projectId) {
            try {
                const resp = await axios.get('/production/project/' + projectId + '/equipment')
                var updatedData = resp.data.data.map((elem) => {
                    elem.approved = false;
                    elem.reject = false;
    
                    return elem;
                });

                this.detailListRequest = updatedData;
                
                return resp;
            } catch (error) {
                return error;
            }  
        },
        async updateRequestEquipment(projectId, payload) {
            try {
                const resp = await axios.put('/production/project/' + projectId + '/equipment', payload)
                var updatedData = resp.data.data.map((elem) => {
                    elem.approved = false;
                    elem.reject = false;
    
                    return elem;
                });

                this.detailListRequest = updatedData;

                showNotification(resp.data.message);
                
                return resp;
            } catch (error) {
                return error;
            }  
        },
        modifyRequestEquipment(item, type) {
            var updatedData = this.detailListRequest.map((elem) => {
                

                if (elem.uid == item.uid) {
                    if (type == 'reject') {
                        elem.reject = true;
                        elem.approved = false;
                    } else {
                        elem.reject = false;
                        elem.approved = true;
                    }
                }

                return elem;
            });

            this.detailListRequest = updatedData;
        },
        async cancelItem(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/cancelEquipment`, payload);

                this.detail = resp.data.data;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async updateDeadline(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/updateDeadline`, payload);

                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async uploadTaskAttachment(payload, projectId, taskId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/uploadTaskAttachment/${taskId}`, payload);

                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async searchTask(payload, projectId, taskId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/searchTask/${taskId}`, payload);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getRelatedTask(projectId, taskId) {
            try {
                const resp = await axios.get(`/production/project/${projectId}/getRelatedTask/${taskId}`);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async deleteTaskAttachment(projectUid, taskUid, attachmentId) {
            try {
                const resp = await axios.delete(`/production/project/${projectUid}/task/${taskUid}/deleteAttachment/${attachmentId}`);

                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async changeBoard(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/changeTaskBoard`, payload);

                this.detail = resp.data.data;
                this.projectBoards = resp.data.data.boards;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async bulkDelete(payload) {
            try {
                var deleteResult = await axios.post('/production/project/bulk', {
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
        async updateTaskName(payload, projectId, taskId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/updateTaskName/${taskId}`, payload);

                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                return resp;
            } catch (error) {
                return error;
            }
        }
    },
})