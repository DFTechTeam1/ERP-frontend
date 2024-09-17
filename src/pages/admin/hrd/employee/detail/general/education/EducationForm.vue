<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('addEmergencyContact') }}

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
                        :label="t('phone')"
                        v-model="phone"
                        :error-message="errors.phone"
                        class="mb-3"></field-input>
                    <field-input
                        :label="t('relation')"
                        v-model="relation"
                        :error-message="errors.relation"
                        input-type="select"
                        :select-options="relations"
                        class="mb-3"></field-input>

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
        phone: yup.string().required(t('phoneRequired')),
    })
})

const [name] = defineField('name')
const [relation] = defineField('relation')
const [phone] = defineField('phone')

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    emergencyData: {
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

        if (values.emergencyData) {
            setValues({
                name: props.emergencyData.name,
                relation: props.emergencyData.relation,
                phone: props.emergencyData.phone,
            })
        }
    }
})

const validateData = handleSubmit(async (values) => {
    loading.value = true
    var resp = null;
    if (props.emergencyData) {
        resp = await store.updateEmergency(values, props.emergencyData.uid)
    } else {
        resp = await store.storeEmergency(values, route.params.id)
    }
    loading.value = false

    if (resp.status < 300) {
        resetForm()
        emit('close-event', true)
    }
})
</script>