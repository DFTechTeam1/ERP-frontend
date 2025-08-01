<script setup>
import { useNotificationStore } from '@/stores/notification';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
});

const store = useNotificationStore();

const {
    listOfInboxData,
    totalOfInboxData
} = storeToRefs(store);

defineEmits(['close-event']);

const show = ref(false);

const itemsPerPage = ref(10);

const loading = ref(false);

const headers = ref([
    {title: "Area", key: 'area', align: 'start'},
    {title: "Description", key: 'description', align: 'start'},
    {title: "Action", key: 'message', align: 'start'},
]);

const items = ref([
    {
        id: 1,
        area: "Finance - Project Deals",
        description: "Success export project summary",
        message: `<p>Click <a href="">here</a> to download the file.</p>`
    }
]);

const loadInbox = async (payload) => {
    loading.value = true;
    await store.getInboxData({
        page: payload.page,
        itemsPerPage: payload.itemsPerPage
    });
    loading.value = false;
};

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

const clearAllInbox = async () => {
    loading.value = true;
    await store.clearInboxData();
    loading.value = false;
}
</script>

<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <span>Inbox</span>
                    <v-icon :icon="mdiClose"
                        size="14"
                        color="red"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <div class="d-flex justify-end">
                    <v-btn size="small" variant="text" color="red" type="button"
                        @click.prevent="clearAllInbox">
                        <v-icon :icon="mdiClose" size="12"></v-icon>

                        Clear All
                    </v-btn>
                </div>
                <v-data-table-server
                    :headers="headers"
                    :items="listOfInboxData"
                    :items-length="totalOfInboxData"
                    v-model:items-per-page="itemsPerPage"
                    item-vaue="description"
                    :loading="loading"
                    @update:options="loadInbox">

                    <template v-slot:item.message="{ item }">
                        <div v-html="item.message"></div>
                    </template>

                </v-data-table-server>
            </v-card-text>
        </master-card>

    </v-dialog>
</template>