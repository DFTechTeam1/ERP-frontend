<template>
    <v-dialog
        v-model="show"
        width="500"
        persistent>
        <v-card flat
            class="p-0">
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p :style="{
                        fontSize: '12px'
                    }">Current deadline: <span :style="{
                        fontWeight: 'bold'
                    }">{{ (detailOfTask.end_date) && (detailOfTask.end_date.length) ? moment(detailOfTask.end_date, 'YYYY-MM-DD HH:mm').format('YYYY, MMMM DD HH:mm') : '-' }}</span></p>
                    <v-icon :icon="mdiClose"
                        color="red"
                        size="14"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>
            <v-card-text class="card-deadline-body">
                <v-form class="mt-4 px-5" @submit.prevent="validateData">
                    <date-picker
                        class="mt-3"
                        :label="t('changeDeadliineTo')"
                        :with-time-picker="true"
                        :is-required="false"
                        v-model="due_date"
                        :error-message="errors.due_date"></date-picker>

                    <label>Reason</label>
                    <v-radio-group>
                        <v-radio label="Radio One" value="one"></v-radio>
                        <v-radio label="Radio Two" value="two"></v-radio>
                        <v-radio label="Radio Three" value="three"></v-radio>
                    </v-radio-group>

                    <div class="d-flex align-center justify-end pb-3" :style="{
                        gap: '10px'
                    }">
                        <v-btn variant="flat" color="grey-lighten-2" type="button">Close</v-btn>
                        <v-btn variant="flat" color="primary" type="submit">Submit</v-btn>
                    </div>
                </v-form>

                <!-- confirmation -->
                <confirmation-modal
                    title="Change Deadline"
                    :text="t('changeDeadlineConfirmationText', {from: (detailOfTask.end_date) && (detailOfTask.end_date.length) ? moment(detailOfTask.end_date, 'YYYY-MM-DD').format('YYYY, MMMM DD HH:mm') : '', to: due_date })"
                    :loading="loading"
                    :show-confirm="showConfirmation"
                    :delete-ids="[]"
                    @action-bulk-submit="doChangeDeadline"></confirmation-modal>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.card-deadline-body {
    padding: 0 !important;
}
</style>

<script setup>
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import moment from 'moment';

const store = useProjectStore();

const { detailOfTask } = storeToRefs(store);

const { t } = useI18n();

const emit = defineEmits(['close-event', 'save-event']);

const showConfirmation = ref(false);

const { defineField, handleSubmit, errors, resetForm } = useForm({
    validationSchema: yup.object({
        due_date: yup.string().required(),
        reason_id: yup.string().required(),
        reason_custom: yup.string().nullable()
    })
});

const [due_date] = defineField('due_date');

const loading = ref(false)

const show = ref(false);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

const validateData = handleSubmit((values) => {
    showConfirmation.value = true;
});

function doChangeDeadline() {
    console.log('due', due_date.value);
    loading.value = true;

    

    loading.value = false;
}
</script>