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
                            :error-message="errors.event_type"></field-input>
                        <field-input
                            :label="t('collaboration')"
                            v-model="collaboration"
                            :error-message="errors.collaboration"
                            :is-required="false"></field-input>
                        <field-input
                            :label="t('status')"
                            v-model="status"
                            :error-message="errors.status"></field-input>
                        <field-input
                            :label="t('note')"
                            v-model="note"
                            :error-message="errors.note"
                            :is-required="false"></field-input>
                        <date-picker
                            :label="t('eventDate')"
                            v-model="date"
                            :error-message="errors.date"></date-picker>
                        <field-input
                            :label="t('clientPortal')"
                            v-model="client_portal"
                            :error-message="errors.client_portal"></field-input>

                        <v-btn
                            varian="outlined"
                            color="primary"
                            type="submit">
                            {{ $t('save') }}
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

const { t } = useI18n();

defineEmits(['close-form'])

const { handleSubmit, defineField, errors, setValues } = useForm({
    validationSchema: yup.object({
        venue: yup.string().required(),
        event_type: yup.string().required(),
        collaboration: yup.string().nullable(),
        status: yup.string().required(),
        note: yup.string().nullable(),
        date: yup.string().nullable(),
        client_portal: yup.string().required(),
    })
})

const [venue] = defineField('venue')
const [event_type] = defineField('event_type')
const [collaboration] = defineField('collaboration')
const [status] = defineField('status')
const [note] = defineField('note')
const [date] = defineField('date')
const [client_portal] = defineField('client_portal')

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    data: {
        default: null,
    },
})

const dialog = ref(false);

const validateData = handleSubmit((values) => {
    console.log('values', values);
})

watch(props, (values) => {
    if (values) {
        dialog.value = values.isOpen
    }

    if (values.data) {
        setValues({
            venue: values.data.venue,
            event_type: values.data.event_type,
            collaboration: values.data.collaboration,
            status: values.data.status,
            note: values.data.note,
            date: values.data.date,
            client_portal: values.data.client_portal_url,
        })
    }
})
</script>