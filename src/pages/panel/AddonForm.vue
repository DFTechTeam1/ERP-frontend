<template>
    <div>
        <breadcrumb-data
            :title="pageTitle"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ pageTitle }}</v-card-title>
            </v-card-item>

            <v-card-text class="mt-5">
                <v-form
                    @submit="validateData">
                    <v-row>
                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <field-input
                                :label="t('name')"
                                v-model="name"
                                :error-message="errors.name"></field-input>
                                
                            <div class="file-picker mb-3">
                                <v-label>{{ $t('addonFile') }}</v-label>
                                <file-pond-com
                                    ref="pond"
                                    class-name="my-pond"
                                    label-idle="Drop files here..."
                                    allow-multiple="true"
                                    max-files="1"
                                    v-on:updatefiles="updateMainAddon"
                                ></file-pond-com>
                                <div class="invalid-feedback" v-if="errors.addon_file">{{ errors.addon_file }}</div>
                            </div>
                            <div class="file-picker mb-3">
                                <v-label>{{ $t('tutorialVideo') }}</v-label>
                                <file-pond-com
                                    ref="pondTutorial"
                                    class-name="my-pond"
                                    label-idle="Drop files here..."
                                    allow-multiple="true"
                                    :accepted-file-types="allowedTutorialVideoTypes"
                                    max-files="1"
                                    v-on:updatefiles="updateTutorialVideo"
                                ></file-pond-com>
                                <div class="invalid-feedback" v-if="errors.tutorial_video">{{ errors.tutorial_video }}</div>
                            </div>
                            <div class="file-picker mb-3">
                                <v-label>{{ $t('previewImage') }}</v-label>

                                <file-pond-com
                                    v-on:updatefiles="updatePreviewImage"
                                    ref="pondPreview"
                                    class-name="my-pond"
                                    label-idle="Drop files here..."
                                    :allow-multiple="false"
                                    :accepted-file-types="allowedPreviewImageTypes"
                                    max-files="1"
                                ></file-pond-com>
                                <div class="invalid-feedback" v-if="errors.preview_image">{{ errors.preview_image }}</div>
                                
                            </div>
                        </v-col>
                        <v-col
                            cols="12">
                            <div class="rich-text">
                                <v-label>{{ $t('description') }}</v-label>
                                <QuillEditor 
                                    theme="snow" 
                                    style="height: 200px;"
                                    ref="description_quill"
                                    @update:content="updateDescription" />
                                <div class="invalid-feedback" v-if="errors.description">{{ errors.description }}</div>
                            </div>
                        </v-col>
                    </v-row>

                    <v-btn
                        :disabled="loading"
                        class="mt-2"
                        variant="flat"
                        color="primary"
                        @click.prevent="validateData">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAddonStore } from '@/stores/addon';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const route = useRoute();

const store = useAddonStore();

const { t } = useI18n();

const { handleSubmit, defineField, errors, setFieldValue } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        preview_image: yup.string().required(t('previewImageRequired')),
        addon_file: yup.string().required(t('addonFileRequired')),
        tutorial_video: yup.string().required(t('tutorialVideoRequired')),
        description: yup.string().required(t('descriptionRequired'))
    }),
});

const [name] = defineField('name');
const [preview_image] = defineField('preview_image');
const [addon_file] = defineField('addon_file');
const [tutorial_video] = defineField('tutorial_video');
const [description] = defineField('description');

const detailData = ref(null);

const description_quill = ref(null);

const pond = ref(null);

const pageTitle = ref(t('createAddon'));

const pondTutorial = ref(null);

const pondPreview = ref(null);

const loading = ref(false);

// const allowedTypes = ref('image/jpg, image/jpeg, image/png, image/webp, video/*');

const allowedPreviewImageTypes = ref('image/*');

const allowedTutorialVideoTypes = ref('video/*');

const breadcrumbs = ref([
    {
        title: t('addons'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('addonList'),
        disabled: false,
        href: '/panel/addons',
    },
    {
        title: pageTitle,
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        setFieldValue('description', description_quill.value.getHTML());
    } else {                                                                                                                                                                                                                                                                                                                                                                              
        setFieldValue('description', '');
    }

}

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    var formData = new FormData();

    formData.append('addon_file', addon_file.value);
    formData.append('tutorial_video', tutorial_video.value);
    formData.append('preview_image', preview_image.value);
    formData.append('name', values.name);
    formData.append('description', description.value);
    
    const response = await store.storeAddon(formData);
    loading.value = false;
    
    if (response.status < 300) {
        router.push({path: '/panel/addons'});
    }
});

async function initDetail() {
    const resp = await store.detail({id: route.params.id});
    
    if (resp.status < 300) {
        detailData.value = resp.data.data;
        setFieldValue('name', detailData.value.name);

        if (detailData.value.description) {
            description_quill.value.setHTML(detailData.value.description);
        }
    }
}

function updatePreviewImage() {
    var _value = null;
    if ((pondPreview.value) && pondPreview.value.getFile()) {
        _value = pondPreview.value.getFile().file;
    }
    
    setFieldValue('preview_image', _value);
}

function updateMainAddon() {
    var _value = null;
    if ((pond.value) && pond.value.getFile()) {
        _value = pond.value.getFile().file;
    }
    
    setFieldValue('addon_file', _value);
}

function updateTutorialVideo() {
    var _value = null;
    if ((pondTutorial.value) && pondTutorial.value.getFile()) {
        _value = pondTutorial.value.getFile().file;
    }
    
    setFieldValue('tutorial_video', _value);
}

onMounted(() => {
    if (route.params.id) {
        initDetail();
        pageTitle.value = t('editAddon');
    }
});
</script>