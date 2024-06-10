<template>
    <v-dialog
        v-model="show"
        max-width="600">
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    Add Attachment

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="$emit('close-event')"
                        color="red"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form>
                    <div class="file">
                        <v-label>Attach file from your computer</v-label>
                        <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            v-on:addfile="updateImages"
                            accepted-file-types="image/png, image/jpg, image/jpeg, image/webp, application/pdf"
                        ></file-pond-com>
                    </div>

                    <v-divider class="mt-10 mb-10"></v-divider>
                    
                    <field-input
                        :label="t('findRecentLink')"
                        :is-required="false"
                        @change="searchTask"
                        v-model="find_recent_link"></field-input>

                    <field-input
                        class="mt-3"
                        :label="t('displayText')"
                        :is-required="false"
                        v-model="display_name"></field-input>

                    <p class="mt-5">Current Project</p>
                    <div class="current-task-wrapper mt-3">
                        <template v-if="loadingTask">
                            <v-skeleton-loader
                                type="list-item-avatar-two-line"></v-skeleton-loader>
                        </template>
                        <template v-else>
                            <template v-if="taskList.length">
                                <v-list>
                                    <v-list-item
                                        class="mb-2"
                                        color="primary"
                                        v-for="(item, x) in taskList"
                                        :key="x"
                                        :active="item.active"
                                        :value="item"
                                        @click.prevent="chooseTask(item)">
                                        <template v-slot:prepend>
                                            <v-icon 
                                                :icon="mdiLaptop"></v-icon>
                                        </template>

                                        <template v-slot:title>
                                            {{ item.name }}
                                        </template>

                                        <template v-slot:subtitle>
                                            Last updated at 5 Hours ago
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </template>
                            <template v-else>
                                <p class="text-center">
                                    No task
                                </p>
                            </template>
                        </template>
                    </div>

                    <v-btn
                        class="mt-4 w-100"
                        variant="flat"
                        color="primary"
                        @click.prevent="saveData"
                        :disabled="loading">
                        <template v-if="loading">
                            {{ $t('processing') }}
                        </template>
                        <template v-else>
                            {{ $t('save') }}
                        </template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
.current-task-detail {
    .current-task-title {
        font-size: 12px;
        font-weight: bold;
    }

    .current-task-time {
        font-size: 10px;
    }
}
</style>

<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiClose, mdiLaptop } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import * as yup from 'yup';

const store = useProjectStore();

const { t } = useI18n();

const { detailOfTask } = storeToRefs(store);

const emit = defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const { defineField } = useForm({
    validationSchema: yup.object({
        find_recent_link: yup.string().nullable(),
        display_name: yup.string().nullable(),
    })
});

const [find_recent_link] = defineField('find_recent_link');
const [display_name] = defineField('display_name');

const show = ref(false);

const route = useRoute();

const loading = ref(false);

const loadingTask = ref(false);

const taskList = ref([]);

const pond = ref(null);

async function updateImages() {
    if (pond.value.getFiles().length) {
        var formData = new FormData();
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            formData.append(`media[${a}]`, pond.value.getFiles()[a].file)
        }

        doUpload(formData);
        // replace(files);
        // fileErrorRequired.value = false;
    } else {
        // replace([{path: ''}]);
        // fileErrorRequired.value = true;
    }
}

function saveData() {
    var selectedTask = taskList.value.filter((filter) => {
        return filter.active;
    });

    // close if do not any value
    if (!selectedTask.length && !find_recent_link.value) {
        emit('close-event');
        return;
    }

    if (!selectedTask.length && find_recent_link.value) {
        doUpload({
            link: find_recent_link.value,
            display_name: display_name.value,
        });
    }

    if (selectedTask.length) {
        var formData = new FormData();
        for (let a = 0; a < selectedTask.length; a++) {
            formData.append(`task_id[${a}]`, selectedTask[a].uid);
        }
        
        doUpload(formData);
    }
}

async function doUpload(formData) {
    loading.value = true;
    const resp = await store.uploadTaskAttachment(formData, route.params.id, detailOfTask.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        emit('close-event');
    }
}

async function getRelatedTask() {
    loadingTask.value = true;
    const resp = await store.getRelatedTask(route.params.id, detailOfTask.value.uid);
    loadingTask.value = false;
    
    if (resp.status < 300) {
        taskList.value = resp.data.data.map((elem) => {
            elem.active = false;

            return elem;
        });
    }
}

async function searchTask() {
    loadingTask.value = true;
    const resp = await store.searchTask({search: find_recent_link.value}, route.params.id, detailOfTask.value.uid);
    loadingTask.value = false;

    if (resp.status < 300) {
        taskList.value = resp.data.data.map((elem) => {
            elem.active = false;

            return elem;
        });
    }
}

function chooseTask(item) {
    var resp = taskList.value.map((elem) => {
        if (elem.id == item.id) {
            if (item.active) {
                elem.active = false;
            } else {
                elem.active = true;
            }
        }

        return elem;
    });

    taskList.value = resp;
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        getRelatedTask();
    }
})
</script>