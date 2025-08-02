import { defineStore } from "pinia"
import axios from 'axios'
import { useEncrypt } from "@/compose/encrypt"
import { useBreakToken } from "@/compose/breakToken"

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        financeNotitications: [],
        notificationSection: null,
        inboxData: [],
        totalInboxData: 0
    }),
    getters: {
        listOfNotification: (state) => state.notifications,
        listOfFinanceNotification: (state) => state.financeNotitications,
        listOfNotificationSection: (state) => state.notificationSection,
        listOfInboxData: (state) => state.inboxData,
        totalOfInboxData: (state) => state.totalInboxData
    },
    actions: {
        setNotif(payload) {
            this.notifications = payload
        },
        async read(notification) {
            try {
                var newArr = this.notifications.map((elem) => {
                    elem.loading = false
    
                    if (elem.id == notification.id) {
                        elem.loading = true
                    }
    
                    return elem
                })
    
                this.notifications = newArr
    
                const resp = await axios.get(`notification/markAsRead/${notification.id}`)
    
                this.notifications = resp.data.data
            } catch (error) {
                return error
            }
        },
        async readFinanceNotification(notificationId) {
            try {
                this.financeNotitications = this.financeNotitications.filter((mapping) => {
                    return mapping.id !== notificationId
                });

                await axios.get(`notification/markAsRead/${notificationId}`);
            } catch (error) {
                return error;
            }
        },
        async getNotifications() {
            try {
                const saltKey = import.meta.env.VITE_SALT_KEY;
                const resp = await axios.get('/user/notifications');

                var { decodedString } = useEncrypt(resp.data.data.data, saltKey);
                
                this.financeNotitications = decodedString;
            } catch (error) {
                return error;
            }
        },
        async readAllNotification() {
            try {
                await axios.get('/notification/readAll');

                this.notifications = [];
                this.financeNotitications = [];
            } catch (error) {
                return error;
            }
        },
        defineNotificationPanel() {
            if (!this.notificationSection) {
                let notificationSection = useBreakToken('notification_section');
    
                this.notificationSection = notificationSection;
            }
        },
        async getInboxData(params) {
            try {
                const resp = await axios.get('inboxData', {
                    params: params
                });

                this.inboxData = resp.data.data.paginated;
                this.totalInboxData = resp.data.data.totalData;
            } catch (error) {
                return error;
            }
        },
        async clearInboxData() {
            try {
                const resp = await axios.get('inboxData/clear');

                this.inboxData = [];
                this.totalInboxData = 0;

                return resp;
            } catch (error) {
                return error;
            }
        }
    }
})