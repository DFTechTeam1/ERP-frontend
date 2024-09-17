import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from "axios";
import { showNotification } from "@/compose/notification";
import { useEncrypt } from '@/compose/encrypt';

const { notify } = useNotification();

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [],
        allProjects: [],
        projectCalendar: [],
        projectStatusses: [],
        projectCalendarGrouping: [],
        projectCalendarDetail: [],
        detailListRequest: [],
        projectsFolder: [],
        totalProjects: 0,
        totalTransferTeam: 0,
        transferTeamList: [],
        detail: null,
        projectBoards: [],
        allTasks: [],
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
        listOfProjectsFolder: (state) => state.projectsFolder,
        listOfProjectCalendar: (state) => state.projectCalendar,
        detailOfProjectCalendar: (state) => state.projectCalendarDetail,
        detailProject: (state) => state.detail,
        listOfAllProjects: (state) => state.allProjects,
        detailOfTask: (state) => state.detailTask,
        listOfDetailRequestEquipment: (state) => state.detailListRequest,
        listOfTeams: (state) => state.teams,
        listOfPorjectBoards: (state) => state.projectBoards,
        listOfProjects: (state) => state.projects,
        totalOfProjects: (state) => state.totalProjects,
        listOfAllTasks: (state) => state.allTasks,
        listOfProjectStatusses: (state) => state.projectStatusses,
        totalOfTransferTeam: (state) => state.totalTransferTeam,
        listOfTransferTeam: (state) => state.transferTeamList,
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
            console.log('detail task', payload);
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
                this.totalProjects = resp.data.data.totalData

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getAllProjects() {
            try {
                const resp = await axios.get('/production/project/getAll')

                this.allProjects = resp.data.data

                return resp
            } catch (error) {
                return error
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
                    this.detail.references = resp.data.data.references;
                    this.detail = resp.data.data.full_detail;
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
                    this.detail.references = resp.data.data.references;
                    this.detail = resp.data.data.full_detail;
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
                if (error.response.data) {
                    this.detail = error.response.data.data;
                    this.projectBoards = error.response.data.data.boards;
                }

                return error;
            }
        },
        async uploadProofOfWork(payload, projectId, taskId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/proofOfWork/${taskId}`, payload)
                
                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

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
        },
        async getMoveToBoards(payload) {
            try {
                const resp = await axios.get(`production/project/${payload.projectId}/moveToBoards/${payload.boardId}`);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async manualChangeTaskBoard(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/manualChangeTaskBoard`, payload);

                if (!resp.data.data.show_proof_of_work) {
                    this.detail = resp.data.data;
                    this.projectBoards = resp.data.data.boards;
                }
                
                return resp;
            } catch (error) {
                return error;
            }
        },
        async autocompleteVenue(payload) {
            try {
                const resp = await axios.get(`/production/project/venues?search=${payload.search}`);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getAllTasks(params) {
            try {
                const resp = await axios.get('/production/tasks', {
                    params: params
                });

                this.allTasks = resp.data.data;
            } catch (error) {
                return error;
            }
        },
        async detailTaskFromList(taskUid) {
            try {
                const resp = await axios.get('/production/tasks/' + taskUid)

                this.detailTask = resp.data.data.task
                this.detail = resp.data.data.full_detail
                this.projectBoards = resp.data.data.full_detail.boards

                return resp
            } catch (error) {
                return error
            }
        },
        resetDetailTask() {
            this.detailTask = null
        },
        async getProjectMarketings() {
            try {
                const resp = await axios.get('/production/project/marketings')

                return resp
            } catch(e) {
                // statements
                return e
            }
        },
        async approveTask(projectUid, taskUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/task/${taskUid}/approve`)

                this.detailTask = resp.data.data.task
                this.detail = resp.data.data.full_detail
                this.projectBoards = resp.data.data.full_detail.boards

                return resp
            } catch (error) {
                return error
            }
        },
        async markAsCompleted(projectUid,taskUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/task/${taskUid}/completed`)

                this.detailTask = resp.data.data.task
                this.detail = resp.data.data.full_detail
                this.projectBoards = resp.data.data.full_detail.boards

                return resp
            } catch (error) {
                return error
            }
        },
        async getProjectBoards(projectId) {
            try {
                const resp = await axios.get(`/production/project/${projectId}/getBoards`)

                return resp.data.data
            } catch (error) {
                return error
            }
        },
        async getProjectTeams(projectId) {
            try {
                const resp = await axios.get(`/production/project/${projectId}/getProjectTeams`)

                return resp.data.data.map((elem) => {
                    return {
                        value: elem.uid,
                        title: elem.name,
                    }
                })
            } catch (error) {
                return error
            }
        },
        async getProjectStatusses() {
            try {
                const resp = await axios.get('/production/project/statusses')

                this.projectStatusses = resp.data.data
            } catch (error) {
                return error
            }
        },
        async changeStatus(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/changeStatus`, payload)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                return resp
            } catch (error) {
                return error
            }
        },
        async reviseTask(payload, projectUid, taskUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/task/${taskUid}/revise`, payload)

                this.detailTask = resp.data.data.task;
                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                return error
            }
        },
        async getPicTeams(projectUid, picUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/getPicTeams/${picUid}`)

                return resp
            } catch (error) {
                return error
            }
        },
        async getTargetPicsAndTaskList(projectUid) {
            try {
                const resp = await axios.get(`production/project/getTargetPicsAndTaskList/${projectUid}`)

                return resp
            } catch (error) {
                return error
            }
        },
        async loadTeamMember(payload, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/loadTeamMember`, payload)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                console.log('error', error);
                notify({
                    title: 'Failed',
                    text: error.response.data.message,
                    type: 'error',
                });
                return error
            }
        },
        async getTransferTeams(payload) {
            try {
                const resp = await axios.get('/production/team-transfers')

                this.transferTeamList = resp.data.data.paginated

                return resp
            } catch (error) {
                return error
            }
        },
        async bulkDeleteRequestTeam(payload) {
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
                return error
            }
        },
        async bulkCancelRequestTeam(payload) {
            try {
                console.log('pay', payload);
                var deleteResult = await axios.post(`/production/team-transfers/cancel`, {
                    ids: payload,
                });

                notify({
                    title: 'Success',
                    text: deleteResult.data.message,
                    type: 'success',
                });

                return deleteResult;
            } catch (error) {
                return error
            }
        },
        async approveRequestTeam(transferUid) {
            try {
                const resp = await axios.get(`/production/team-transfers/approve/${transferUid}/web`)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                return error
            }
        },
        async completeRequestTeam(transferUid) {
            try {
                const resp = await axios.get(`/production/team-transfers/complete/${transferUid}`)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                return error
            }
        },
        async rejectRequestTeam(payload, transferUid) {
            try {
                const resp = await axios.post(`/production/team-transfers/reject/${transferUid}`, payload)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                return error
            }
        },
        async deleteRequestTeam(transferUid) {
            try {
                const resp = await axios.delete(`/production/team-transfers/delete/${transferUid}`)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                return error
            }
        },
        async uploadShowreels(payload, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/uploadShowreels`, payload)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                this.detail = resp.data.data.full_detail
                this.projectBoards = resp.data.data.full_detail.boards

                return resp
            } catch (error) {
                return error
            }
        },
        async getTaskTeamForReview(projectUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/getTaskTeamForReview`)

                return resp
            } catch (error) {
                return error
            }
        },
        async completeProject(values, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/completeProject`, values)

                this.detail = resp.data.data.full_detail;
                this.projectBoards = resp.data.data.full_detail.boards;

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                return error
            }
        },
        async assignVj(employees, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/assignVj`, employees)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        async removeVJ(projectUid) {
            try {
                const resp = await axios.delete(`/production/project/${projectUid}/removeAllVJ`)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        async eventReady(projectUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/readyToGo`)

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        async finalCheckItem(projectUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/prepareFinalCheck`)

                return resp
            } catch (error) {
                return error
            }
        },
        takeActionReturnEquipment(payload, equipment) {
            var condition = {
                is_good_condition: !payload.condition ? false : true,
                detail_condition: payload.detail_condition || '',
            }
            
            let newArr = this.detailListRequest.map((elem) => {
                if (elem.uid == equipment.uid) {
                    elem.returnCondition = condition
                }

                return elem
            })

            this.detailListRequest = newArr
        },
        async returnEquipment(payload, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/returnEquipment`, {equipment: payload})

                showNotification(resp.data.message)

                return resp
            } catch (error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        downloadReferences(project) {
            window.open(
                import.meta.env.VITE_API_URL + '/production/project/' + project.uid + '/downloadReferences',
                '_blank'
            );
        },
        async getScheduler(projectUid, params = null) {
            try {
                var url = `/production/project/scheduler/${projectUid}`

                const resp = await axios.get(url, {params: params})

                return resp
            } catch(error) {
                return error
            }
        },
        async getPicScheduler(projectUid) {
            try {
                const resp = await axios.get('/production/project/' + projectUid + '/getPicScheduler')

                return resp
            } catch(err) {
                return err
            }
        },
        async assignPic(pics, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/assignPic`, {pics: pics})

                showNotification(resp.data.message)

                this.detail = resp.data.data.full_detail;

                return resp
            } catch(error) {
                console.log('error', error)
                showNotification(error.response.data.message, 'error')
            }
        },
        async subtitutePic(payload, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/subtitutePic`, payload)

                showNotification(resp.data.message)

                this.detail = resp.data.data.full_detail;

                return resp
            } catch(e) {
                showNotification(e.response.data.message, 'error')
                
                return e
            }
        },
        async getPicSubtitute(projectUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/getPicForSubtitute`)

                return resp
            } catch(e) {
                return e
            }
        },
        downloadProofOfWork(projectUid, proofOfWorkId) {
            window.open(
                import.meta.env.VITE_API_URL + `/production/project/${projectUid}/downloadProofOfWork/${proofOfWorkId}`,
                '_blank'
            );
        },
        async getProjectsFolder(params) {
            try {
                console.log('params', params)
                var search = new URLSearchParams(params)
                const resp = await axios.get(`/production/project/getProjectsFolder?${search}`)

                this.projectsFolder = resp.data.data.folders

                return resp
            } catch(e) {
                return e
            }
        },
        async getProjectYears() {
            try {
                const resp = await axios.get(`/production/project/getProjectYears`)

                return resp
            } catch(e) {
                return e
            }
        },
        async getProjectFolderDetail(params) {
            try {
                var search = new URLSearchParams(params)
                var url = `/production/project/getProjectFolderDetail?${search}` 

                const resp = await axios.get(url)

                return resp
            } catch(e) {
                return e
            }
        }
    },
})