<template>
    <v-dialog
        v-model="show"
        max-width="700"
        persistent>
        <v-card class="bg-grey-lighten-2">
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <div class="task-name d-flex align-center ga-4">
                        <v-icon
                            :icon="mdiLaptop"
                            size="20"></v-icon>
                        <p v-if="!editFormName" style="text-wrap: wrap;">{{ detailOfTask.name }}</p>
                        <v-form class="d-flex align-center ga-4"
                            :class="{'w-100': editFormName}"
                            @submit="updateTaskName">
                            <div class="w-100">
                                <input type="text" 
                                    class="form-control" 
                                    v-model="name"
                                    v-if="editFormName"
                                    id="project-name">
                                <div class="invalid-feedback" 
                                    style="line-height: 1; margin-top: 5px;"
                                    v-if="errors.name">
                                    {{ errors.name }}
                                </div>
                            </div>
    
                            <v-icon
                                :icon="mdiPencil"
                                class="pointer"
                                v-if="!editFormName"
                                @click.prevent="editFormName = true"
                                size="20"></v-icon>

                            <v-btn 
                                class="btn-update-name"
                                variant="plain"
                                density="compact"
                                :disabled="loadingEditName"
                                type="submit"
                                v-if="editFormName">
                                <v-icon
                                    :icon="mdiCheck"
                                    color="success"
                                    size="20"></v-icon>
                            </v-btn>
                            <v-btn
                                class="btn-update-name"
                                variant="plain"
                                density="compact"
                                :disabled="loadingEditName"
                                v-if="editFormName"
                                @click.prevent="editFormName = false">
                                <v-icon
                                    :icon="mdiCancel"
                                    color="red"
                                    size="20"></v-icon>
                            </v-btn>
                        </v-form>
                    </div>

                    <v-icon
                        :icon="mdiClose"
                        size="25"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-row>
                    <!-- LEFT CONTENT -->
                    <v-col
                        cols="12"
                        lg="8"
                        md="8">
                        <!-- members, deadline -->
                        <template v-if="detail.members.length">
                            <div class="generic d-flex ga-5">
                                <task-member
                                    :members="detailOfTask.pics"></task-member>

                                <task-deadline
                                    v-if="(detailOfTask.start_date && detailOfTask.end_date) && (detailOfTask.start_date.length && detailOfTask.end_date.length)"
                                    :start-date="detailOfTask.start_date_text"
                                    :end-date="detailOfTask.end_date_text"></task-deadline>
                            </div>
                        </template>
                        <!-- end members, deadline -->

                        <!-- description -->
                        <div class="description"
                            :class="{
                                'mt-10': detailOfTask.pics.length || detailOfTask.start_date
                            }">
                            <div class="title-desc d-flex align-center justify-space-between">
                                <div class="d-flex align-center ga-5">
                                    <v-icon
                                        :icon="mdiMenu"
                                        size="20"></v-icon>
                                    <h3>{{ $t('description') }}</h3>
                                </div>

                                <div>
                                    <v-btn
                                        v-if="!isAddDescription && detailOfTask.description"
                                        variant="flat"
                                        size="small"
                                        color="white"
                                        @click.prevent="editDescription">
                                        {{ $t('edit') }}
                                    </v-btn>
                                    <v-btn
                                        v-if="!isAddDescription && detailOfTask.description"
                                        variant="outlined"
                                        size="small"
                                        color="red"
                                        class="ml-2"
                                        @click.prevent="deleteDescription">
                                        {{ $t('delete') }}
                                    </v-btn>
                                </div>
                            </div>

                            <div class="value-desc">
                                <template v-if="!detailOfTask.description && !isAddDescription">
                                    <div class="desc-empty"
                                        @click.prevent="isAddDescription = true">
                                        {{ $t('addMoreDetail') }}
                                    </div>
                                </template>

                                <template v-if="detailOfTask.description && !isAddDescription">
                                    <p v-html="detailOfTask.description" class="mt-4"></p>
                                </template>

                                <template v-if="isAddDescription">
                                    <div class="editor bg-white mt-4">
                                        <QuillEditor 
                                            theme="snow" 
                                            ref="description_quill"
                                            @update:content="updateDescription" />
                                    </div>

                                    <div class="editor-action mt-4">
                                        <v-btn
                                            variant="flat"
                                            color="black"
                                            :disabled="loading"
                                            @click.prevent="saveDescription">
                                            {{ $t('save') }}
                                        </v-btn>
                                        <v-btn
                                            variant="flat"
                                            color="white"
                                            :disabled="loading"
                                            @click.prevent="closeEditor">
                                            {{ $t('cancel') }}
                                        </v-btn>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <!-- end description -->

                        <!-- attachments -->
                        <attachment-view
                            v-if="detailOfTask.medias.length"
                            :detail="detailOfTask"></attachment-view>

                        <task-attachment
                            v-if="detailOfTask.task_link.length"
                            :detail="detailOfTask"></task-attachment>
                        <!-- end attachments -->

                        <deadline-form
                            :is-show="showDeadlineForm"
                            @close-event="showDeadlineForm = false"
                            @save-event="saveDate"></deadline-form>

                        <!-- activity -->
                        <task-activity
                            v-if="isShowLog" />
                        <!-- end activity -->
                    </v-col> <!-- END LEFT CONTENT -->

                    <!-- RIGHT CONTENT -->
                    <v-col
                        cols="12"
                        lg="4"
                        md="4">
                        <div class="action-wrapper">
                            <div class="action-box mb-4">
                                <p class="title-action">{{ $t('addToCard') }}</p>

                                <div class="action-list">
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        @click.prevent="showDeadlineForm = true">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiClockOutline"
                                            size="20"></v-icon>
                                        {{ $t('dates') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        @click.prevent="choosePic">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiAccountSupervisor"
                                            size="20"></v-icon>
                                        {{ $t('members') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        @click.prevent="openAttachmentForm">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiAttachment"
                                            size="20"></v-icon>
                                        {{ $t('attachments') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        v-if="detailOfTask.proof_of_works.length"
                                        @click.prevent="openAttachmentForm">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiAttachment"
                                            size="20"></v-icon>
                                        {{ $t('proofOfWork') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        v-if="detailOfTask.logs.length"
                                        @click.prevent="showLogs">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiMathLog"
                                            size="20"></v-icon>
                                        <template v-if="isShowLog">
                                            {{ $t('hideLogs') }}
                                        </template>
                                        <template v-else>
                                            {{ $t('showLogs') }}
                                        </template>
                                    </v-btn>
                                </div>
                            </div>

                            <div class="action-box mb-4">
                                <p class="title-action">{{ $t('action') }}</p>

                                <div class="action-list">
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiArrowRight"
                                            size="20"></v-icon>
                                        {{ $t('move') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="red"
                                        @click.prevent="deleteTask(detailOfTask.uid)">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiTrashCan"
                                            size="20"></v-icon>
                                        {{ $t('delete') }}
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </v-col> <!-- END RIGHT CONTENT -->
                </v-row>
            </v-card-text>
        </v-card>


        <add-pic-form
            @close-event="closePicForm"
            :is-show="showPicForm"></add-pic-form>

        <attachment-form
            @close-event="closeAttachmentForm"
            :is-show="showAttachmentForm"></attachment-form>

        <detail-proof-of-work
            :is-show="showDetailProofWork"
            :detail="detailOfTask.proof_of_works"></detail-proof-of-work>

        <confirmation-modal
            :title="t('deleteTask')"
            :text="t('deleteTaskConfirmation')"
            :show-confirm="showDeleteForm"
            :delete-ids="deletedTaskIds"
            @actionBulkSubmit="doDeleteTask"></confirmation-modal>

    </v-dialog>
</template>

<style lang="scss" scoped>
.btn-update-name {
    padding: 0;
    min-width: auto;
    width: auto;
}

.task-name {
    max-width: 80%;
    width: 100%;
}

.desc-empty {
    background-color: #fff;
    padding: 8px 12px;
    border: 1px solid #000;
    width: 100%;
    border-radius: 4px;
    margin-top: 10px;
}

.title-action {
    font-size: 13px;
    margin-bottom: 10px;
    color: rgb(101, 99, 99);
}
</style>

<script setup>
import { ref, watch } from 'vue';
import { 
    mdiLaptop, 
    mdiClose, 
    mdiMenu, 
    mdiTrashCan,
    mdiClockOutline,
    mdiAccountSupervisor,
    mdiAttachment,
    mdiArrowRight,
    mdiPencil,
    mdiCheck,
    mdiCancel,
    mdiMathLog
 } from '@mdi/js';
import TaskMember from './TaskMember.vue';
import TaskDeadline from './TaskDeadline.vue';
import DeadlineForm from './DeadlineForm.vue';
import AddPicForm from './AddPicForm.vue';
import AttachmentView from './AttachmentView.vue';
import TaskAttachment from './TaskAttachment.vue';
import AttachmentForm from './AttachmentForm.vue';
import DetailProofOfWork from './DetailProofWork.vue';
import TaskActivity from './TaskActivity.vue';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useRoute } from 'vue-router';

const { t } = useI18n();

const store = useProjectStore();

const route = useRoute();

const { detailOfTask } = storeToRefs(store);

const { defineField, errors, setFieldValue, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
    }),
});

const [name] = defineField('name');

const show = ref(false);

const editFormName = ref(false);

const showDetailProofWork = ref(false);

const isShowLog = ref(false);

const loadingEditName = ref(false);

const showPicForm = ref(false);

const isAddDescription = ref(false);

const showAttachmentForm = ref(false);

const showDeleteForm = ref(false);

const showDeadlineForm = ref(false);

const description_quill = ref(null);

const deletedTaskIds = ref([]);

const description = ref(null);

const loading = ref(false);

const emit = defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const detail = ref({
    name: 'Search image references for Events',
    description: '',
    members: [
        {id: 1, name: 'Ilham Meru', color: 'warning', initial: 'IM'},
        {id: 1, name: 'Ricky', color: 'primary', initial: 'R'},
        {id: 1, name: 'Rony', color: 'brown', initial: 'RO'},
    ],
    start_date: '',
    end_date: '',
    attachments: [],
    comments: [],
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

watch(editFormName, (values) => {
    if (values) {
        setFieldValue('name', detailOfTask.value.name);
    }
})

function saveDate(payload) {
    detail.value.start_date = payload.start_date;
    detail.value.end_date = payload.end_date;
}

function deleteTask(taskUid) {
    showDeleteForm.value = true;
    deletedTaskIds.value = [taskUid];
}

async function doDeleteTask(taskIds) {
    const resp = await store.deleteTask(taskIds);

    if (resp.status < 300) {
        emit('close-event');
    }
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        description.value = description_quill.value.getHTML();
    } else {                                                                                                                                                                                                                                                                                                                                                                              
        description.value = null;
    }

}

function closeEditor() {
    isAddDescription.value = false;
}

function deleteDescription() {
    description.value = null;

    saveDescription();
}

async function saveDescription() {
    loading.value = true;
    var descriptionData = description.value == null ? '' : description.value;
    detail.value.description = descriptionData;
    const resp = await store.storeDescription({description: descriptionData}, detailOfTask.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        closeEditor();
        description.value = null;
    }

}

function editDescription() {
    isAddDescription.value = true;
    
    setTimeout(() => {
        description_quill.value.setHTML(detailOfTask.value.description);
    }, 200);
}

function choosePic() {
    showPicForm.value = true;
}

function closePicForm() {
    showPicForm.value = false;
}

function openAttachmentForm() {
    showAttachmentForm.value = true;
}

function closeAttachmentForm() {
    showAttachmentForm.value = false;
}

const updateTaskName = handleSubmit(async (values) => {
    loadingEditName.value = true;
    const resp = await store.updateTaskName(values, route.params.id, detailOfTask.value.uid);
    loadingEditName.value = false;

    if (resp.status < 300) {
        editFormName.value = false;
    }   
})

function showLogs() {
    if (isShowLog.value) {
        isShowLog.value = false;
    } else {
        isShowLog.value = true;
    }
}
</script>