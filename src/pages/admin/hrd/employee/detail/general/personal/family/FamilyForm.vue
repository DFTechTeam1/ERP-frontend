<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('addFamily') }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <field-input
                        :label="t('name')"
                        v-model="name"
                        :error-message="errors.name"
                        class="mb-3"></field-input>
                    <field-input
                        :label="t('relation')"
                        v-model="relation"
                        :error-message="errors.relation"
                        input-type="select"
                        :select-options="relations"
                        class="mb-3"></field-input>
                    <date-picker
                        class="mb-3"
                        :label="t('dateOfBirth')"
                        v-model="date_of_birth"
                        :error-message="errors.date_of_birth"
                        :is-required="false"></date-picker>
                    <field-input
                        class="mb-3"
                        :label="t('idNumber')"
                        v-model="id_number"
                        :error-message="errors.id_number"></field-input>
                    <field-input
                        class="mb-3"
                        :label="t('gender')"
                        input-type="select"
                        :is-required="false"
                        v-model="gender"
                        :error-message="errors.gender"
                        :select-options="genderOptions"></field-input>
                    <field-input
                        class="mb-3"
                        :label="t('job')"
                        v-model="job"
                        :is-required="false"
                        :error-message="errors.job"></field-input>

                    <div class="text-end">
                        <v-btn
                            variant="flat"
                            color="grey-lighten-1"
                            :disabled="loading"
                            @click.prevent="$emit('close-event')">
                            {{ $t('cancel') }}
                        </v-btn>
                        <v-btn
                            variant="flat"
                            color="primary"
                            type="submit"
                            class="ms-2"
                            :disabled="loading">
                            {{ $t('save') }}
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import * as yup from 'yup'

const show = ref(false)

const store = useEmployeesStore()

const route = useRoute()

const { t } = useI18n()

const { defineField, errors, handleSubmit, resetForm, setValues } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        relation: yup.string().required(t('relationRequired')),
        date_of_birth: yup.string().nullable(),
        id_number: yup.string()
            .max(16, t('idNumberMax', {max: 16}))
            .min(16, t('idNumberMax', {max: 16}))
            .required(t('idNumberRequired')),
        gender: yup.string().nullable(),
        job: yup.string().nullable(),
    })
})

const [name] = defineField('name')
const [relation] = defineField('relation')
const [date_of_birth] = defineField('date_of_birth')
const [id_number] = defineField('id_number')
const [gender] = defineField('gender')
const [job] = defineField('job')

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    familyData: {
        type: Object,
    },
})

const relations = ref([
    {
        title: t('father'),
        value: 'father',
    },
    {
        title: t('mother'),
        value: 'mother',
    },
    {
        title: t('sibling'),
        value: 'sibling',
    },
    {
        title: t('child'),
        value: 'child',
    },
    {
        title: t('other'),
        value: 'other',
    },
])

const loading = ref(false)

const emit = defineEmits(['close-event'])

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        if (values.familyData) {
            setValues({
                name: props.familyData.name,
                relation: props.familyData.relation_raw,
                date_of_birth: props.familyData.date_of_birth_raw,
                id_number: props.familyData.id_number,
                gender: props.familyData.gender,
                job: props.familyData.job,
            })
        }
    }
})

const genderOptions = ref([
    {title: t('male'), value: 'male'},
    {title: t('female'), value: 'female'},
]);

const validateData = handleSubmit(async (values) => {
    loading.value = true
    var resp = null;
    if (props.familyData) {
        resp = await store.updateFamily(values, props.familyData.uid)
    } else {
        resp = await store.storeFamily(values, route.params.id)
    }
    loading.value = false

    if (resp.status < 300) {
        resetForm()
        emit('close-event', true)
    }
})
</script>