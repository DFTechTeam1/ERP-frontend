<template>
    <div class="preview-wrapper">
        <template v-if="!lists.length">
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

        <template v-if="lists.length">
            <div class="file-wrapper d-flex align-items ga-4 flex-wrap">
                <div 
                    class="file-item border pointer position-relative mb-4"
                    @click.prevent="previewFile(list)"
                    v-for="(list, i) in lists"
                    :key="i">
                    <template v-if="list.type == 'image'">
                        <v-img
                            :src="list.image"
                            width="100"
                            height="100"></v-img>
                        <p class="position-absolute mx-auto">{{ list.name }}</p>
                    </template>
                    <template v-else-if="list.type == 'pdf'">
                        <v-icon
                            :icon="mdiFilePdfBox"
                            size="100"></v-icon>
                        <p class="position-absolute mx-auto">{{ list.name }}</p>
                    </template>
                </div>
            </div>
        </template>

        <form-view
            :is-show="showForm"
            @close-event="showForm = false"></form-view>

        <detail-image
            :image="detailImageData"
            :is-show="showDetailImage"></detail-image>
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
import { mdiFilePdfBox } from '@mdi/js';
import FormView from './FormView';
import DetailImage from './DetailImage';

const lists = ref([
    {id: 1, name: 'ref1.jpg', image: '/references/ref1.jpg', type: 'image'},
    {id: 2, name: 'ref2.jpg', image: '/references/ref2.jpg', type: 'image'},
    {id: 3, name: 'ref3.jpg', image: '/references/ref3.jpg', type: 'image'},
    {id: 4, name: 'ref4.png', image: '/references/ref4.png', type: 'image'},
    {id: 5, name: 'ref5.png', image: '/references/ref5.png', type: 'image'},
    {id: 6, name: 'ref6.png', image: '/references/ref6.png', type: 'image'},
    {id: 6, name: 'ref6.png', image: '/references/ref6.png', type: 'image'},
    {id: 6, name: 'ref6.png', image: '/references/ref6.png', type: 'image'},
    {id: 6, name: 'ref6.png', image: '/references/ref6.png', type: 'image'},
    {id: 7, name: 'reffile.pdf', image: '/references/reffile.pdf', type: 'pdf'},
]);

const detailImageData = ref(null);

const showForm = ref(false);
const showDetailImage = ref(false);

function previewFile(fileData) {
    if (fileData.type == 'image') {
        detailImageData.value = fileData.image
        showDetailImage.value = true;
    }
}
</script>