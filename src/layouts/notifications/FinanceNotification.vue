<script setup>
import { useNotificationStore } from '@/stores/notification';
import moment from 'moment/moment';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useNotificationStore();

const router = useRouter();

const emit = defineEmits(['close-menu']);

const {
    listOfFinanceNotification
} = storeToRefs(store);

const actionNotification = async (url, notificationId) => {
    // mark as read
    emit('close-menu');
    await store.readFinanceNotification(notificationId)
    window.open(url, '__blank');
};

const detailNotification = async (url, notificationId) => {
    emit('close-menu');
    await store.readFinanceNotification(notificationId)
    router.push(url);
};
</script>

<template>
    <div class="px-3 py-3">
        <div class="text-center" v-if="!listOfFinanceNotification.length">
            <span class="text-center ">No notification.</span>
        </div>

        <v-list
            v-else
            height="500">
            <template
                v-for="(notif, n) in listOfFinanceNotification"
                :key="n">
                <v-list-item
                    v-if="notif.data.button"
                    class="py-0"
                    lines="three"
                    :title="notif.data.title">
                    
                    <template #subtitle>
                        <div v-html="notif.data.message"></div>
                    </template>

                    <template v-slot:append>
                        <span class="time">{{ moment(notif.created_at, 'YYYY-MM-DD HH:mm').format('DD MMMM HH:mm') }}</span>
                    </template>

                    <v-btn size="small" variant="flat" color="primary" class="mt-3 mb-3" v-if="notif.data.button"
                        @click.prevent="actionNotification(notif.data.button.button, notif.id)">{{ notif.data.button.text }}</v-btn>
    
                </v-list-item>

                <v-list-item
                    v-else
                    @click.prevent="detailNotification(notif.data.href, notif.id)"
                    class="py-0"
                    lines="three"
                    :title="notif.data.title">

                    <template #subtitle>
                        <div v-html="notif.data.message"></div>
                    </template>

                    <template v-slot:append>
                        <span class="time">{{ moment(notif.created_at, 'YYYY-MM-DD HH:mm').format('DD MMMM HH:mm') }}</span>
                    </template>
    
                </v-list-item>

                <v-divider></v-divider>
            </template>
        </v-list>
    </div>
</template>

<style lang="scss" scoped>
.time {
    font-size: 11px;
    margin-top: 10px;
}
</style>