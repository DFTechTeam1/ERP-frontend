<script setup>
import { showNotification } from '@/compose/notification';
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    songUid: String
});

const emit = defineEmits(['close-event']);

const loading = ref(false);

const pond = ref(null);

const { handleSubmit, setFieldValue, errors, defineField, resetForm } = useForm({
    validationSchema: yup.object({
        nas_path: yup.string()
            .matches(/^(?!.*(https:\/\/))(?=.*(http:\/\/|\\\\192*|file:\/\/)).+$/, {
            message: 'String must start with http:// or \\\\192..... or file://',
                excludeEmptyString: true,
            })
            .required(t('nasLinkRequired')),
        preview: yup.array().required(t('previewImageRequired'))
    })
})

const [nas_path] = defineField('nas_path');
const [preview] = defineField('preview');

const show = ref(false);

function updateImages() {
    if (pond.value.getFiles().length) {
        var images = [];
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            images.push(pond.value.getFiles()[a].file)
        }
        setFieldValue('preview', images);
    } else {
        setFieldValue('preview', null);
    }
}

const validateForm = handleSubmit(async (values) => {

    let formData = new FormData();
    formData.append('nas_path', values.nas_path);
    for (let a = 0; a < preview.value.length; a++) {
        formData.append(`images[${a}]`, preview.value[a]);
    }

    loading.value = true;
    const resp = await store.songReportAsDone(formData, detailProject.value.uid, props.songUid);
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        closeForm();
    } else {
        showNotification(resp.response.data.message, 'error');
    }
});

function closeForm() {
    resetForm();
    emit('close-event');
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});
</script>

<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-content-between">
                    {{ $t("reportAsDone") }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        color="red"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateForm">
                    <field-input
                        :label="t('nasLink')"
                        v-model="nas_path"
                        :error-message="errors.nas_path"></field-input>

                    <v-label>{{ $t('previewImage') }}</v-label>
                    <file-pond-com
                        ref="pond"
                        class-name="my-pond"
                        label-idle="Drop files here..."
                        allow-multiple="true"
                        maxFileSize="35MB"
                        v-on:addfile="updateImages"
                        v-on:removefile="updateImages"
                        accepted-file-types="image/png, image/jpg, image/jpeg, image/webp"
                    ></file-pond-com>
                    <div class="invalid-feedback" v-if="errors.preview">{{ errors.preview }}</div>

                    <v-row>
                        <v-col
                            cols="12">
                            <v-btn variant="flat"
                                color="primary"
                                class="mt-4 w-100"
                                :disabled="loading"
                                type="submit">
                                {{ $t('save') }}
                            </v-btn>
                            <v-btn variant="flat"
                                color="grey-lighten-1"
                                class="mt-1 w-100"
                                :disabled="loading"
                                @click.prevent="closeForm(null)">
                                {{ $t('cancel') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>