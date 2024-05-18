import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import axios from "axios";

const { notify } = useNotification();

export const useProjectStore = defineStore('project', {
    state: () => ({
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
    }),
    getters: {
        detailProject: (state) => state.detail,
        listOfTeams: (state) => state.teams,
    },
    actions: {
        getDetail() {
            return this.detail;
        },
        getTeams() {
            return this.teams;  
        },
        editBasicInformation(payload) {
            console.log('payload', payload);

            notify({
                title: 'Success',
                text: 'Success edit project',
                type: 'success',
            });

            return true;
        },
        async initProjects() {
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
    },
})