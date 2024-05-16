<template>
    <div>
        <v-form>
            <v-row class="pt-4">
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <label for="" class="form-label">{{ $t('idCardPhoto') }}</label>
                    <file-picker
                        :image="idNUmberPreview"
                        key-image="id_number_photo"
                        @image-updated="updateImage"
                        @delete-image-event="removeImage('id_number_photo')"></file-picker>
                    <!-- <div class="w-100">
                        <template v-if="(props.detailData) && (props.detailData.id_number_photo)">
                            <div 
                                class="mb-3 position-relative img-preview-wrapper"
                                id="img-wrapper-id-number"
                                @click="removeImage('id-number', 'id_number_photo')">
                                <v-img
                                    :src="props.detailData.id_number_photo"
                                    rounded
                                    width="200"></v-img>
                                <v-icon
                                    class="position-absolute"
                                    :icon="mdiCloseCircle"
                                    size="20"
                                    color="red"></v-icon>
                            </div>
                        </template>
                        <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            accepted-file-types="image/jpeg, image/png"
                            max-files="1"
                            v-bind:files="myFiles"
                            v-on:init="handleFilePondInit"
                        ></file-pond-com>
                    </div> -->
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <label for="" class="form-label">{{ $t('photoOf') }} <i>NPWP</i></label>
                    <file-picker
                        :image="npwpPreview"
                        key-image="npwp_photo"
                        @image-updated="updateImage"
                        @delete-image-event="removeImage('npwp_photo')"></file-picker>
                    <!-- <file-pond-com
                        ref="pondNpwp"
                        class-name="my-pond"
                        label-idle="Drop files here..."
                        allow-multiple="true"
                        accepted-file-types="image/jpeg, image/png"
                        max-files="1"
                        v-bind:files="myFiles"
                        v-on:init="handleFilePondInit"
                    ></file-pond-com> -->
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <label for="" class="form-label">{{ $t('photoOf') }} <i>BPJS</i></label>
                    <!-- <file-pond-com
                        ref="pondBPJS"
                        class-name="my-pond"
                        label-idle="Drop files here..."
                        allow-multiple="true"
                        accepted-file-types="image/jpeg, image/png"
                        max-files="1"
                        v-bind:files="myFiles"
                        v-on:init="handleFilePondInit"
                    ></file-pond-com> -->
                    <file-picker
                        :image="bpjsPreview"
                        key-image="bpjs_photo"
                        @image-updated="updateImage"
                        @delete-image-event="removeImage('bpjs_photo')"></file-picker>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <label for="" class="form-label">{{ $t('photoOf') }} <i>KK</i></label>
                    <!-- <file-pond-com
                        ref="pondKK"
                        class-name="my-pond"
                        label-idle="Drop files here..."
                        allow-multiple="true"
                        accepted-file-types="image/jpeg, image/png"
                        max-files="1"
                        v-bind:files="myFiles"
                        v-on:init="handleFilePondInit"
                    ></file-pond-com> -->
                    <file-picker
                        :image="kkPreview"
                        key-image="kk_photo"
                        @image-updated="updateImage"
                        @delete-image-event="removeImage('kk_photo')"></file-picker>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>




<script setup>
import { ref } from 'vue';
import { useEmployeesStore } from '@/stores/employees';
import { watch } from 'vue';
import { onMounted } from 'vue';

const store = useEmployeesStore();

// const pond = ref(null);
// const pondNpwp = ref(null);
// const pondKK = ref(null);
// const pondBPJS = ref(null);
const idNUmberPreview = ref(null);
const npwpPreview = ref(null);
const bpjsPreview = ref(null);
const kkPreview = ref(null);

const fileData = ref({});
const deletedImages = ref({
    deletedImage: {}
})

const props = defineProps({
    detailData : {
        default: null,
    },
});

const storeFiles = () => {
    console.log('file', fileData.value);

    store.storeDocuments({images: fileData.value, deleted: deletedImages.value});
}

defineExpose({
    storeFiles,
})

watch(props, (values) => {
    console.log('props image', values);
    // if (values.detailData) {
    //     if (values.detailData.id_number_photo) {
    //         idNUmberPreview.value = values.detailData.id_number_photo;
    //     }
    // }
})

onMounted(() => {
    if (props.detailData) {
        if (props.detailData.id_number_photo) {
            idNUmberPreview.value = props.detailData.id_number_photo;
        }
        if (props.detailData.npwp_photo) {
            npwpPreview.value = props.detailData.npwp_photo;
        }
        if (props.detailData.bpjs_photo) {
            bpjsPreview.value = props.detailData.bpjs_photo;
        }
        if (props.detailData.kk_photo) {
            kkPreview.value = props.detailData.kk_photo;
        }
    }
})

function updateImage(key) {
    fileData.value[key.key] = key.value;
}

function removeImage(imageKey) {
    document.getElementById('img-wrapper-' + imageKey).remove();

    deletedImages.value.deletedImage[imageKey] = 1;
}
</script>