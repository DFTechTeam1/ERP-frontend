<script setup>
import { useSettingStore } from '@/stores/setting';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch, computed } from 'vue';
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
const logo = ref(null);

const pond = ref(null);

const description_quill = ref(null);

const store = useSettingStore();

const { globalCompanySetting } = storeToRefs(store);

const loading = ref(false);

const description = ref(null);

const validateData = handleSubmit(async (values) => {
    let formData = new FormData();
    formData.append('company_name', values.company_name);
    formData.append('company_phone', values.company_phone);
    formData.append('company_email', values.company_email);
    formData.append('company_address', values.company_address);
    formData.append('company_logo', logo.value);
    formData.append('quotation_rules', description.value);
    
    loading.value = true;
    const resp = await store.storeSetting(formData, 'company');
    loading.value = false;

    if (resp.status < 300) {
        initCompanySetting();
    }
});

const files = ref([]);

const initCompanySetting = () => {
    if (globalCompanySetting.value) {
        globalCompanySetting.value.forEach((value) => {
            setFieldValue(value.key, value.value);

            if (value.key == 'company_logo' && value.value) {
                files.value = [value.value];

                console.log('files', files.value);
            }

            if (value.key == 'quotation_rules' && value.value && description_quill.value) {
                description_quill.value.setHTML(value.value);
            }
        })
    }
};

watch(globalCompanySetting, () => {
    initCompanySetting();
});

function updateImages() {
    if (pond.value.getFiles().length) {
        var images = [];
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            images.push(pond.value.getFiles()[a].file)
        }
        logo.value = images[0]
    } else {
        logo.value = null;
    }
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        description.value = description_quill.value.getHTML();
    } else {
        description.value = null;
    }
}
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
                <div class="d-flex w-100 mb-5">
                    <label for="company-name" class="w-100 align-content-center">{{ $t("quotationRules") }}</label>
    
                    <div class="w-100">
                        <QuillEditor
                            class="quill-note w-100"
                            theme="snow"
                            ref="description_quill"
                            @update:content="updateDescription" />
                    </div>
                </div>
                <div class="d-flex w-100 mb-5">
                    <label for="company-name" class="w-100 align-content-center">{{ $t("companyLogo") }}</label>

                    <div class="w-100">
                        <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            :allow-multiple="false"
                            maxFileSize="35MB"
                            v-on:addfile="updateImages"
                            v-on:removefile="updateImages"
                            :files="files"
                            accepted-file-types="image/png, image/jpg, image/jpeg, image/webp"
                        ></file-pond-com>
                    </div>
                </div>
                
                <div class="d-flex align-center justify-end">
                    <v-btn variant="flat" color="primary" type="submit" :disabled="loading">Submit</v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>