<template>
    <v-dialog
        max-width="600"
        v-model="show"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title>{{ $t('upgradeAddon') }}</v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form
                    @submit="validateForm">
                    <div class="file-picker mb-3">
                        <v-label>{{ $t('addonFile') }}</v-label>
                        <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            max-files="1"
                            v-on:updatefiles="addingFile"
                        ></file-pond-com>
                        <div class="invalid-feedback" v-if="errors.main_file">{{ errors.main_file }}</div>
                    </div>

                    <div class="file-picker mb-3">
                        <v-label>{{ $t('tutorialVideo') }}</v-label>
                        <file-pond-com
                            ref="pondTutorial"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            :accepted-file-types="allowedTypes"
                            max-files="1"
                        ></file-pond-com>
                    </div>
                    <div class="file-picker mb-3">
                        <v-label>{{ $t('previewImage') }}</v-label>
                        <file-pond-com
                            ref="pondPreview"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            :accepted-file-types="allowedTypes"
                            max-files="1"
                        ></file-pond-com>
                    </div>

                    <div class="rich-text">
                        <v-label>{{ $t('aboutUpgrade') }}</v-label>
                        <QuillEditor 
                            theme="snow" 
                            style="height: 200px;"
                            ref="description_quill"
                            @update:content="updateDescription" />
                    </div>

                    <v-btn
                        :disabled="loading"
                        class="mt-3 w-100"
                        variant="flat"
                        color="primary"
                        type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                    <v-btn
                        :disabled="loading"
                        class="mt-3 w-100"
                        variant="flat"
                        color="light-grey-1"
                        @click.prevent="closeForm">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('cancel') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>        
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useAddonStore } from '@/stores/addon';
// import { useI18n } from 'vue-i18n';

// const { t } = useI18n();

const store = useAddonStore();

const emit = defineEmits(['close-event-upgrade']);

const { errors, setFieldValue, values, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        main_file: yup.string().required('Main file is required'),
    }),
});

const show = ref(false);

const loading = ref(false);

const description_quill = ref(null);

const description = ref(null);

const pond = ref(null);

const pondTutorial = ref(null);

const pondPreview = ref(null);

const allowedTypes = ref('image/jpg, image/jpeg, image/png, image/webp, video/*')

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    detail: {
        default: null,
    },
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }

    // if (values.detail) {

    // }
})

const validateForm = handleSubmit(async (values) => {
    loading.value = true;
    const formData = new FormData();
    formData.append('main_file', values.main_file);
    var tutorialVideo = !pondTutorial.value ? '' : (pondTutorial.value.getFiles().length ? pondTutorial.value.getFiles()[0].file : '');
    var previewImage = !pondPreview.value ? '' : (pondPreview.value.getFiles().length ? pondPreview.value.getFiles()[0].file : '');
    formData.append('tutorial_video', tutorialVideo);
    formData.append('preview_image', previewImage);
    
    formData.append('improvements', description.value);

    const resp = await store.upgradeAddon(formData, props.detail);
    loading.value = false;
    if (resp.status < 300) {
        closeForm();
    }
})

const addingFile = (context) => {
    if (context.length) {
        if (context[0].file) {
            setFieldValue('main_file', context[0].file);
        }
    } else {
        setFieldValue('main_file', '');
    }
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        description.value = description_quill.value.getHTML();
    } else {                                                                                                                                                                                                                                                                                                                                                                              
        description.value = null;
    }
}

function closeForm() {
    resetForm();
    emit('close-event-upgrade');
}
</script>