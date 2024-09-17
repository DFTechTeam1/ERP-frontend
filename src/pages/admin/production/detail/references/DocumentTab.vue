<template>
	<div :class="{
            'd-flex align-items ga-4 flex-wrap': detailProject.references.pdf != undefined
        }">
        <template v-if="detailProject.references.pdf != undefined">
    		<div 
                class="file-item border pointer position-relative mb-4 text-center"
                v-for="(pdf, ip) in detailProject.references.pdf"
                :key="ip">

                <v-icon
                    :icon="mdiCloseCircle"
                    color="red"
                    size="20"
                    class="position-absolute pointer"
                    @click.prevent="deleteDocument(pdf)"
                    style="top: -10px; right: -10px; z-index: 1000;"></v-icon>
                <div class="pdf-wrapper"
                    @click.prevent="showPdf(pdf.media_path)">
                    <v-icon
                        :icon="mdiFilePdfBox"
                        v-if="pdf.type == 'pdf'"
                        size="100"></v-icon>
                    <v-icon
                        :icon="mdiFileWordBox"
                        v-if="pdf.type == 'doc' || pdf.type == 'docx'"
                        size="100"></v-icon>
                    <p class="position-relative mx-auto" style="text-wrap: wrap; width: 150px;">{{ pdf.media_path }}</p>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="link-item">
                <v-empty-state
                    :title="t('emptyDocumentReference')"
                    :text="t('documentWillAppearHere')"
                    size="100"
                    image="/paper.png"></v-empty-state>
            </div>
        </template>
	</div>
</template>

<script setup>
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { mdiFileWordBox, mdiFilePdfBox, mdiCloseCircle } from '@mdi/js'

const emit = defineEmits(['delete-event'])

const store = useProjectStore();

const { detailProject } = storeToRefs(store)

const { t } = useI18n()

function deleteDocument(link) {
    emit('delete-event', link)
}
</script>