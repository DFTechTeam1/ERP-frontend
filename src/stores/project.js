import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from "axios";

const { notify } = useNotification();

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [],
        totalProjects: 0,
        detail: {
            name: 'Golden Wedding anniv Joseph Lim& Silvia Tan',
            date: '7 Januari 2024',
            pic: 'Thalia',
            event_type: 'wedding',
            class: 'Standard',
            class_color: 'success',
            venue: "Haris Gubeng Surabaya",
            collaboration: "Nuansa",
            note: "Luasan 20m",
            status: "On Going",
            days_to_go: 30,
            client_portal_url: 'localhost:3000/client-portal',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, provident. Ullam eum atque nesciunt, tempore saepe officia assumenda suscipit quam nulla mollitia est, cum laborum nisi. Aut aperiam odio consequuntur!"
        },
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
        listOfTeams: (state) => state.teams,
        listOfProjects: (state) => state.projects,
        totalOfProjects: (state) => state.totalProjects,
    },
    actions: {
        async getDetail(payload) {
            try {
                const resp = await axios.get('/production/project/' + payload.id);

                return resp;
            } catch (error) {
                return error;
            }
        },
        getTeams() {
            return this.teams;  
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
        async initClassList() {
            try {
                const resp = await axios.get('/production/classList');

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
        }
    },
})