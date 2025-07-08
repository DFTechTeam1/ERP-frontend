<script setup>
import { ref } from 'vue';
import FinanceNotification from './notifications/FinanceNotification.vue';

const tab = ref('finance');

defineEmits(['close-event']);

</script>

<template>
    <v-card>
        <v-tabs v-model="tab">
            <v-tab value="general">General</v-tab>
            <v-tab value="finance">Finance</v-tab>
            <v-tab value="production">Production</v-tab>
            <v-tab value="hrd">HRD</v-tab>
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