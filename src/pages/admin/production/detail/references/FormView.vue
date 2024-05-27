<template>
    <v-dialog
        v-model="show"
        max-width="600"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p>{{ $t('addReferences') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        @click.prevent="$emit('close-event')"
                        size="20"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text
                class="mt-5">
                <v-form
                    @submit="validateData">
                        <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            v-on:updatefiles="updateImages"
                            accepted-file-types="image/png, image/jpg, image/jpeg, image/webp, applicaation/pdf"
                        ></file-pond-com>
                        <div class="invalid-feedback" 
                            style="padding-inline: 16px;"
                            v-if="fileErrorRequired">
                            File is required
                        </div>

                        <button-submit
                            :is-loading="loading"></button-submit>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import * as yup from 'yup';
import { useForm, useFieldArray } from 'vee-validate';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/stores/project';

const store = useProjectStore();

const { detailProject } = storeToRefs(store);

const { errors, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        files: yup.array().of(
            yup.object().shape({
                path: yup.string().required(),
            }),
        ),
    }),
    initialValues: {
        files: [
            {path: ''},
        ],
    },
});

const { replace } = useFieldArray('files');

const emit = defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const show = ref(false);

const loading = ref(false);

const pond = ref(null);

const fileErrorRequired = ref(false);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

watch(errors, (values) => {
    if (values['files[0].path']) {
        fileErrorRequired.value = true;
    }
})

const validateData = handleSubmit(async(values) => {
    loading.value = true;
    var formData = new FormData();
    for (let a = 0; a < values.files.length; a++) {
        formData.append(`files[${a}][path]`, values.files[a].path);
    }
    const resp = await store.storeReferences(formData, detailProject.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        resetForm();
        emit('close-event');
    }
});

function updateImages() {
    if (pond.value.getFiles().length) {
        var files = [];
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            files.push({
                path: pond.value.getFiles()[a].file
            });
        }

        replace(files);
        fileErrorRequired.value = false;
    } else {
        replace([{path: ''}]);
        fileErrorRequired.value = true;
    }
}
</script>