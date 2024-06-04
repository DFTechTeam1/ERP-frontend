<template>
    <v-dialog
        v-model="dialog"
        max-width="600">
        <v-card>
            <v-card-item>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between">
                        {{ $t('editProject') }}
                        <v-icon
                            :icon="mdiClose"
                            class="cursor-pointer"
                            @click.prevent="$emit('close-form')"></v-icon>
                    </div>
                </v-card-title>

                <v-card-text class="mt-5">
                    <v-form @submit="validateData">
                        <field-input
                            :label="t('venue')"
                            v-model="venue"
                            :error-message="errors.venue"></field-input>
                        <field-input
                            :label="t('eventType')"
                            v-model="event_type"
                            input-type="select"
                            :select-options="eventTypeList"
                            :error-message="errors.event_type"></field-input>
                        <field-input
                            :label="t('collaboration')"
                            v-model="collaboration"
                            :error-message="errors.collaboration"
                            :is-required="false"></field-input>
                        <field-input
                            :label="t('status')"
                            v-model="status"
                            input-type="select"
                            :select-options="projectStatus"
                            :error-message="errors.status"></field-input>
                        <field-input
                            :label="t('note')"
                            v-model="note"
                            :error-message="errors.note"
                            :is-required="false"></field-input>
                        <field-input
                            :label="t('clientPortal')"
                            v-model="client_portal"
                            :error-message="errors.client_portal"></field-input>

                        <v-btn
                            varian="outlined"
                            :disabled="loading"
                            color="primary"
                            type="submit">
                            <template v-if="loading">{{ $t('processing') }}</template>
                            <template v-else>{{ $t('save') }}</template>
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card-item>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';

const store = useProjectStore();
const { detailProject } = storeToRefs(store);

const { t } = useI18n();

const emit = defineEmits(['close-form'])

const { handleSubmit, defineField, errors, setValues } = useForm({
    validationSchema: yup.object({
        venue: yup.string().required(),
        event_type: yup.string().required(),
        collaboration: yup.string().nullable(),
        status: yup.string().required(),
        note: yup.string().nullable(),
        client_portal: yup.string().required(),
    })
})

const [venue] = defineField('venue')
const [event_type] = defineField('event_type')
const [collaboration] = defineField('collaboration')
const [status] = defineField('status')
const [note] = defineField('note')
const [client_portal] = defineField('client_portal')

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
})

const dialog = ref(false);

const loading = ref(false);

const eventTypeList = ref([]);

const projectStatus = ref([]);

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    const resp = await store.editMoreDetail(values, detailProject.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        emit('close-form');
    }
})

async function initEventType() {
    const resp = await store.initEventTypes();

    if (resp.status < 300) {
        eventTypeList.value = resp.data.data;
    }
}

async function initProjectStatus() {
    const resp = await store.initProjectStatus();

    if (resp.status < 300) {
        projectStatus.value = resp.data.data;
    }
}

watch(props, (values) => {
    if (values) {
        dialog.value = values.isOpen
    }

    if (values.isOpen) {
        initEventType();
        initProjectStatus();
    }
})

watch(detailProject, (values) => {
    if (values) {
        setValues({
            venue: values.venue,
            event_type: values.event_type_raw,
            collaboration: values.collaboration,
            status: values.status_raw,
            note: values.note,
            client_portal: values.client_portal,
        })
    }
})
</script>