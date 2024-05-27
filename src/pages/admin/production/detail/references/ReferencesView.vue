<template>
    <div class="preview-wrapper">
        <template v-if="(detailProject) && (detailProject.references.length)">
            <div class="d-flex align-content-end justify-end">
                <v-btn
                    variant="flat"
                    color="primary"
                    size="small"
                    class="mb-5"
                    @click.prevent="showForm = true">
                    {{ $t('addReferences') }}
                </v-btn>
            </div>
            <div class="file-wrapper d-flex align-items ga-4 flex-wrap">
                <div 
                    class="file-item border pointer position-relative mb-4 text-center"
                    v-for="(list, i) in detailProject.references"
                    :key="i">

                    <v-icon
                        :icon="mdiCloseCircle"
                        color="red"
                        size="20"
                        class="position-absolute pointer"
                        @click.prevent="deleteImage(list)"
                        style="top: -10px; right: -10px; z-index: 1000;"></v-icon>

                    <template v-if="list.type == 'png' || list.type == 'jpg' || list.type == 'jpeg' || list.type == 'webp'" >
                        <div class="d-flex align-center justify-center"
                            @click.prevent="previewFile(list)">
                            <v-img
                                :src="list.media_path"
                                width="100"
                                height="100"></v-img>
                        </div>
                        <p class="position-relative mx-auto" 
                            style="text-wrap: wrap; width: 150px;"
                            @click.prevent="previewFile(list)">{{ list.name }}</p>
                    </template>
                    <template v-else-if="list.type == 'pdf'">
                        <v-icon
                            :icon="mdiFilePdfBox"
                            size="100"></v-icon>
                        <p class="position-relative mx-auto" style="text-wrap: wrap; width: 150px;">{{ list.name }}</p>
                    </template>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="empty pt-10">
                <h3>{{ $t('emptyReference') }}</h3>
                <v-btn
                    class="mt-3"
                    variant="flat"
                    color="primary"
                    @click.prevent="showForm = true">
                    {{ $t('addReferences') }}
                </v-btn>
            </div>
        </template>

        <form-view
            :is-show="showForm"
            @close-event="closeFormEvent"></form-view>

        <detail-image
            @close-detail-image="closeImageModal"
            :image="detailImageData"
            :is-show="showDetailImage"></detail-image>

        <confirmation-modal
            :title="t('deleteReference')"
            :text="t('deleteReferenceConfirmation')"
            :show-confirm="modalConfirmDelete"
            :delete-ids="selectedDeleteImg"
            @actionBulkSubmit="doDeleteImage"></confirmation-modal>
        
    </div>
</template>

<style scoped lang="scss">
.empty {
    margin: 0 auto;
    max-width: 800px;
    text-align: center;
}
</style>

<script setup>
import { ref } from 'vue';
import { mdiCloseCircle, mdiFilePdfBox } from '@mdi/js';
import FormView from './FormView';
import DetailImage from './DetailImage';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/stores/project';
import { useI18n } from 'vue-i18n';

const {t} = useI18n();

const store = useProjectStore();

const { detailProject } = storeToRefs(store);

const detailImageData = ref(null);

const modalConfirmDelete = ref(false);

const selectedDeleteImg = ref([]);

const showForm = ref(false);
const showDetailImage = ref(false);

function previewFile(fileData) {
    if (fileData.type == 'png' || fileData.type == 'jpg' || fileData.type == 'jpeg' || fileData.type == 'webp') {
        detailImageData.value = fileData.media_path
        showDetailImage.value = true;
    }
}

function closeImageModal() {
    detailImageData.value = null;
    showDetailImage.value = false;
}

function closeFormEvent() {
    showForm.value = false;
}

function deleteImage(image) {
    selectedDeleteImg.value = [image.id];
    modalConfirmDelete.value = true;
}

async function doDeleteImage(ids) {
    console.log('detailProject', detailProject);
    const resp = await store.deleteReference({image_ids: ids}, detailProject.value.uid);

    if (resp.status < 300) {
        selectedDeleteImg.value = [];
        modalConfirmDelete.value = false;
    }
}
</script>