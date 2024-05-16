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
                        v-model="event_class"
                        :is-required="false"
                        :error-message="errors.event_class"></field-input>

                    <v-btn
                        varian="outlined"
                        color="primary"
                        type="submit">
                        {{ $t('save') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { mdiClose } from '@mdi/js'
import { useProjectStore } from '@/stores/project'

const store = useProjectStore();

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

const { errors, defineField, handleSubmit, resetForm, setValues } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        date: yup.string().required(t('dateRequired')),
        event_type: yup.string().required(t('eventTypeRequired')),
        event_class: yup.string().nullable(),
    }),
})

const [name] = defineField('name');
const [date] = defineField('date');
const [event_type] = defineField('event_type');
const [event_class] = defineField('event_class');

const eventTypes = ref([
    {title: t('wedding'), value: 'wedding'},
    {title: t('birthday'), value: 'birthday'},
    {title: t('event'), value: 'event'},
    {title: t('exibition'), value: 'exibition'},
])

const classes = ref([
    {title: t('big'), value: 'big'},
    {title: t('standard'), value: 'standard'},
    {title: t('budget'), value: 'budge'},
    {title: t('template'), value: 'template'},
])

watch(props, (values) => {
    if (values) {
        dialog.value = values.isOpen;
    }

    if (values.basicData) {
        setValues({
            name: values.basicData.name,
            date: values.basicData.date,
            event_type: values.basicData.event_type,
            event_class: values.basicData.class,
        })
    }
})

const validateData = handleSubmit(async (values) => {
    const storeData = await store.editBasicInformation(values)

    if (storeData) {
        resetForm();

        emit('close-form');
    }
})
</script>