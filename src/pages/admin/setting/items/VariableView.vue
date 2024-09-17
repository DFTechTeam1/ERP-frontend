<template>
    <v-card flat border>
        <v-card-text class="mt-3">
            <v-form @submit="submitForm">
                <template v-if="loadingPrepare">
                    <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                    <p class="text-center">
                        {{ $t('preparingData') }}
                    </p>
                </template>
                <template v-else>
                    <v-row>
                        <v-col
                            cols="12"
                            md="6">
                            <field-input
                                class="mb-3"
                                :label="t('definePositionAsVJ')"
                                v-model="position_as_visual_jokey"
                                :error-message="errors.position_as_visual_jokey"
                                :is-required="false"
                                input-type="select"
                                :select-options="positionList"
                                :is-multiple="true"></field-input>

                            <field-input
                                class="mb-3"
                                :label="t('definePositionAsDirector')"
                                v-model="position_as_directors"
                                :error-message="errors.position_as_directors"
                                :is-required="false"
                                input-type="select"
                                :select-options="positionList"
                                :is-multiple="true"></field-input>
    
                            <field-input
                                class="mb-3"
                                :label="t('definePositionAsMarketing')"
                                v-model="position_as_marketing"
                                :error-message="errors.position_as_marketing"
                                :is-required="false"
                                input-type="select"
                                :select-options="positionList"></field-input>
    
                            <field-input
                                class="mb-3"
                                :label="t('definePositionAsProduction')"
                                v-model="position_as_production"
                                :error-message="errors.position_as_production"
                                :is-required="false"
                                input-type="select"
                                :is-multiple="true"
                                :select-options="positionList"></field-input>
    
                            <field-input
                                class="mb-3"
                                :label="t('definePositionAsProjectManager')"
                                v-model="position_as_project_manager"
                                :error-message="errors.position_as_project_manager"
                                :is-required="false"
                                input-type="select"
                                :select-options="positionList"
                                :is-multiple="true"></field-input>
    
                            <field-input
                                class="mb-3"
                                :label="t('defineSpecialPositionInProduction')"
                                v-model="special_production_position"
                                :error-message="errors.special_production_position"
                                :is-required="false"
                                input-type="select"
                                :select-options="positionList"></field-input>
    
                            <field-input
                                class="mb-3"
                                :label="t('howManyDaysRaiseDeadlineAlert')"
                                v-model="days_to_raise_deadline_alert"
                                :error-message="errors.days_to_raise_deadline_alert"
                                :is-required="false"
                                input-type="select"
                                :select-options="daysRaiseAlert"></field-input>
    
                            <v-btn
                                variant="flat"
                                color="primary"
                                type="submit">
                                {{ $t('save') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { onMounted, ref } from 'vue';
import { useSettingStore } from '@/stores/setting'
import { storeToRefs } from 'pinia';
import { usePositionStore } from '@/stores/position';

const { t } = useI18n()

const store = useSettingStore()

const loadingPrepare = ref(false)

const positionStore = usePositionStore()

const { globalVariableSetting } = storeToRefs(store)

const { defineField, errors, handleSubmit, setFieldValue } = useForm({
    validationSchema: yup.object({
        position_as_directors: yup.array().nullable(),
        position_as_visual_jokey: yup.array().nullable(),
        position_as_project_manager: yup.array().nullable(),
        position_as_production: yup.array().nullable(),
        position_as_marketing: yup.string().nullable(),
        special_production_position: yup.string().nullable(),
        days_to_raise_deadline_alert: yup.string().nullable(),
    })
})

const [position_as_directors] = defineField('position_as_directors')
const [position_as_visual_jokey] = defineField('position_as_visual_jokey')
const [position_as_project_manager] = defineField('position_as_project_manager')
const [position_as_marketing] = defineField('position_as_marketing')
const [days_to_raise_deadline_alert] = defineField('days_to_raise_deadline_alert')
const [special_production_position] = defineField('special_production_position')
const [position_as_production] = defineField('position_as_production')

const loading = ref(false)

const positionList = ref([])

const daysRaiseAlert = ref([
    {
        value: 1,
        title: t('oneDay'),
    },
    {
        value: 2,
        title: t('twoDay'),
    },
    {
        value: 3,
        title: t('threeDay'),
    },
    {
        value: 4,
        title: t('fourDay'),
    },
    {
        value: 5,
        title: t('fiveDay'),
    },
])

const submitForm = handleSubmit(async (values) => {
    loading.value = true;
    const resp = await store.storeSetting(values, 'variables');
    loading.value = false;
    
    if (resp.status < 300) {
        initSetting();
    }
})

async function initSetting() {
    globalVariableSetting.value.forEach((elem) => {
        if (elem.key == 'position_as_directors') {
            setFieldValue('position_as_directors', elem.value)
        } else if (elem.key == 'position_as_marketing') {
            setFieldValue('position_as_marketing', elem.value)
        } else if (elem.key == 'position_as_project_manager') {
            setFieldValue('position_as_project_manager', elem.value)
        } else if (elem.key == 'days_to_raise_deadline_alert') {
            setFieldValue('days_to_raise_deadline_alert', elem.value)
        } else if (elem.key == 'special_production_position') {
            setFieldValue('special_production_position', elem.value)
        } else if (elem.key == 'position_as_production') {
            setFieldValue('position_as_production', elem.value)
        } else if (elem.key == 'position_as_visual_jokey') {
            setFieldValue('position_as_visual_jokey', elem.value)
        }
    })
}

async function initPosition() {
    const resp = await positionStore.getAll()

    if (resp.status < 300) {
        positionList.value = resp.data.data
    }
}

async function prepareData() {
    loadingPrepare.value = true
    await Promise.all([
        initPosition(),
        initSetting()
    ])

    loadingPrepare.value = false
}

onMounted(() => {
    console.log('globalVariableSetting', globalVariableSetting.value);

    prepareData()
})
</script>