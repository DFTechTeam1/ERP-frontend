<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
});

defineEmits(['close-event']);

const show = ref(false);

const itemsPerPage = ref(10);

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

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});
</script>

<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-items-center justify-space-between">
                    <span>Inbox</span>
                    <v-icon :icon="mdiClose"
                        size="14"
                        color="red"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-data-table-server
                    :headers="headers"
                    :items="items"
                    :items-length="1"
                    v-model:items-per-page="itemsPerPage"
                    item-vaue="description">

                    <template v-slot:item.message="{ item }">
                        <div v-html="item.message"></div>
                    </template>

                </v-data-table-server>
            </v-card-text>
        </master-card>

    </v-dialog>
</template>