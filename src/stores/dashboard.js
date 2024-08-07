import { defineStore } from "pinia";
import axios from "axios";

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        projectCalendar: [],
        projectCalendarDetail: [],
        projectCalendarGrouping: [],
        projectDeadline: [],
        reports: [],
    }),
    getters: {
        listOfProjectCalendar: (state) => state.projectCalendar,
        detailOfProjectCalendar: (state) => state.projectCalendarDetail,
        listOfProjectDeadline: (state) => state.projectDeadline,
        listOfReports: (state) => state.reports,
    },
    actions: {
        async getReport(payload) {
            try {
                var month = 0
                var year = 0
                if (payload) {
                    month = payload.month
                    year = payload.year
                }

                const resp = await axios.get(`/dashboard/getReport?month=${month}&year=${year}`)

                this.reports = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        },
        async getProjectCalendar(payload) {
            try {
                var month = 0
                var year = 0
                if (payload) {
                    month = payload.month
                    year = payload.year
                }

                const resp = await axios.get(`/dashboard/projectCalendar?month=${month}&year=${year}`)

                this.projectCalendar = resp.data.data.events.map((elem) => {
                    elem.dates = new Date(elem.dates)

                    return elem
                })

                this.projectCalendarGrouping = resp.data.data.group

                this.projectCalendarDetail = []

                return resp
            } catch (error) {
                return error
            }
        },
        async getProjectDeadline() {
            try {
                const resp = await axios.get('/dashboard/projectDeadline')

                this.projectDeadline = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        },
        setProjectCalendarDetail(payload) {
            var filter = this.projectCalendarGrouping[payload]
            
            this.projectCalendarDetail = filter || []
        }
    },
})