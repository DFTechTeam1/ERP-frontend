<script setup>
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const emit = defineEmits(['close-event', 'submit-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    }
});

const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        reason: yup.string().required(t("reasonRequired"))
    })
});

const [reason] = defineField("reason");

const show = ref(false);

const loading = ref(false);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

const closeDialog = () => {
    resetForm();
    emit('close-event');
};

const validateData = handleSubmit((values) => {
    emit('submit-event', values);
    resetForm();
});
</script>

<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between mb-5">
                    <p class="m-0">{{ props.title }}</p>

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        @click.prevent="closeDialog()"></v-icon>
                </v-card-title>

                <v-card-text>
                    <v-form @submit.prevent="validateData">
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