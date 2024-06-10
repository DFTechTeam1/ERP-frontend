<template>
    <div class="task-attachment mt-5">
        <div class="title-desc d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-5">
                <v-icon
                    :icon="mdiViewDashboard"
                    size="20"></v-icon>
                <h3>{{ $t('taskAttachments') }}</h3>
            </div>
        </div>

        <div class="task-wrapper">
            <div class="task-item mt-2"
                v-for="(task, t) in props.detail.task_link"
                :key="t">
                <div class="task-box">
                    <p>{{ task.task_link_detail.name }}</p>
                </div>

                <span class="action-link"
                    @click.prevent="showConfirmDeleteModal(task)">
                    Remove
                </span>
            </div>
        </div>

        <confirmation-modal
            :text="t('deleteAttachmentConfirmation')"
            :title="t('deleteAttachment')"
            :show-confirm="showConfirmDelete"
            :delete-ids="selectedIds"
            @actionBulkSubmit="doDeleteAttachment"></confirmation-modal>
    </div>
</template>

<style scoped lang="scss">
.task-wrapper {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;

    .task-item {
        width: 45%;

        .task-box {
            width: 100%;
            min-height: 70px;
            background: #fff;
            border-radius: 4px;
            padding: 8px 14px;

            p {
                font-size: 13px;
            }
        }

        a {
            font-size: 12px;
        }

    }
}

.action-link {
    border-bottom: 1px solid #000;
    color: blue;
    cursor: pointer;
    font-size: 12px;
}
</style>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { mdiViewDashboard } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();

const store = useProjectStore();

const { detailOfTask } = storeToRefs(store);

const route = useRoute();

const showConfirmDelete = ref(false);

const selectedIds = ref([]);

const props = defineProps({
    detail: {
        default: null,
    },
});

function showConfirmDeleteModal(media) {
    showConfirmDelete.value = true;
    selectedIds.value = [media.id];
}

async function doDeleteAttachment(payload) {
    console.log('payload', payload);

    const resp = await store.deleteTaskAttachment(route.params.id, detailOfTask.value.uid, payload[0]);

    if (resp.status < 300) {
        showConfirmDelete.value = false;
        selectedIds.value = [];
    }
}
</script>