import { defineStore } from "pinia";
import axios from "axios";
import reportingBridge from "@/plugins/reportingBridge";

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        projectCalendar: [],
        projectCalendarDetail: [],
        projectCalendarGrouping: [],
        projectDeadline: [],
        reports: [],
        projectSongs: [],
        projectClassTimeline: [],
        projectClassTimelinePerPic: []
    }),
    getters: {
        listOfProjectCalendar: (state) => state.projectCalendar,
        detailOfProjectCalendar: (state) => state.projectCalendarDetail,
        listOfProjectDeadline: (state) => state.projectDeadline,
        listOfReports: (state) => state.reports,
        listOfProjectSongs: (state) => state.projectSongs,
        dataProjectClassTimeline: (state) => state.projectClassTimeline,
        dataProjectClassTimelinePerPic: (state) => state.projectClassTimelinePerPic
    },
    actions: {
        async getProjectSong() {
            try {
                const resp = await axios.get(`/dashboard/projectSong`);

                this.projectSongs = resp.data.data;
            } catch (error) {
                return error;
            }
        },
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
        },
        async getVjWorkload(param) {
          try {
            const resp = await axios.get(`/dashboard/getVjWorkload?month=${param.month}`);

            return resp;
          } catch (error) {
            return error;
          }
        },
        async getEntertainmentSongWorkload(param) {
          try {
            const resp = await axios.get(`/dashboard/getEntertainmentSongWorkload?month=${param.month}`);

            return resp;
          } catch (error) {
            return error;
          }
        },
        async getGlobalProjectTimeline(params) {
            try {
                const resp = await reportingBridge.post(`/report/project-timeline/global`, params);
                
                this.projectClassTimeline = resp.data.data;

                return resp;
            } catch (error) {
                return error;
            }
        },
        async getGlobalProjectTimelinePerPic(params) {
            try {
                const resp = await reportingBridge.post(`/report/project-timeline/team`, params);
                
                this.projectClassTimelinePerPic = resp.data.data || [];

                return resp;
            } catch (error) {
                return error;
            }
        }
    },
})
