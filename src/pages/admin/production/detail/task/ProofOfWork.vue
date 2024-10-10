<template>
    <v-dialog
        v-model="show"
        max-width="600"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('proofOfWork') }}
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateForm">
                    <field-input
                        :label="t('nasLink')"
                        v-model="nas_link"
                        :error-message="errors.nas_link"></field-input>

                    <v-label>{{ $t('previewImage') }}</v-label>
                    <file-pond-com
                        ref="pond"
                        class-name="my-pond"
                        label-idle="Drop files here..."
                        allow-multiple="true"
                        v-on:addfile="updateImages"
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
                                @click.prevent="assignProof(null)">
                                {{ $t('cancel') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useProjectStore } from '@/stores/project'
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const { t } = useI18n();

const store = useProjectStore();

const { detailProject } = storeToRefs(store)

const route = useRoute();

const loading = ref(false);

const emit = defineEmits(['event-close', 'close-in-task-detail']);

const { handleSubmit, setFieldValue, errors, defineField, resetForm } = useForm({
    validationSchema: yup.object({
        nas_link: yup.string()
            .matches(/^(?!.*(https:\/\/))(?=.*(http:\/\/|\\\\192*|file:\/\/)).+$/, {
            message: 'String must start with http:// or \\\\192..... or file://',
                excludeEmptyString: true,
            })
            .required(t('nasLinkRequired')),
        preview: yup.array().required(t('previewImageRequired'))
    })
})

const [nas_link] = defineField('nas_link');
const [preview] = defineField('preview');

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    targetBoard: {
        default: null,
    },
    sourceBoard: {
        default: null,
    },
    taskId: {
        default: null,
    },
    isFromDetail: {
        type: Boolean,
        default: false,
    },
    isManualApproveTask: {
        type: Boolean,
        default: false,
    }
});

const show = ref(false);

const pond = ref(null);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
})

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

const validateForm = handleSubmit((values) => {
    values.preview = preview.value
    values.board_id = props.targetBoard
    values.source_board_id = props.sourceBoard
    values.task_id = props.taskId
    values.manual_approve = props.isManualApproveTask

    assignProof(values)
})

async function assignProof(values = null) {
    if (!values) {
        resetForm();
        pond.value = null;
        values = {
            nas_link: null,
            preview: null,
            board_id: props.targetBoard,
            source_board_id: props.sourceBoard,
            task_id: props.taskId,
        }
    }

    var formData = new FormData();
    formData.append('nas_link', values.nas_link);
    if (values.preview) {
        for (let a = 0; a < values.preview.length; a++) {
            formData.append(`preview[${a}]`, values.preview[a]);
        }
    }
    formData.append('task_id', values.task_id);
    formData.append('source_board_id', values.source_board_id);
    formData.append('board_id', values.board_id);
    formData.append('manual_approve', values.manual_approve)

    loading.value = true;
    await store.uploadProofOfWork(formData, route.params.id || detailProject.value.uid, values.task_id)
    loading.value = false;

    resetForm();

    if (props.isFromDetail) {
        emit('close-in-task-detail');
    } else {
        emit('event-close');
    }
}
</script>