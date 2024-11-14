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
                                v-if="!editFormName && detailOfTask.is_active && !detailProject.project_is_complete"
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
                        @click.prevent="closeDetailTask"></v-icon>
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
                                    v-if="(detailOfTask.end_date) && (detailOfTask.end_date.length)"
                                    :start-date-text="detailOfTask.start_date_text"
                                    :start-date="detailOfTask.start_date"
                                    :end-date="detailOfTask.end_date"
                                    :end-date-text="detailOfTask.end_date_text"></task-deadline>
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
                                    <template v-if="!detailOfTask.is_active || detailProject.project_is_complete">
                                        <div class="desc-empty">
                                            {{ $t('addMoreDetail') }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="desc-empty"
                                            @click.prevent="isAddDescription = true">
                                            {{ $t('addMoreDetail') }}
                                        </div>
                                    </template>
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

                        <time-tracker
                            :times="detailOfTask.time_tracker"
                            v-if="isShowTimeTracker"></time-tracker>

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
                            transition="scroll-x-transition"
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
                                <p class="title-action"
                                    v-if="showTextCard">{{ $t('addToCard') }}</p>

                                <div class="action-list">
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        v-if="useCheckPermission('add_task_deadline')"
                                        :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access || detailProject.project_is_complete"
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
                                        color="success"
                                        v-if="detailOfTask.action_to_complete_task"
                                        @click.prevent="manualCompleteTask">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiCheck"
                                            size="20"></v-icon>
                                        {{ $t('completeTheTask') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        v-if="useCheckPermission('assign_task_pic')"
                                        :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access || detailProject.project_is_complete"
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
                                        v-if="detailOfTask.revises.length"
                                        :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access || detailProject.project_is_complete"
                                        @click.prevent="showRevise(detailOfTask)">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiRefresh"
                                            size="20"></v-icon>
                                        {{ $t('reviseDetail') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        v-if="useCheckPermission('add_task_attachment')"
                                        :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access || detailProject.project_is_complete"
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
                                        :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access"
                                        v-if="detailOfTask.proof_of_works.length && useCheckPermission('proof_of_work_list')"
                                        @click.prevent="openProofOfWork">
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
                                        :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access"
                                        v-if="detailOfTask.logs.length && useCheckPermission('task_log_access')"
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
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        v-if="detailOfTask.time_tracker.length && (detailProject.is_project_pic || detailProject.is_super_user || detailProject.is_director)"
                                        @click.prevent="showTimeTracker">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiTimeline"
                                            size="20"></v-icon>
                                        <template v-if="isShowTimeTracker">
                                            {{ $t('hideTimeTracker') }}
                                        </template>
                                        <template v-else>
                                            {{ $t('showTimeTracker') }}
                                        </template>
                                    </v-btn>
                                </div>
                            </div>

                            <div class="action-box mb-4">
                                <p class="title-action">{{ $t('action') }}</p>

                                <div class="action-list">
                                    <!-- <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiArrowRight"
                                            size="20"></v-icon>
                                        {{ $t('move') }}
                                    </v-btn> -->
                                    <v-menu
                                        persistent
                                        :close-on-content-click="false">
                                        <template v-slot:activator="{ props }">
                                            <v-btn
                                                variant="flat"
                                                class="w-100 text-left mb-3"
                                                color="grey-darken-1"
                                                :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access || detailProject.project_is_complete"
                                                v-bind="props">
                                                <v-icon
                                                    class="mr-1"
                                                    :icon="mdiArrowRight"
                                                    size="20"></v-icon>
                                                {{ $t('move') }}
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-item>
                                                <v-list-item-title>
                                                    <field-input
                                                        class="mt-2"
                                                        :label="t('moveTo')"
                                                        input-type="select"
                                                        :select-options="moveToBoards"
                                                        v-model="moveToBoardVal"></field-input>
                                                    <div
                                                        class="invalid-feedback text-red"
                                                        :class="{
                                                            'd-none': !errorManualMovingTask,
                                                            'd-block': errorManualMovingTask
                                                        }"
                                                        id="error-manual-moving-task">{{ errorManualMovingTask }}</div>
                                                    <v-btn
                                                        class="w-100 mt-4"
                                                        color="primary"
                                                        variant="flat"
                                                        :disabled="loadingMoveTo"
                                                        @click.prevent="manualMoveTask">
                                                        {{ $t('save') }}
                                                    </v-btn>
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>

                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="success"
                                        :disabled="loadingApprove || detailProject.project_is_complete"
                                        v-if="detailOfTask.need_user_approval && !detailOfTask.stop_action"
                                        @click.prevent="approveTask(detailOfTask.uid)">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiCheckCircle"
                                            size="20"></v-icon>
                                        <template v-if="loadingApprove">{{ $t('processing') }}</template>
                                        <template v-else>{{ $t('approveTask') }}</template>
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="success"
                                        :disabled="markAsCompleteLoading || detailProject.project_is_complete"
                                        v-if="(detailOfTask.is_project_pic && detailOfTask.need_approval_pm) || (detailOfTask.need_approval_pm && detailOfTask.is_director)"
                                        @click.prevent="markAsCompleteTask(detailOfTask.uid)">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiCheck"
                                            size="20"></v-icon>
                                        <template v-if="markAsCompleteLoading">
                                            {{ $t('processing') }}
                                        </template>
                                        <template v-else>
                                            {{ $t('markAsComplete') }}
                                        </template>
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="red"
                                        :disabled="reviseLoading || detailProject.project_is_complete"
                                        v-if="(detailOfTask.is_project_pic && detailOfTask.need_approval_pm) || (detailOfTask.need_approval_pm && detailOfTask.is_director)"
                                        @click.prevent="reviseTask(detailOfTask)">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiBook"
                                            size="20"></v-icon>
                                        <template v-if="reviseLoading">
                                            {{ $t('processing') }}
                                        </template>
                                        <template v-else>
                                            {{ $t('revise') }}
                                        </template>
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="red"
                                        v-if="props.canDeleteTask"
                                        :disabled="!detailOfTask.is_active || !detailOfTask.has_task_access || detailProject.project_is_complete"
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

        <revise-form
            @close-event="closeReviseForm"
            :is-show="showReviseForm"
            :detail="detailTaskForRevise"></revise-form>

        <revise-detail
            :is-show="showDetailRevise"
            :detail="selectedRevises"
            @close-event="closeRevise"
            :detail-task="detailOfTask"></revise-detail>

        <add-pic-form
            @close-event="closePicForm"
            :is-show="showPicForm"></add-pic-form>

        <attachment-form
            @close-event="closeAttachmentForm"
            :is-show="showAttachmentForm"></attachment-form>

        <detail-proof-of-work
            transition="scroll-x-transition"
            :is-show="showDetailProofWork"
            @close-event="showDetailProofWork = false"
            :detail="detailOfTask.proof_of_works_detail"
            :detail-task="detailOfTask"></detail-proof-of-work>

        <confirmation-modal
            :title="t('deleteTask')"
            :text="t('deleteTaskConfirmation')"
            :show-confirm="showDeleteForm"
            :delete-ids="deletedTaskIds"
            @actionBulkSubmit="doDeleteTask"></confirmation-modal>

        <proof-of-work
            :is-manual-approve-task="manualApproveTask"
            :is-show="showProofOfWork"
            :target-board="targetBoard"
            :is-from-detail="true"
            :source-board="sourceBoard"
            @close-in-task-detail="closeProofWork"
            @event-close="closeProofWork"
            :task-id="detailOfTask.uid"></proof-of-work>

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
    mdiMathLog,
    mdiCheckCircle,
    mdiTimeline,
    mdiRefresh,
    mdiBook,
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
import ProofOfWork from "./ProofOfWork.vue";
import TimeTracker from './TimeTracker.vue'
import ReviseDetail from './ReviseDetail.vue'
import ReviseForm from './ReviseForm.vue'
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useCheckPermission } from '@/compose/checkPermission';

const { t } = useI18n();

const store = useProjectStore();

const { detailOfTask, detailProject } = storeToRefs(store);

const { defineField, errors, setFieldValue, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
    }),
});

const [name] = defineField('name');

const show = ref(false);

const showDetailRevise = ref(false)

const showReviseForm = ref(false)

const detailTaskForRevise = ref(null)

const selectedRevises = ref([])

const isShowTimeTracker = ref(false)

const errorManualMovingTask = ref(false);

const showProofOfWork = ref(false);

const targetBoard = ref(null);

const sourceBoard = ref(null);

const moveToBoardVal = ref(null);

const editFormName = ref(false);

const markAsCompleteLoading = ref(false)

const reviseLoading = ref(false)

const showDetailProofWork = ref(false);

const isShowLog = ref(false);

const loadingEditName = ref(false);

const showPicForm = ref(false);

const loadingMoveTo = ref(false);

const isAddDescription = ref(false);

const showAttachmentForm = ref(false);

const showDeleteForm = ref(false);

const showDeadlineForm = ref(false);

const description_quill = ref(null);

const deletedTaskIds = ref([]);

const description = ref(null);

const moveToBoards = ref([]);

const loading = ref(false);

const loadingApprove = ref(false)

const showTextCard = ref(true)

const manualApproveTask = ref(false)

const emit = defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    canDeleteTask: {
        type: Boolean,
        default: false,
    },
    isFromTaskList: {
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

        if (values.isShow) {
            getBoardsMoveTo()
        }

        if (detailOfTask.value) {
            showTextCard.value = (detailOfTask.value.time_tracker.length && (detailProject.value.is_project_pic || detailProject.value.is_super_user)) ||
                (detailOfTask.value.logs.length && useCheckPermission('task_log_access')) ||
                (detailOfTask.value.proof_of_works.length && useCheckPermission('proof_of_work_list')) ||
                (useCheckPermission('add_task_attachment')) ||
                (useCheckPermission('add_team_member')) ||
                (useCheckPermission('add_task_deadline'))
        }
    }

})

watch(editFormName, (values) => {
    if (values) {
        setFieldValue('name', detailOfTask.value.name);
    }
})

async function getBoardsMoveTo() {
    var projectId = detailProject.value.uid

    const resp = await store.getMoveToBoards({
        projectId: projectId,
        boardId: detailOfTask.value.project_board_id,
    });

    if (resp.status < 300) {
        moveToBoards.value = resp.data.data;
    }
}

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

function manualCompleteTask() {
    showProofOfWork.value = true
    manualApproveTask.value = true
}

function showRevise(detail) {
    showDetailRevise.value = true
    selectedRevises.value = detail.revises
}

function closeRevise() {
    showDetailRevise.value = false
    selectedRevises.value = []
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
    const resp = await store.updateTaskName(values, detailProject.value.uid, detailOfTask.value.uid);
    loadingEditName.value = false;

    if (resp.status < 300) {
        editFormName.value = false;
    }
})

function openProofOfWork() {
    showDetailProofWork.value = true;
}

function showTimeTracker() {
    if (isShowTimeTracker.value) {
        isShowTimeTracker.value = false
    } else {
        isShowTimeTracker.value = true
    }
}

function showLogs() {
    if (isShowLog.value) {
        isShowLog.value = false;
    } else {
        isShowLog.value = true;
    }
}

function closeDetailTask() {
    // reset all state
    editFormName.value = false;
    showDetailProofWork.value = false;
    isShowLog.value = false;
    loadingEditName.value = false;
    showPicForm.value = false;
    isAddDescription.value = false;
    showAttachmentForm.value = false;
    showDeleteForm.value = false;
    showDeadlineForm.value = false;
    description_quill.value = false;
    deletedTaskIds.value = [];
    description.value = null;
    isShowTimeTracker.value = false;
    showReviseForm.value = false

    emit('close-event');
}

async function manualMoveTask() {
    if (!detailOfTask.value.is_project_id) {
        showProofOfWork.value = true
        targetBoard.value = moveToBoardVal.value;
        sourceBoard.value = detailOfTask.value.board.id;
    } else {
        loadingMoveTo.value = true;
        errorManualMovingTask.value = null;
        const resp = await store.manualChangeTaskBoard({
            board_id: moveToBoardVal.value,
            task_id: detailOfTask.value.uid,
            board_source_id: detailOfTask.value.board.id,
        }, detailProject.value.uid);

        if (resp.status < 300) {
            if (resp.data.data.show_proof_of_work) { // show proof of work form
                targetBoard.value = moveToBoardVal.value;
                sourceBoard.value = detailOfTask.value.board.id;
                showProofOfWork.value = true;
            }
        }

        if (!resp.status) {
            if (resp.response.status == 422) {
                errorManualMovingTask.value = resp.response.data.errors.board_id[0]
            } else {
                errorManualMovingTask.value = null;
            }
        }

        loadingMoveTo.value = false;
    }
}

function closeProofWork() {
    showProofOfWork.value = false;
    targetBoard.value = null;
    sourceBoard.value = null;

    if (document.getElementById('loader')) {
        document.getElementById('loader').style.display = 'none';
    }

    emit('close-event', true)
}

async function approveTask(taskUid) {
    loadingApprove.value = true
    await store.approveTask(detailProject.value.uid, taskUid)
    loadingApprove.value = false
}

async function markAsCompleteTask(taskUid) {
    markAsCompleteLoading.value = true
    await store.markAsCompleted(detailProject.value.uid, taskUid)
    markAsCompleteLoading.value = false

    emit('close-event', true)
}

function reviseTask(detail) {
    showReviseForm.value = true
    detailTaskForRevise.value = detail
}

function closeReviseForm() {
    showReviseForm.value = false
    detailTaskForRevise.value = null
}
</script>
