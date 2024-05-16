<template>
    <div>
        <v-form>
            <v-row>
                <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    class="pt-4">
                    <field-input
                        :label="t('education')"
                        v-model="education"
                        inputType="select"
                        :selectOptions="educationLevels"
                        :error-message="errors['educations.education']"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    class="pt-4">
                    <field-input
                        :label="t('educationName')"
                        v-model="education_name"
                        :error-message="errors['educations.education_name']"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    class="pt-4">
                    <field-input
                        :label="t('educationMajor')"
                        v-model="education_major"
                        :error-message="errors['educations.education_major']"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    class="pt-4">
                    <year-picker
                        :label="t('graduationYear')"
                        v-model="graduation_year"
                        :error-message="errors['educations.graduation_year']"></year-picker>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<style>
.education-item {
    background: #f4f4f4;
    border-radius: 8px;
    padding: 14px 14px 8px 14px;
}
</style>

<script setup>
import { useForm, useValidateForm } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useEmployeesStore } from '@/stores/employees';
import { onMounted } from 'vue';

const store = useEmployeesStore();

const { t } = useI18n();

const props = defineProps({
    detailData : {
        default: null,
    },
});

const { errors, defineField, values, setValues } = useForm({
    validationSchema: yup.object({
        educations: yup.object().shape({
            education: yup.string().required(t('educationRequired')),
            education_name: yup.string().required(t('educationNameRequired')),
            education_major: yup.string().required(t('educationMajorRequired')),
            graduation_year: yup.string().required(t('graduationYearRequired')),
        }),
    }),
})

const [education] = defineField('educations.education');
const [education_name] = defineField('educations.education_name');
const [education_major] = defineField('educations.education_major');
const [graduation_year] = defineField('educations.graduation_year');

const educationLevels = ref([
    {title: 'SMP', value: 'smp'},
    {title: 'SMA', value: 'sma'},
    {title: 'Diploma', value: 'diploma'},
    {title: 'S1', value: 's1'},
    {title: 'S2', value: 's2'},
    {title: 'S3', value: 's3'},
]);

const validate = useValidateForm();

const storeEducation = () => {
    store.storeEducation(values);
}

defineExpose({
    validate,
    storeEducation,
});

onMounted(() => {
    console.log('mounted education', props.detailData);
    if (props.detailData) {
        setValues({
            educations: {
                education: props.detailData.education,
                education_name: props.detailData.education_name,
                education_major: props.detailData.education_major,
                graduation_year: props.detailData.education_year,
            }
        });
    }
})
</script>