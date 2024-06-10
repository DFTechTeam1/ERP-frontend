<template>
    <div class="attachments mt-5">
        <div class="title-desc d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-5">
                <v-icon
                    :icon="mdiAttachment"
                    size="20"></v-icon>
                <h3>{{ $t('attachments') }}</h3>
            </div>
        </div>

        <div class="attachment-wrapper">
            <div class="attachment-item d-flex ga-3 mt-2 align-center"
                v-for="(media, x) in props.detail.medias"
                :key="x">
                <div class="img">
                    <template v-if="media.media_type == 'media'">
                        <v-img
                            v-if="media.ext == 'jpg' || media.ext == 'jpeg' || media.ext == 'webp' || media.ext == 'png'"
                            :src="media.media_link"
                            width="100%"></v-img>
                        <v-icon
                            v-if="media.ext == 'pdf'"
                            :icon="mdiFilePdfBox"
                            size="100%"></v-icon>
                        <v-icon
                            :icon="mdiFileExcelBox"
                            v-if="media.ext == 'xlsx' || media.ext == 'xlx'"></v-icon>
                    </template>
                    <template v-else-if="media.media_type == 'link'">
                        <v-icon
                            :icon="mdiLink"
                            size="20"></v-icon>
                    </template>
                </div>

                <div class="detail">
                    <p class="name fw-bold">{{ media.media }}</p>
                    <p class="detail-attachment">
                        Added {{ media.update_timing }} 
                        <v-icon
                            class="mx-2"
                            :icon="mdiCircle"
                            color="black"
                            size="5"></v-icon>
                        <template v-if="media.type == 3">
                            <span @click.prevent="redirectLink(media)" class="action-link">
                                {{ $t('open') }}
                            </span>
                        </template>
                        <template v-else>
                            <span @click.prevent="downloadData(media)" class="action-link">
                                {{ $t('download') }}
                            </span>
                        </template>
                        <v-icon
                            class="mx-2"
                            :icon="mdiCircle"
                            color="black"
                            size="5"></v-icon>
                        <span class="action-link" @click.prevent="showConfirmDeleteModal(media)">
                            {{ $t('delete') }}
                        </span>
                    </p>
                </div>
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
.name {
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 350px;
}
.detail-attachment {
    font-size: 12px;

    .circle {
        width: 5px;
        height: 5px;
        background: #000;
    }
}

.attachment-item {
    .img {
        width: 50px;
    }
}

.action-link {
    border-bottom: 1px solid #000;
    color: blue;
    cursor: pointer;
}

@media all and (max-width: 580px) {
    .attachment-item {
        display: block !important;

        .img {
            width: 200px;
        }
    }
}
</style>

<script setup>
import { useProjectStore } from '@/stores/project';
import { 
    mdiAttachment, 
    mdiCircle, 
    mdiFileExcelBox, 
    mdiFilePdfBox, 
    mdiLink } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();

const store = useProjectStore();

const route = useRoute();

const { detailOfTask } = storeToRefs(store);

const props = defineProps({
    detail: {
        default: null,
    },
})

const showConfirmDelete = ref(false);

const selectedIds = ref([]);

function downloadData(media) {
    window.location.href = import.meta.env.VITE_API_URL + `/production/project/${detailOfTask.value.uid}/downloadAttachment/${media.id}`;
}

function redirectLink(media) {
    window.open(
        media.media,
        '_blank'
    );
}

async function doDeleteAttachment(payload) {
    const resp = await store.deleteTaskAttachment(route.params.id, detailOfTask.value.uid, payload[0]);

    if (resp.status < 300) {
        showConfirmDelete.value = false;
        selectedIds.value = [];
    }
}

function showConfirmDeleteModal(media) {
    showConfirmDelete.value = true;
    selectedIds.value = [media.id];
}
</script>