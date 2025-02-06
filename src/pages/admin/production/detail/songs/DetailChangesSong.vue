<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiArrowRightBoldOutline } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import RejectReasonForm from './RejectReasonForm.vue';
import { showNotification } from '@/compose/notification';

const props = defineProps({
    detailData: {
        type: Object
    }
});

const emit = defineEmits(['close-event']);

const { t } = useI18n();

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const titleConfirmation = ref('');
const textConfirmation = ref('');
const isShowConfirm = ref(false);
const loadingProcess = ref(false);
const showRejectForm = ref(false);
const isOnApproveState = ref(false);
const deleteIds = ref([]);

function confirmReject() {
    titleConfirmation.value = t('confirmRequestSongChangesTitle');
    textConfirmation.value = t('confirmRequestSongChangesText');
    isShowConfirm.value = true;
    deleteIds.value = [props.detailData.uid];
    isOnApproveState.value = false;
}

function confirmApprove() {
    titleConfirmation.value = t('confirmRequestSongChangesTitle');
    textConfirmation.value = t('confirmRequestSongChangesText');
    isShowConfirm.value = true;
    deleteIds.value = [props.detailData.uid];
    isOnApproveState.value = true;
}

async function actionChanges(ids) {
    if (props.detailData.is_request_delete) {
        doDelete(ids[0]);
    } else if (props.detailData.is_request_edit) {
        doEdit(ids[0]);
    }
}

async function doEdit(id) {
    if (isOnApproveState.value) {
        loadingProcess.value = true;
        const resp = await store.confirmEditSong(detailProject.value.uid, id);
        loadingProcess.value = false;
    
        if (resp.status < 300) {
            showNotification(resp.data.message);
            emit('close-event');
        } else {
            showNotification(resp.response.data.message, 'error');
        }
    } else {
        showRejectForm.value = true;
    }
}

async function doDelete(id) {
    if (isOnApproveState.value) {
        loadingProcess.value = true;
        const resp = await store.confirmDeleteSong(detailProject.value.uid, props.detailData.uid);
        loadingProcess.value = false;

        if (resp.status < 300) {
            showNotification(resp.data.message);
            emit('close-event');
        } else {
            showNotification(resp.response.data.message, 'error');
        }
    } else {
        showRejectForm.value = true;
    }
}

function closeConfirmation() {
    isShowConfirm.value = false;
    deleteIds.value = [];
    isOnApproveState.value = false;
}
</script>

<template>
    <div>
        <div class="request-wrapper" v-if="props.detailData.is_request_edit || props.detailData.is_request_delete">
            <p class="mb-5 d-flex align-items-center gap-3">
                {{ $t('requestChanges') }}
                <v-chip
                    size="small"
                    class="ms-2"
                    color="orange-lighten-1">
                    {{ props.detailData.status_request }}
                </v-chip>
            </p>
            <p style="font-size: 13px;">
                <template v-if="props.detailData.is_request_edit">
                    {{ $t('requestSongEditHelper') }}
                </template>
                <template v-if="props.detailData.is_request_delete">
                    {{ $t('requestSongDeleteHelper') }}
                </template>
            </p>
            <div class="request-body" v-if="props.detailData.is_request_edit">
                <div class="request-detail">
                    <p class="request-title">{{ props.detailData.name }}</p>
                    <v-icon
                        :icon="mdiArrowRightBoldOutline"
                        size="15"></v-icon>
                    <p class="request-title">{{ props.detailData.target_name }}</p>
                </div>
            </div>
    
            <v-btn size="x-small" flat color="primary"
                type="button"
                @click.prevent="confirmApprove()">
                {{ $t('approve') }}
            </v-btn>
            <v-btn size="x-small" class="ms-1"
                flat
                @click.prevent="confirmReject()"
                color="grey-lighten-3">
                {{ $t('reject') }}
            </v-btn>
        </div>

        <confirmation-modal
            @action-bulk-submit="actionChanges"
            @cancel-confirm="closeConfirmation"
            :title="titleConfirmation"
            :loading="loadingProcess"
            :text="textConfirmation"
            :delete-ids="deleteIds"
            :show-confirm="isShowConfirm"
            max-width="500" />

        <reject-reason-form :is-show="showRejectForm"
            @close-event="$emit('close-event')"
            :song-uid="detailData.uid" />
    </div>
</template>

<style scoped lang="scss">
.request-body {
    display: flex;
    align-items: center;
    justify-content: start;
}
.request-detail {
    text-align: center;
    display: flex;
    align-items: center;
    gap: 15px;
    
    .request-title {
        font-size: 13px;
        margin: 12px 0;
    }
}
</style>