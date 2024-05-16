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
                                ></file-pond-com>
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

                                <!-- <template v-if="detailData">
                                    <div class="my-4">
                                        <v-avatar 
                                            class="border"
                                            size="100">
                                            <v-img
                                                :src="detailData.preview_img"></v-img>
                                        </v-avatar>
                                    </div>
                                </template> -->

                                <file-pond-com
                                    ref="pondPreview"
                                    class-name="my-pond"
                                    label-idle="Drop files here..."
                                    allow-multiple="true"
                                    :accepted-file-types="allowedTypes"
                                    max-files="1"
                                ></file-pond-com>
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
    }),
});

const [name] = defineField('name');

const detailData = ref(null);

const description_quill = ref(null);

const description = ref(null);

const pond = ref(null);

const pageTitle = ref(t('createAddon'));

const pondTutorial = ref(null);

const pondPreview = ref(null);

const loading = ref(false);

const allowedTypes = ref('image/jpg, image/jpeg, image/png, image/webp, video/*')

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
        description.value = description_quill.value.getHTML();
    } else {                                                                                                                                                                                                                                                                                                                                                                              
        description.value = null;
    }

}

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    var formData = new FormData();
    var addonFile = !pond.value ? null : (pond.value.getFiles().length ? pond.value.getFiles()[0].file : null);
    var tutorialVideo = !pondTutorial.value ? null : (pondTutorial.value.getFiles().length ? pondTutorial.value.getFiles()[0].file : null);
    var previewImage = !pondPreview.value ? null : (pondPreview.value.getFiles().length ? pondPreview.value.getFiles()[0].file : null);
    formData.append('addon_file', addonFile);
    formData.append('tutorial_video', tutorialVideo);
    formData.append('preview_image', previewImage);
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

onMounted(() => {
    if (route.params.id) {
        initDetail();
        pageTitle.value = t('editAddon');
    }
});
</script>