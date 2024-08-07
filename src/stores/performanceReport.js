import { defineStore } from "pinia";
import axios from "axios";
import { showNotification } from "@/compose/notification";

export const usePerformanceReportStore = defineStore('performanceReport', {
    state: () => ({
        teams: [],
        members: [],
        selectedTeam: null,
        memeberReport: null,
        loadingPerformance: false,
    }),
    getters: {
        listOfTeams: (state) => state.teams,
        listOfMembers: (state) => state.members,
        listOfSelectedTeam: (state) => state.selectedTeam,
        isLoadingPerformance: (state) => state.loadingPerformance,
        memberReportResult: (state) => state.memeberReport,
    },
    actions: {
        getTeams() {
            this.teams = [
                {
                    id: 1,
                    name: 'Wesley',
                    active: false,
                },
                {
                    id: 2,
                    name: 'Rudhi',
                    active: false,
                },
                {
                    id: 3,
                    name: 'Nando',
                    active: false,
                },
                {
                    id: 4,
                    name: 'Thalia',
                    active: false,
                },
            ]
        },
        async getMembers(name = '') {
            try {
                const resp = await axios.get(`/employees/all?name=${name}`)

                this.members = resp.data.data
            } catch (error) {
                return error
            }
        },
        async getReport(param) {
            try {
                this.loadingPerformance = true
                const resp = await axios.get(`/performanceReport/${this.selectedTeam.value}?start_date=${param.startDate}&end_date=${param.endDate}`)
                
                this.loadingPerformance = false

                this.memeberReport = resp.data.data

                return resp
            } catch (error) {
                this.loadingPerformance = false

                showNotification(error.response.data.message, 'error')

                this.memeberReport = null

                return error
            }
        },
        selectTeam(team) {
            var selected = this.members.filter((filter) => {
                return filter.value == team.value
            })

            this.members = this.members.map((item) => {
                item.active = false

                if (item.value == team.value) {
                    item.active = true
                }

                return item
            })

            if (selected.length) {
                this.selectedTeam = selected[0]
            } else {
                this.selectedTeam = null
            }
            
        }
    }
})