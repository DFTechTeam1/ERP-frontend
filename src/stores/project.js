import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from "axios";
import { showNotification } from "@/compose/notification";
import { useEncrypt } from '@/compose/encrypt';

const { notify } = useNotification();

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [],
        deadlineChangeReasons: [],
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
        projectNeedToBeComplete: [],
        detail: null,
        projectBoards: [],
        detailEntertainmentWorkload: [],
        allTasks: [],
        allTotalTask: 0,
        detailTask: null,
        projectParams: {},
        forceUpdatePages: false,
        keepProjectParams: false,
        haveFilterData: false,
        quotationPreview: null,
        totalProjectCount: 0,
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
        priceGuideSettings: {
            mainBallroom: {
                type: "general",
                formula: "{main_led_size}*{area_guide_price}"
            },
            prefunction: {
                type: "general",
                formula: "{prefunc_led_size}*({area_guide_price}*0.75)"
            },
            highSeason: {
                type: "percentage",
                formula: "25"
            },
            equipment: {
                type: "fix",
                formula: "2500000"
            },
            discount: {
                type: "percentage",
                formula: "10"
            },
            priceUp: {
                type: "percentage",
                formula: "1.1"
            }
        },
        areaGuidePrice: {
            surabaya: 750000,
            jakarta: 1250000,
            jawa: 850000,
            luar_jawa: 950000
        },
        quotationPart: {
            customer: {},
            office: {},
            event: {},
            note: null,
            rules: '',
            quotation_number: null,
            equipment_type: null,
            event_location: null
        },
        quotationItems: [],
        priceCalculation: null,
        quotationUrl: null,
        eventTypes: [],
        marketings: []
    }),
    getters: {
        designJob: (state) => state.totalProjectCount,
        listOfDeadlineChangeReasons: (state) => state.deadlineChangeReasons,
        listOfMarketings: (state) => state.marketings,
        listOfEventTypes: (state) => state.eventTypes,
        listProjectNeedToBeComplete: (state) => state.projectNeedToBeComplete,
        listOfDetailEntertainmentWorkload: (state) => state.detailEntertainmentWorkload,
        isHaveFilterData: (state) => state.haveFilterData,
        keyKeepProjectParams: (state) => state.keepProjectParams,
        listProjectParams: (state) => state.projectParams,
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
        totalOfAllTasks: (state) => state.allTotalTask,
        listOfProjectStatusses: (state) => state.projectStatusses,
        totalOfTransferTeam: (state) => state.totalTransferTeam,
        listOfTransferTeam: (state) => state.transferTeamList,
        listOfPriceGuide: (state) => state.priceGuideSettings,
        listAreaGuidePrice: (state) => state.areaGuidePrice,
        quotationContent: (state) => state.quotationPart,
        listOfQuotationItems: (state) => state.quotationItems,
        guideOfPriceCalculation: (state) => state.priceCalculation,
        linkOfQuotationUrl: (state) => state.quotationUrl
    },
    actions: {
        setQuotationEquipmentType({type}) {
            this.quotationPart.equipment_type = type;
        },
        setQuotationEventLocation({location}) {
            this.quotationPart.event_location = location;
        },
        setQuotationCustomer({customer}) {
            this.quotationPart.customer = customer;
        },
        setQuotationNumber({number}) {
            this.quotationPart.quotation_number = number;
        },
        setQuotationRules({rules}) {
            this.quotationPart.rules = rules;
        },
        setQuotationOffice({office}) {
            this.quotationPart.office = office;
        },
        setQuotationItems({items, itemPreviews}) {
            this.quotationPart.event.items = items;
            this.quotationPart.event.itemPreviews = itemPreviews;
        },
        setQuotationPrice({price}) {
            this.quotationPart.event.price = price;
        },
        setQuotationNote({note}) {
            this.quotationPart.note = note;
        },
        setQuotationEvent({event}) {
            this.quotationPart.event = event;
        },
        setFilterData(payload) {
          this.haveFilterData = payload;
        },
        setKeepProjectParams(payload) {
          this.keepProjectParams = payload;
        },
        setForceUpdatePages(payload) {
          this.forceUpdatePages = payload;
        },
        setProjectParams(payload) {
          if (this.forceUpdatePages) {
            this.projectParams.page = payload.page;
            this.projectParams.itemsPerPage = payload.itemsPerPage;
            this.projectParams.sortBy = payload.sortBy;
          }
        },
        setProjectDurationFilter(payload) {
          this.projectParams.filter_month = payload.month;
          this.projectParams.filter_today = payload.today;
          this.projectParams.filter_year = payload.year;
        },
        setSearchParamProject(payload) {
          this.projectParams.filter = payload;
        },
        async getProjectNeedToBeComplete(payload) {
            try {
                const resp = await axios.get('/dashboard/needCompleteProject');

                this.projectNeedToBeComplete = resp.data.data;

                return resp;
            } catch (error) {
                return error;
            }
        },
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
        async initProjects() {
            try {
                let params = {
                    page: this.projectParams ? this.projectParams.page : 1,
                    itemsPerPage: this.projectParams ? this.projectParams.itemsPerPage : 10,
                    sortBy: this.projectParams ? this.projectParams.sortBy : [],
                    search: this.projectParams ? this.projectParams.filter : '',
                    filter_month: this.projectParams ? this.projectParams.filter_month : true,
                    filter_today: this.projectParams ? this.projectParams.filter_today : false,
                    filter_year: this.projectParams ? this.projectParams.filter_year : false,
                };

                this.projects = []
                this.totalProjects = 0
                const resp = await axios.get('/production/project', {
                    params: params
                });

                this.projects = resp.data.data.paginated;
                this.totalProjects = resp.data.data.totalData

                // grouping song
                resp.data.data.paginated.map((mapping) => {
                    let assignSongs = [];
                    let unassignSongs = [];

                    if (mapping.songs.length) {
                        assignSongs = mapping.songs.filter((filter) => {
                            return filter.task;
                        });

                        unassignSongs = mapping.songs.filter((filter) => {
                            return !filter.task;
                        });
                    }

                    mapping.assignSong = assignSongs;
                    mapping.unassignSong = unassignSongs;

                    return mapping;
                });

                this.projects = resp.data.data.paginated;

                console.log("projects", this.projects);

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getAllTaskStatus() {
            try {
                return await axios.get(`/production/tasks/status`);
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

                this.eventTypes = resp.data.data;

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
        async manualMoveBoard(payload, projectId) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/manualMoveBoard`, payload);

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
        async uploadProofOfWork(payload, projectId, taskId, showNoficationMsg) {
            try {
                const resp = await axios.post(`/production/project/${projectId}/proofOfWork/${taskId}`, payload)

                if (showNoficationMsg) {
                    notify({
                        title: 'Success',
                        text: resp.data.message,
                        type: 'success',
                    });
                }

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
        async getAllTasks(payload, params) {
            console.log("params", params);
            try {
                let newParams = {
                    page: params ? params.page : 1,
                    itemsPerPage: params ? params.itemsPerPage : 10,
                    project_id: payload.project_id || '',
                    task_name: payload.task_name || '',
                    status: payload.status || '',
                };

                if (params != undefined && params.sortBy) {
                    newParams.sortBy = params.sortBy;
                }
                const resp = await axios.get('/production/tasks', {
                    params: newParams
                });

                this.allTasks = resp.data.data.paginated;
                this.allTotalTask = resp.data.data.totalData;

                return resp;
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

                this.marketings = resp.data.data;

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
        async getProjectStatusses(projectUid) {
            try {
                const resp = await axios.get('/production/project/'+ projectUid +'/statusses')

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

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                    this.projectBoards = resp.data.data.full_detail.boards;

                    // update list of products
                    this.projects.map((project) => {
                      if (project.uid == resp.data.data.full_detail.uid) {
                        project.status = resp.data.data.full_detail.status;
                        project.status_color = resp.data.data.full_detail.status_color;
                        project.status_raw = resp.data.data.full_detail.status_raw;
                      }

                      return project;
                    });

                    console.log("projects", this.projects);
                    console.log("detail", resp.data.data.full_detail);
                }

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
                showNotification(error.response.data.message, 'error')

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
                let params = {
                  page: payload ? payload.page : 1,
                  itemsPerPage: payload ? payload.itemsPerPage : 10,
                };

                const resp = await axios.get('/production/team-transfers', {
                  params: params
                })

                this.transferTeamList = resp.data.data.paginated
                this.totalTransferTeam = resp.data.data.totalData

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

                this.detail = resp.data.data.full_detail;

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

                this.detail = resp.data.data.full_detail;

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

                // update project list state
                this.projects.map((project) => {
                  if (project.uid === resp.data.data.full_detail.uid) {
                    project.pic = resp.data.data.list_updated.pic;
                    project.no_pic = resp.data.data.list_updated.no_pic;
                    project.pic_eid = resp.data.data.list_updated.pic_eid;
                  }

                  return project;
                });

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

                if (resp.data.data.full_detail.length) {
                    this.detail = resp.data.data.full_detail;
                }

                // update project list
                this.projects.map((project) => {
                  if (project.uid == projectUid) {
                    project.pic = resp.data.data.list_updated.pic;
                    project.no_pic = resp.data.data.list_updated.no_pic;
                    project.pic_eid = resp.data.data.list_updated.pic_eid;
                  }

                  return project;
                });

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
        downloadReviseMedia(projectUid, proofOfWorkId) {
            window.open(
                import.meta.env.VITE_API_URL + `/production/project/${projectUid}/downloadReviseMedia/${proofOfWorkId}`,
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
        },
        async cancelProject(payload, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/cancelProject`, payload)

                showNotification(resp.data.message)

                this.detail = resp.data.data.full_detail;

                return resp
            } catch(error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        async getMembersToLend(employeeUid, transferUid) {
            try {
                const resp = await axios.get(`/production/team-transfers/${transferUid}/getMembersToLend/${employeeUid}`)

                return resp
            } catch(e) {
                return e
            }
        },
        async initEntertainment() {
            try {
                const resp = await axios.get(`/production/project/initEntertainmentTeam`)

                return resp
            } catch(e) {
                return e
            }
        },
        async requestEntertainment(payload, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/requestEntertainment`, payload)

                showNotification(resp.data.message)

                return resp
            } catch(error) {
                showNotification(error.response.data.message, 'error')

                return error
            }
        },
        async approveWithManualSelection(transferUid, payload) {
          try {
            const resp = await axios.post('/production/team-transfers/approve-selection/' + transferUid, payload)

            showNotification(resp.data.message)

            return resp
          } catch (error) {
            showNotification(error.response.data.message, 'error')

            return error
          }
        },
        async holdTask(taskUid, projectUid, payload) {
          try {
            const resp = await axios.post(`/production/project/${projectUid}/task/${taskUid}/hold`, payload);
            showNotification(resp.data.message);
            this.detailTask = resp.data.data.task;
            this.detail = resp.data.data.full_detail;
            this.projectBoards = resp.data.data.full_detail.boards;
            return resp;
          } catch (error) {
            showNotification(error.response.data.message, 'error');

            return error;
          }
        },
        async startTask(taskUid, projectUid) {
          try {
            const resp = await axios.get(`/production/project/${projectUid}/task/${taskUid}/startTask`);
            showNotification(resp.data.message);
            this.detailTask = resp.data.data.task;
            this.detail = resp.data.data.full_detail;
            this.projectBoards = resp.data.data.full_detail.boards;
            return resp;
          } catch (error) {
            showNotification(error.response.data.message, 'error');
            return error;
          }
        },
        async getEmployeeListTask(projectUid, employeeId) {
          try {
            const resp = await axios.get(`/production/project/${projectUid}/task/${employeeId}/listTask`);

            return resp.data.data;
          } catch (error) {
            return error;
          }
        },
        async storeSong(projectUid, values) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/song`, values);

                this.detail = resp.data.data.full_detail;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async updateSong(projectUid, songUid, values) {
            try {
                const resp = await axios.put(`/production/project/${projectUid}/song/${songUid}`, values);

                this.detail = resp.data.data.full_detail;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async deleteSong(projectUid, songUid) {
            try {
                const resp = await axios.delete(`/production/project/${projectUid}/song/${songUid}`);

                this.detail = resp.data.data.full_detail;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getEntertainmentTeamList(projectUid, songUid) {
            try {
                return await axios.get(`/production/project/${projectUid}/entertainment/listMember`);
            } catch (error) {
                return error;
            }
        },
        async getEntertainmentTeamDetailWorkload(projectUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/entertainment/workload`);

                this.detailEntertainmentWorkload = resp.data.data;
            } catch (error) {
                return error;
            }
        },
        updateDetailEntertainmentWorkload(payload) {
            this.detailEntertainmentWorkload = payload;
        },
        async distributeSong(projectUid, songUid, values) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/song/distribute/${songUid}`, values);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async detailSong(projectUid, songUid) {
            try {
                return await axios.get(`/production/project/${projectUid}/song/${songUid}`);
            } catch (error) {
                return error;
            }
        },
        async confirmEditSong(projectUid, songUid) {
            try {
                const resp = await axios.put(`/production/project/${projectUid}/song/${songUid}/confirmEditSong`);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async confirmDeleteSong(projectUid, songUid) {
            try {
                const resp = await axios.put(`production/project/${projectUid}/song/${songUid}/confirmDeleteSong`);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async rejectEditSong(values, projectUid, songUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/song/reject/${songUid}`, values);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async bulkAssignSong(payload, projectUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/bulkAssignWorkerForSong`, payload);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async startWorkSong(projectUid, songUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/song/${songUid}/approve`);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async songReportAsDone(payload, projectUid, songUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/song/report/${songUid}`, payload);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async songApprovedByPM(projectUid, songUid) {
            try {
                const resp = await axios.get(`/production/project/${projectUid}/song/${songUid}/approveUpper`);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async reviseSongTask(payload, projectUid, songUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/song/${songUid}/revise`, payload);

                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async distributeModeler(payload, projectUid, taskUid) {
            try {
                const resp = await axios.post(`/production/project/${projectUid}/task/${taskUid}/distribute`, payload);

                this.detailTask = resp.data.data.task;
                if (resp.data.data.full_detail) {
                    this.detail = resp.data.data.full_detail;
                    this.projectBoards = resp.data.data.full_detail.boards
                }

                return resp;
            } catch (error) {
                return error;
            }
        },
        async checkAllProjectTasks(projectUid) {
          try {
            const resp = await axios.get(`/production/project/${projectUid}/precheck`);

            return resp;
          } catch (error) {
            return error;
          }
        },
        async completeAllUnfinishedTasks(projectUid) {
          try {
            const resp = await axios.post(`/production/project/${projectUid}/completeUnfinishedTask`);
            if (resp.data.data.full_detail) {
              this.detail = resp.data.data.full_detail;
              this.projectBoards = resp.data.data.full_detail.boards
            }

            return resp;
          } catch (error) {
            return error;
          }
        },
        async filterTasks(projectUid, payload) {
          try {
            const resp = await axios.post(`/production/project/${projectUid}/tasks/filter`, payload);
            this.projectBoards = resp.data.data.boards;

            return resp;
          } catch (error) {
            return error;
          }
        },
        async removeSongPic(projectUid, songUid) {
          try {
            const resp = await axios.get(`/production/project/${projectUid}/song/removePic/${songUid}`);

            this.detail = resp.data.data.full_detail;
            return resp;
          } catch (error) {
            return error;
          }
        },
        async checkHighSeason(payload) {
            try {
                return await axios.post(`production/project/checkHighSeason`, payload);
            } catch (error) {
                return error;
            }
        },
        setQuotationPreview({
            customer,
            officeInformation,
            event,
            ledDetail,
            selectedItem,
            rules
        }) {
            this.quotationPreview = {
                customer: customer,
                officeInformation: officeInformation,
                event: event,
                ledDetail: ledDetail,
                selectedItem: selectedItem,
                rules: rules
            }
        },
        async getQuotationNumber() {
            try {
                const resp = await axios.get(`/production/project/getQuotationNumber`);

                this.quotationPart.quotation_number = resp.data.data.number;                
            } catch (error) {
                return error;
            }
        },
        async storeProjectDeal({payload: payload}) {
            try {
                const resp = await axios.post(`production/project/deals`, payload);

                this.quotationUrl = resp.data.data.url;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async updateProjectDeal({payload, uid}) {
            try {
                return await axios.post(`production/project/deals/${uid}`, payload);
            } catch (error) {
                return error;
            }
        },
        async addMoreQuotation({payload, uid}) {
            try {
                return await axios.post(`production/project/deals/${uid}/quotation`, payload);
            } catch (error) {
                return error;
            }
        },
        async getQuotationItems() {
            try {
                const resp = await axios.get(`/production/quotations?all=1`);

                this.quotationItems = resp.data.data;
                
                return resp;
            } catch (error) {
                return error;
            }
        },
        async getCalculation() {
            try {
                const resp = await axios.get(`/setting/calculation`);

                this.priceCalculation = resp.data.data;

                return resp;
            } catch (error) {
                return error;
            }
        },
        resetQuotationUrl() {
            this.quotationUrl = null;
        },
        async getProjectCount(uid) {
            try {
                const resp = await axios.get(`/production/project/initProjectCount?projectDealUid=${uid}`);

                this.totalProjectCount = resp.data.data.count;

                return resp;
            } catch (error) {
                return error;
            }
        }
    },
})
