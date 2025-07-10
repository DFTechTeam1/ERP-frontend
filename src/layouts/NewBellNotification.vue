<script setup>
import { ref } from 'vue';
import FinanceNotification from './notifications/FinanceNotification.vue';
import { mdiClose } from '@mdi/js';
import { useNotificationStore } from '@/stores/notification';
import { storeToRefs } from 'pinia';

const tab = ref('finance');

defineEmits(['close-event']);

const store = useNotificationStore();

const {
    listOfNotificationSection
} = storeToRefs(store);

const clearAllNotification = async () => {
    await store.readAllNotification();
};
</script>

<template>
    <v-card>
        <v-card-item>
            <div :style="{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }">
                <p :style="{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: '0',
                    padding: '0'
                }">Notification Center</p>
                <v-btn variant="outlined" color="red" size="small"
                    type="button"
                    @click.prevent="clearAllNotification">
                    <template v-slot:prepend>
                        <v-icon :icon="mdiClose" size="20"></v-icon>
                    </template>

                    Mark all as read
                </v-btn>
            </div>
        </v-card-item>
        <v-tabs v-model="tab">
            <v-tab value="general" v-if="listOfNotificationSection.general">General</v-tab>
            <v-tab value="finance" v-if="listOfNotificationSection.finance">Finance</v-tab>
            <v-tab value="production" v-if="listOfNotificationSection.production">Production</v-tab>
            <v-tab value="hrd" v-if="listOfNotificationSection.hrd">HRD</v-tab>
        </v-tabs>

        <v-card-text :style="{
            padding: '0'
        }">
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="general">
                    <div class="text-center px-5 py-5">
                        No notification.
                    </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="finance">
                    <finance-notification @close-menu="$emit('close-event')"></finance-notification>
                </v-tabs-window-item>
                <v-tabs-window-item value="production">
                    <div class="text-center px-5 py-5">
                        No notification.
                    </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="hrd">
                    <div class="text-center px-5 py-5">
                        No notification.
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>