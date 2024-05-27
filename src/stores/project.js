import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from "axios";
import { showNotification } from "@/compose/notification";

const { notify } = useNotification();

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [],
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
        listOfTeams: (state) => state.teams,
        listOfPorjectBoards: (state) => state.projectBoards,
        listOfProjects: (state) => state.projects,
        totalOfProjects: (state) => state.totalProjects,
    },
    actions: {
        async getDetail(payload) {
            try {
                const resp = await axios.get('/production/project/' + payload.id);

                this.detail = resp.data.data;
                this.projectBoards = resp.data.data.boards;

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
    
                return resp;
            } catch (error) {
                return error;
            }
        },
        async initProjects() {
            try {
                const resp = await axios.get('/production/project');

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
        async storeDescription(payload, boardId) {
            try {
                const resp = await axios.post('/production/project/' + boardId + '/description', payload);

                // replace description in state
                this.detailTask.task.description = payload.description;

                showNotification(resp.data.message);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getPMMembers(payload) {
            try {
                const resp = await axios.get('/production/project/' + payload.project_id + '/getProjectMembers');

                return resp;
            } catch (error) {
                return error;
            }
        }
    },
})