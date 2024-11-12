<template>
	<div :class="{
            'd-flex align-items ga-4 flex-wrap': detailProject.references.files != undefined
        }">
		<template v-if="detailProject.references.files != undefined">
      <detail-image
        @close-detail-image="closeImageModal"
        :image="detailImageData"
        :is-show="showDetailImage"></detail-image>
			<div
		        class="file-item border pointer position-relative mb-4 text-center"
		        v-for="(list, i) in detailProject.references.files"
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
		    </div>
		</template>

		<template v-else>
			<v-empty-state
				:title="t('emptyImagesReference')"
				:text="t('imageWillAppearHere')"
				size="100"
				image="/paper.png"></v-empty-state>
		</template>
	</div>
</template>

<script setup>
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { mdiCloseCircle } from '@mdi/js'
import {ref} from "vue";
import DetailImage from "@/pages/admin/production/detail/references/DetailImage.vue";

const emit = defineEmits(['delete-event'])

const store = useProjectStore();

const { detailProject } = storeToRefs(store)

const { t } = useI18n()

const detailImageData = ref(null);

const showDetailImage = ref(false);

function closeImageModal() {
  detailImageData.value = null;
  showDetailImage.value = false;
}

function previewFile(fileData) {
  if (fileData.type == 'png' || fileData.type == 'jpg' || fileData.type == 'jpeg' || fileData.type == 'webp') {
    detailImageData.value = fileData.media_path
    showDetailImage.value = true;
  }
}

function deleteImage(link) {
    emit('delete-event', link)
}
</script>
