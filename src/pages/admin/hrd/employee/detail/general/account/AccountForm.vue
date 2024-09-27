<template>
    <div>
        <template v-if="!detailOfEmployee">
            <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
        </template>
        <template v-else>
            <template v-if="loadingPrepare">
                <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                <p class="text-center">
                    {{ $t('preparingData') }}
                </p>
            </template>
            <template v-else>
                <v-form @submit="validateData">
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('email') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('email')"
                                v-model="email"
                                :is-solo="true"
                                density="compact"
                                :error-message="errors.email"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('newPassword') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('newPassword')"
                                v-model="password"
                                :is-solo="true"
                                field-type="password"
                                density="compact"
                                :is-required="false"
                                :error-message="errors.password"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('confirmPassword') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('confirmPassword')"
                                v-model="confirm_password"
                                :is-solo="true"
                                :is-required="false"
                                field-type="password"
                                density="compact"
                                :error-message="errors.confirm_password"></field-input>
                        </v-col>
                    </v-row>
        
                    <v-btn variant="flat" 
                        color="secondary" 
                        @click.prevent="$emit('close-event')"
                        :disabled="loading">{{ $t('cancel') }}</v-btn>
                    <v-btn variant="flat" 
                        class="ms-3" 
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
        </template>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useEmployeesStore } from '@/stores/employees'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const store = useEmployeesStore()

const { detailOfEmployee } = storeToRefs(store)

const { handleSubmit, defineField, errors } = useForm({
    validationSchema: yup.object({
        email: yup.string().required(t('emailRequired')),
        password: yup.string().nullable(),
        confirm_password: yup.string()
            .when('password', {
                    is: (value) => (value) && (value.length > 0),
                    then: function () {
                        return yup.string().required(t('confirmPasswordRequired'))
                    },
                    otherwise: function () {
                        return yup.string().nullable()
                    },
                })
    }),
    initialValues: {
        email: detailOfEmployee.value.data.data.user.email,
    }
})

const [email] = defineField('email')
const [password] = defineField('password')
const [confirm_password] = defineField('confirm_password')

const loadingPrepare = ref(false)

const loading = ref(false)

const validateData = handleSubmit(async (values) => {
    console.log('values', values)
})
</script>