<template>
    <v-form @submit="validateData">
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('idNumber') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('idNumber')"
                    :is-solo="true"
                    v-model="id_number"
                    :error-message="errors.id_number"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">NPWP</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    <field-input
                        :label="t('npwpNumber')"
                        :is-solo="true"
                        :is-required="false"
                        v-model="npwp_number"
                        :error-message="errors.npwp_number"
                        density="compact">
                        </field-input>
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">BPJS</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    <field-input
                        label="BPJS"
                        :is-solo="true"
                        :is-required="false"
                        v-model="bpjs_ketenagakerjaan_number"
                        :error-message="errors.bpjs_ketenagakerjaan_number"
                        density="compact">
                        </field-input>
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('address') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('address')"
                    :is-solo="true"
                    v-model="address"
                    :error-message="errors.address"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('currentAddress') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    <field-input
                        :label="t('currentAddress')"
                        :is-solo="true"
                        v-model="current_address"
                        :error-message="errors.current_address"
                        density="compact">
                    </field-input>
                </p>
            </v-col>
        </v-row>

        <v-btn variant="flat" 
            color="secondary" 
            class="mt-4"
            @click.prevent="$emit('close-event')"
            :disabled="loading">{{ $t('cancel') }}</v-btn>
        <v-btn variant="flat" 
            class="ms-3 mt-4" 
            color="primary" 
            type="submit"
            :disabled="loading">
            <template v-if="loading">
                {{ $t('processing') }}
            </template>
            <template v-else>
                {{ $t('save') }}
            </template>
        </v-btn>
    </v-form>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import * as yup from 'yup'

const { t } = useI18n()

const store = useEmployeesStore()

const emit = defineEmits(['close-event'])

const loading = ref(false)

const route = useRoute()

const { detailOfEmployee } = storeToRefs(store)

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: yup.object({
        id_number: yup.string()
            .max(16, t('idNumberMax', {max: 16}))
            .min(16, t('idNumberMax', {max: 16}))
            .required(t('idNumberRequired')),
        npwp_number: yup.string().nullable(),
        bpjs_ketenagakerjaan_number: yup.string().nullable(),
        address: yup.string().required(t('addressRequired')),
        current_address: yup.string().required(t('currentAddressRequired')),
    }),
    initialValues: {
        id_number: detailOfEmployee.value.data.data.id_number,
        npwp_number: detailOfEmployee.value.data.data.npwp_number,
        bpjs_ketenagakerjaan_number: detailOfEmployee.value.data.data.bpjs_ketenagakerjaan_number,
        address: detailOfEmployee.value.data.data.address,
        current_address: detailOfEmployee.value.data.data.current_address,
    }
})

const [id_number] = defineField('id_number')
const [npwp_number] = defineField('npwp_number')
const [bpjs_ketenagakerjaan_number] = defineField('bpjs_ketenagakerjaan_number')
const [address] = defineField('address')
const [current_address] = defineField('current_address')

const validateData = handleSubmit(async (values) => {
    loading.value = true
    await store.updateIdentity(values, route.params.id)
    loading.value = false

    emit('close-event')
})
</script>