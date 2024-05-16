<template>
    <div>
        <v-form>
            <div class="experience-wrapper">
                <div
                    class="experience-item"
                    v-for="(field, x) in fields"
                    :key="field.key"
                    :id="'row-experience-' + x">
                    <v-row>
                        <v-col
                            cols="12"
                            md="4"
                            lg="4">
                            <field-input
                                :label="t('workplaceName')"
                                v-model="field.value.workplace_name"
                                :error-message="errors[`experiences[${x}].workplace_name`]"></field-input>
                        </v-col>
                        <v-col
                            cols="12"
                            md="4"
                            lg="4">
                            <field-input
                                :label="t('resignYear')"
                                v-model="field.value.end_year"
                                :error-message="errors[`experiences[${x}].end_year`]"></field-input>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-form>
    </div>
</template>

<style scoped lang="scss">
.experience-item {
    padding: 8px 10px;
    background: #f4f4f4;
    border-radius: 8px;
}
</style>

<script setup>
import { useForm, useValidateForm, useFieldArray } from 'vee-validate';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const { values, errors } = useForm({
    validationSchema: yup.object({
        experiences: yup.array().of(
            yup.object().shape({
                workplace_name: yup.string().nullable(),
                end_year: yup.string()
                    .when('workplace_name', {
                        is: (value) => value.length > 0,
                        then: function () {
                            return yup.string().required()
                        },
                        otherwise: function () {
                            return yup.string().nullable()
                        },
                    }),
            }),
        ),
    }),
});

const { push, fields } = useFieldArray('experiences');

const validate = useValidateForm();

const getFormValues = () => {
    console.log('values', values);
}

defineExpose({
    validate,
    getFormValues,
});

onMounted(() => {
    push({workplace_name: '', exit_year: ''})
})
</script>