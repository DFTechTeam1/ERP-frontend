<style lang="scss" scoped>
    .custom-navigation {
        display: flex;
        border-radius: 6px;
        align-items: center;
        width: 100%;
        gap: 6px;
        padding: 6px;
        background: #f6f6f6;

        .nav {
            width: 100%;
            border: none;
            outline: none;
            padding: 8px 12px;
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
            font-size: 14px;
            background-color: #fff;
        }

        .nav.active {
            background-color: rgba(115, 103, 240, .5);
            font-weight: bold;
        }
    }

    .preview-wrapper {
        overflow: hidden;
    }

    .reference-value {
        overflow-y: scroll;
        height: 400px;
        padding-bottom: 140px;
        margin-top: 10px;
    }

    ::-webkit-scrollbar {
      width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #e6e6e6;
        border-radius: 4px;
    }
</style>

<template>
    <div class="preview-wrapper pr-3 pl-3">
        <template v-if="(detailProject) && (detailProject.references.link != undefined || detailProject.references.files != undefined || detailProject.references.pdf != undefined)">
            <!-- custom navigation -->
            <div class="custom-navigation">
                <button class="nav"
                    :class="{'active': tab == 'link'}"
                    @click.prevent="tab = 'link'">
                    {{ $t('link') }}
                </button>
                <button class="nav"
                    :class="{'active': tab == 'images'}"
                    @click.prevent="tab = 'images'">
                    {{ $t('images') }}
                </button>
                <button class="nav"
                    :class="{'active': tab == 'pdf'}"
                    @click.prevent="tab = 'pdf'">
                    {{ $t('pdf') }}
                </button>
            </div>

            <div class="reference-value">
                <!-- Link Item -->
                <div class="link-wrapper" v-if="tab == 'link'">
                    <LinkTab @delete-event="deleteImage" />
                </div> <!-- end Link Item -->

                <!-- Image Item -->
                <div class="file-wrapper mt-4" v-if="tab == 'images'">
                    <FilesTab @delete-event="deleteImage" />
                </div> <!-- end Image Item -->

                <!-- Pdf Item -->
                <div class="file-wrapper mt-4" v-if="tab == 'pdf'">
                    <DocumentTab @delete-event="deleteImage" />
                </div> <!-- end Pdf Item -->
            </div>
        </template>

        <template v-else>
            <div class="empty pt-10" v-if="(detailProject) && (!detailProject.project_is_complete)">
                <h3>{{ $t('emptyReference') }}</h3>
                <v-btn
                    class="mt-3"
                    variant="flat"
                    color="primary"
                    v-if="useCheckPermission('add_references')"
                    @click.prevent="$emit('open-form')">
                    {{ $t('addReferences') }}
                </v-btn>
            </div>
        </template>

        <form-view
            :is-show="props.showForm"
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
import { ref } from 'vue'
import { mdiAttachment, mdiClose, mdiCloseCircle, mdiFilePdfBox, mdiFolder, mdiFileWordBox } from '@mdi/js'
import FormView from './FormView'
import DetailImage from './DetailImage'
import FilesTab from './FilesTab'
import LinkTab from './LinkTab'
import DocumentTab from './DocumentTab'
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/stores/project';
import { useI18n } from 'vue-i18n';
import { useCheckPermission } from '@/compose/checkPermission';

const {t} = useI18n();

const props = defineProps({
    showForm: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close-form', 'open-form'])

const store = useProjectStore();

const { detailProject } = storeToRefs(store);

const detailImageData = ref(null);

const modalConfirmDelete = ref(false);

const tab = ref('link')

const selectedDeleteImg = ref([]);

const showDetailImage = ref(false);

function showPdf(file) {
    window.open(file, '_blank').focus();
}

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
    emit('close-form')
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