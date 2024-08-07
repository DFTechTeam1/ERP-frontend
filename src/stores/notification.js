import { defineStore } from "pinia"
import axios from 'axios'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
    }),
    getters: {
        listOfNotification: (state) => state.notifications,
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

                console.log('read', resp);
    
                this.notifications = resp.data.data
            } catch (error) {
                return error
            }
        }
    }
})