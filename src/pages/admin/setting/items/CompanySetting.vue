<script setup>
import { useSettingStore } from '@/stores/setting';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const { defineField, handleSubmit, setFieldValue } = useForm({
    validationSchema: yup.object({
        company_name: yup.string().nullable(),
        company_email: yup.string().nullable(),
        company_phone: yup.string().nullable(),
        company_address: yup.string().nullable(),
    })
});

const [company_name] = defineField('company_name');
const [company_email] = defineField('company_email');
const [company_phone] = defineField('company_phone');
const [company_address] = defineField('company_address');

const store = useSettingStore();

const { globalCompanySetting } = storeToRefs(store);

const loading = ref(false);

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    const resp = await store.storeSetting(values, 'company');
    loading.value = false;

    if (resp.status < 300) {
        initCompanySetting();
    }
});

const initCompanySetting = () => {
    console.log('globalCompanySetting', globalCompanySetting.value);

    if (globalCompanySetting.value) {
        globalCompanySetting.value.forEach((value) => {
            setFieldValue(value.key, value.value);
        })
    }
};

watch(globalCompanySetting, () => {
    initCompanySetting();
})
</script>

<template>
    <v-card flat border>
        <v-card-text>
            <v-form class="px-10 mt-5" @submit="validateData">
                <div class="d-flex w-100 mb-5">
                    <label for="company-name" class="w-100 align-content-center">{{ $t("companyName") }}</label>
    
                    <field-input
                        :label="t('companyName')"
                        :is-solo="true"
                        class="w-100"
                        v-model="company_name"
                        density="compact"
                        customClass="custom-input"
                        :is-required="false"></field-input>
                </div>
                <div class="d-flex w-100 mb-5">
                    <label for="company-name" class="w-100 align-content-center">{{ $t("companyPhone") }}</label>
    
                    <field-input
                        :label="t('companyPhone')"
                        :is-solo="true"
                        v-model="company_phone"
                        class="w-100"
                        density="compact"
                        customClass="custom-input"
                        :is-required="false"></field-input>
                </div>
                <div class="d-flex w-100 mb-5">
                    <label for="company-name" class="w-100 align-content-center">{{ $t("companyEmail") }}</label>
    
                    <field-input
                        :label="t('companyEmail')"
                        :is-solo="true"
                        v-model="company_email"
                        class="w-100"
                        density="compact"
                        customClass="custom-input"
                        :is-required="false"></field-input>
                </div>
                <div class="d-flex w-100 mb-5">
                    <label for="company-name" class="w-100 align-content-center">{{ $t("companyAddress") }}</label>
    
                    <field-input
                        :label="t('companyAddress')"
                        :is-solo="true"
                        class="w-100"
                        density="compact"
                        v-model="company_address"
                        customClass="custom-input"
                        input-type="textarea"
                        :is-required="false"></field-input>
                </div>

                <div class="d-flex align-center justify-end">
                    <v-btn variant="flat" color="primary" type="submit" :disabled="loading">Submit</v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>