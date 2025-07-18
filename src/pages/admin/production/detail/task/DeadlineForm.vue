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

                    <template v-if="detailOfTask.pics.length">
                        <label>Reason</label>
                        <v-radio-group v-model="reason_id"
                            :error-messages="errors.reason_id">
                            <v-radio
                                v-for="(item, i) in listOfAllDeadlineChangeReasons"
                                :label="item.name"
                                :value="item.id"></v-radio>
                            
                            <!-- adding custom radio -->
                            <v-radio label="Others ..." value="custom"></v-radio>
                        </v-radio-group>
                        <field-input
                            label="Your Reason"
                            :is-solo="true"
                            v-if="reason_id == 'custom'"
                            v-model="reason_custom"
                            :error-message="errors.reason_custom"
                            density="compact"></field-input>
                        <div class="d-flex align-center justify-end pb-3" :style="{
                            gap: '10px'
                        }">
                            <v-btn variant="flat" color="grey-lighten-2" type="button" @click.prevent="$emit('close-event')">Close</v-btn>
                            <v-btn variant="flat" color="primary" type="submit">Submit</v-btn>
                        </div>
                    </template>
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
import { useDeadlineChangeReasonStore } from '@/stores/deadlineChangeReason';
import { useRoute } from 'vue-router';
import { showNotification } from '@/compose/notification';

const route = useRoute();

const store = useProjectStore();

const storeDeadline = useDeadlineChangeReasonStore();

const { detailOfTask } = storeToRefs(store);

const {
    listOfAllDeadlineChangeReasons
} = storeToRefs(storeDeadline);

const { t } = useI18n();

const emit = defineEmits(['close-event', 'save-event']);

const showConfirmation = ref(false);

const { defineField, handleSubmit, errors, resetForm, setFieldValue } = useForm({
    validationSchema: yup.object({
        due_date: yup.string().required(),
        reason_id: yup.string().required(),
        reason_custom: yup.string().when('reason_id', {
            is: (value) => value == 'custom',
            then: () => yup.string().required(t('customReasonRequired')),
            otherwise: () => yup.string().nullable()
        }),
    })
});

const [due_date] = defineField('due_date');
const [reason_id] = defineField('reason_id');
const [reason_custom] = defineField('reason_custom');

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

watch(reason_id, (next, current) => {
    if (current == 'custom' && next != 'custom') {
        setFieldValue('reason_custom', '');
    }
});

const validateData = handleSubmit((values) => {
    if (values.reason_id) {
        showConfirmation.value = true;
    }
});

async function doChangeDeadline() {
    let selectedDate = moment(due_date.value, 'YYYY, MMMM DD HH:mm').format('YYYY-MM-DD HH:mm');

    let payload = {
        task_id: detailOfTask.value.uid,
        due_date: selectedDate,
        reason_id: reason_id.value,
        reason_custom: reason_custom.value,
    };
    loading.value = true;

    const resp = await store.updateDeadline(payload, route.params.id);

    const message = resp.status < 300 ? resp.data.message : resp.response.data.message;
    const type = resp.status < 300 ? 'success' : 'error';
    showNotification(message, type);

    if (resp.status < 300) {
        resetForm();
        emit('close-event');
    }

    loading.value = false;
}
</script>