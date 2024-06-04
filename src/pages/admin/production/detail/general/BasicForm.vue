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
            </v-card-item>
            <v-card-text>
                <v-form
                    @submit="validateData">
                    <field-input
                        :label="t('name')"
                        :error-message="errors.name"
                        v-model="name"></field-input>

                    <date-picker
                        class="mt-4"
                        v-model="date"
                        :error-messsage="errors.date"
                        :label="t('eventDate')"
                        :is-required="true"
                        ></date-picker>

                    <field-input
                        class="mt-4"
                        :label="t('eventType')"
                        inputType="select"
                        :select-options="eventTypes"
                        v-model="event_type"
                        :error-message="errors.event_type"></field-input>

                    <field-input
                        class="mt-4"
                        :label="t('eventClass')"
                        inputType="select"
                        :select-options="classes"
                        v-model="classification"
                        :is-required="false"
                        :error-message="errors.event_class"></field-input>

                    <v-btn
                        varian="outlined"
                        color="primary"
                        :disabled="loading"
                        type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { mdiClose } from '@mdi/js'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia';

const store = useProjectStore();
const { detailProject } = storeToRefs(store);

const emit = defineEmits(['close-form']);

const { t } = useI18n();

const dialog = ref(false);

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    basicData: {
        type: Object,
        default: null,
    },
})

const { errors, defineField, handleSubmit, setValues } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        date: yup.string().required(t('dateRequired')),
        event_type: yup.string().required(t('eventTypeRequired')),
        classification: yup.string().required(),
    }),
})

const [name] = defineField('name');
const [date] = defineField('date');
const [event_type] = defineField('event_type');
const [classification] = defineField('classification');

const eventTypes = ref([])

const loading = ref(false);

const classes = ref([])

watch(props, (values) => {
    if (values) {
        dialog.value = values.isOpen;
    }

    initEventTypes();
    initClassList();
})

watch(detailProject, (values) => {
    setForm(values);
})

function setForm(values) {
    setValues({
        name: values.name,
        date: values.project_date,
        event_type: values.event_type_raw,
        classification: values.event_class_raw,
    })
}

async function initClassList() {
    const resp = await store.initClassList();

    if (resp.status < 300) {
        classes.value = resp.data.data;
    }
}

async function initEventTypes() {
    const resp = await store.initEventTypes();

    if (resp.status < 300) {
        eventTypes.value = resp.data.data;
    }
}

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    const storeData = await store.editBasicInformation(values, detailProject.value.uid)
    loading.value = false;

    if (storeData.status < 300) {
        setForm(detailProject.value);

        emit('close-form', storeData.data.data);
    }
})
</script>