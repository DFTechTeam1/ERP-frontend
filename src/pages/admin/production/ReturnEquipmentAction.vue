<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('action') }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <v-label>{{ $t('equipmentCondition') }}</v-label>
                    <field-input
                        input-type="switch"
                        :label="t('goodCondition')"
                        v-model="condition"
                        :error-message="errors.condition"></field-input>

                    <field-input
                        v-if="condition == 'false' || !condition"
                        :label="t('detailCondition')"
                        v-model="detail_condition"
                        :error-message="errors.detail_condition"
                        class="mb-3"></field-input>

                    <v-btn
                        class="w-100"
                        variant="flat"
                        color="primary"
                        type="submit"
                        :disabled="loading">
                        <template v-if="loading">
                            {{ $t('processing') }}
                        </template>
                        <template v-else>
                            {{ $t('submit') }}
                        </template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup'

const { t } = useI18n()

const emit = defineEmits(['close-event'])

const store = useProjectStore()

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    equipment: {
        type: Object,
    },
    projectUid: {
        type: String,
        default: '',
    }
})

const { defineField, errors, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema: yup.object({
        condition: yup.string().required(),
        detail_condition: yup.string().when('condition', {
            is: (value) => value == 'false' ? true : false,
            then: function () {
                return yup.string().required(t('detailConditionRequired'));
            },
            otherwise: function () {
                return yup.string().nullable();
            }
        }),
    }),
    initialValues: {
        condition: '1'
    }
})

const [condition] = defineField('condition')
const [detail_condition] = defineField('detail_condition')

const show = ref(false)

const loading = ref(false)

watch((props), (values) => {
    if (values) {
        show.value = values.isShow
    }

    if (values.isShow) {
        if ((values.equipment) && (values.equipment.returnCondition)) {
            setFieldValue('condition', values.equipment.returnCondition.is_good_condition ? '1' : 'false')
            setFieldValue('detail_condition', values.equipment.returnCondition.detail_condition)
        }
    }
})

const validateData = handleSubmit((values) => {
    store.takeActionReturnEquipment(values, props.equipment)
    resetForm()

    setFieldValue('condition', '1');

    emit('close-event', true)
})
</script> 