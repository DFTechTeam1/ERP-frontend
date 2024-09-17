<template>
    <v-form @submit="validateData">
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('name') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('name')"
                    :is-solo="true"
                    v-model="name"
                    :error-message="errors.name"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('nickname') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('nickname')"
                    :is-solo="true"
                    v-model="nickname"
                    :error-message="errors.nickname"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('phone') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('phone')"
                    :is-solo="true"
                    v-model="phone"
                    :error-message="errors.phone"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('email') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('email')"
                    :is-solo="true"
                    v-model="email"
                    :error-message="errors.email"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('placeOfBirth') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('placeOfBirth')"
                    :is-solo="true"
                    v-model="place_of_birth"
                    :error-message="errors.place_of_birth"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('dateOfBirth') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <date-picker
                    density="compact"
                    :is-solo="true"
                    v-model="date_of_birth"
                    :error-message="errors.date_of_birth"
                    :label="t('dateOfBirth')"></date-picker>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('gender') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('gender')"
                    inputType="select"
                    v-model="gender"
                    :is-solo="true"
                    :error-message="errors.gender"
                    :selectOptions="genderOptions"
                    density="compact"></field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('martialStatus') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('martialStatus')"
                    inputType="select"
                    density="compact"
                    :is-solo="true"
                    v-model="martial_status"
                    :error-message="errors.martial_status"
                    :selectOptions="martialStatuses"></field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('bloodType') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('bloodType')"
                    :is-solo="true"
                    v-model="blood_type"
                    :error-message="errors.blood_type"
                    density="compact">
                    </field-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('religion') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <field-input
                    :label="t('religion')"
                    inputType="select"
                    v-model="religion"
                    :is-solo="true"
                    :error-message="errors.religion"
                    density="compact"
                    :selectOptions="religions"></field-input>
            </v-col>
        </v-row>

        <v-btn variant="flat" 
            color="secondary" 
            @click.prevent="cancelEdit"
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

<script setup>
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup'
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const emit = defineEmits(['close-event'])

const store = useEmployeesStore()

const { detailOfEmployee } = storeToRefs(store)

const { t } = useI18n()

const route = useRoute()

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: yup.object({
        date_of_birth: yup.string().required(t('dateOfBirthRequired')),
        place_of_birth: yup.string().required(t('placeOfBirthRequired')),
        gender: yup.string().required(t('genderRequired')),
        name: yup.string().required(t('nameRequired')),
        nickname: yup.string().required(t('nicknameRequired')),
        email: yup.string()
            .email()
            .required(t('emailRequired')),
        phone: yup.number()
            .transform((currentValue) => currentValue == "" ? undefined : currentValue)
            .required(t('phoneRequired'))
            .typeError(t('mustBeNumber')),
        martial_status: yup.string().required(t('martialStatusRequired')),
        blood_type: yup.string().nullable(),
        religion: yup.string().required(t('religionRequired')),
    }),
    initialValues: {
        date_of_birth: detailOfEmployee.value.data.data.date_of_birth,
        place_of_birth: detailOfEmployee.value.data.data.place_of_birth,
        gender: detailOfEmployee.value.data.data.gender,
        name: detailOfEmployee.value.data.data.name,
        nickname: detailOfEmployee.value.data.data.nickname,
        email: detailOfEmployee.value.data.data.email,
        phone: detailOfEmployee.value.data.data.phone,
        martial_status: detailOfEmployee.value.data.data.martial_status,
        blood_type: detailOfEmployee.value.data.data.blood_type,
        religion: detailOfEmployee.value.data.data.religion,
    }
})

const [date_of_birth] = defineField('date_of_birth')
const [place_of_birth] = defineField('place_of_birth')
const [gender] = defineField('gender')
const [name] = defineField('name')
const [nickname] = defineField('nickname')
const [email] = defineField('email')
const [phone] = defineField('phone')
const [martial_status] = defineField('martial_status')
const [blood_type] = defineField('blood_type')
const [religion] = defineField('religion')

const genderOptions = ref([
    {title: t('male'), value: 'male'},
    {title: t('female'), value: 'female'},
])

const martialStatuses = ref([
    {title: t('married'), value: 'married'},
    {title: t('single'), value: 'single'},
])

const religions = ref([
    {title: t('katholik'), value: 'katholik'},
    {title: t('islam'), value: 'islam'},
    {title: t('kristen'), value: 'kristen'},
    {title: t('budha'), value: 'budha'},
    {title: t('hindu'), value: 'hindu'},
    {title: t('khonghucu'), value: 'khonghucu'},
])

const loading = ref(false)

function cancelEdit() {
    emit('close-event')
}

const validateData = handleSubmit(async (values) => {
    loading.value = true
    await store.updateBasicInfo(values, route.params.id)
    loading.value = false

    emit('close-event')
})
</script>