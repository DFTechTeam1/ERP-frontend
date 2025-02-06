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

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    songUid: String
});

const emit = defineEmits(['close-event']);

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: yup.object({
        reason: yup.string().required(t("reasonRequired"))
    })
});

const [reason] = defineField("reason");

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const show = ref(false);

const loading = ref(false);

function closeDialog() {
    emit('close-event');
}

const submitReject = handleSubmit(async (values) => {
    loading.value = true;
    const resp = await store.rejectEditSong(values, detailProject.value.uid, props.songUid);
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        emit('close-event');
    } else {
        showNotification(resp.response.data.message, 'error');
    }
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});
</script>

<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between mb-5">
                    <p class="m-0">{{ $t("reject") }}</p>

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        @click.prevent="closeDialog()"></v-icon>
                </v-card-title>

                <v-card-text>
                    <v-form @submit.prevent="submitReject">
                        <field-input
                            :label="t('reason')"
                            v-model="reason"
                            :error-message="errors.reason"></field-input>

                        <div class="d-flex align-center justify-end">
                            <button-submit
                                :is-loading="loading"
                                :full-width="false"
                                custom-class="w-100"></button-submit>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card-item>
        </master-card>
    </v-dialog>
</template>