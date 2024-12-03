<template>
    <v-dialog
        v-model="dialog"
        max-width="600">
        <v-card>
            <v-card-item>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between">
                        {{ $t('editProject') }}
                        <v-icon
                            :icon="mdiClose"
                            class="cursor-pointer"
                            @click.prevent="$emit('close-form')"></v-icon>
                    </div>
                </v-card-title>

                <v-card-text class="mt-5">
                    <v-form @submit="validateData">
                        <template v-if="loadingPrepareData">
                            <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                            <div class="text-center">
                                <p>{{ $t('preparingData') }}</p>
                            </div>
                        </template>

                        <template v-else>
                            <field-input
                                class="mb-3"
                                :label="t('country')"
                                v-model="country_id"
                                :error-message="errors.country_id"
                                input-type="select"
                                :select-options="countries"></field-input>

                            <field-input
                                class="mb-3"
                                :label="t('state')"
                                v-model="state_id"
                                :error-message="errors.state_id"
                                input-type="select"
                                :select-options="states"></field-input>

                            <field-input
                                class="mb-3"
                                :label="t('city')"
                                v-model="city_id"
                                :error-message="errors.city_id"
                                input-type="select"
                                :select-options="cities"></field-input>

                            <field-input
                                class="mb-3"
                                :label="t('venue')"
                                v-model="venue"
                                :error-message="errors.venue"></field-input>
                            <field-input
                                class="mb-3"
                                :label="t('eventType')"
                                v-model="event_type"
                                input-type="select"
                                :select-options="eventTypeList"
                                :error-message="errors.event_type"></field-input>
                            <field-input
                                class="mb-3"
                                :label="t('collaboration')"
                                v-model="collaboration"
                                :error-message="errors.collaboration"
                                :is-required="false"></field-input>
                            <field-input
                                class="mb-3"
                                :label="t('status')"
                                v-model="status"
                                input-type="select"
                                :is-required="false"
                                :select-options="projectStatus"
                                :error-message="errors.status"></field-input>
                            <field-input
                                class="mb-3"
                                :label="t('note')"
                                v-model="note"
                                :error-message="errors.note"
                                :is-required="false"></field-input>
                            <field-input
                                class="mb-3"
                                :label="t('clientPortal')"
                                v-model="client_portal"
                                :error-message="errors.client_portal"></field-input>

                            <field-input
                              :is-readonly="true"
                              :is-required="false"
                              :suffix-text="'m<sup>2</sup>'"
                              :label="t('totalLedArea')"
                              :error-message="errors.led_area"
                              class="mb-3"
                              v-model="led_area"></field-input>

                            <LedDetailForm
                              @update-led-event="updateLedArea"
                              class="mb=3"
                              ref="ledFormComponent"
                              :data="detailProject.led_detail"></LedDetailForm>

                            <v-btn
                                varian="outlined"
                                :disabled="loading"
                                color="primary"
                                class="mt-3"
                                type="submit">
                                <template v-if="loading">{{ $t('processing') }}</template>
                                <template v-else>{{ $t('save') }}</template>
                            </v-btn>
                        </template>
                    </v-form>
                </v-card-text>
            </v-card-item>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useEmployeesStore } from '@/stores/employees';
import { useGetRole } from '@/compose/getRole';
import { useRegionStore } from '@/stores/region';
import LedDetailForm from '@/pages/admin/production/components/LedDetailForm.vue'

const store = useProjectStore();
const { detailProject } = storeToRefs(store);

const employeeStore = useEmployeesStore();

const regionStore = useRegionStore()

const { t } = useI18n();

const emit = defineEmits(['close-form'])

const ledFormComponent = ref(null);

const { handleSubmit, defineField, errors, setValues, setFieldValue } = useForm({
    validationSchema: yup.object({
        venue: yup.string().required(),
        country_id: yup.string().required(t('countryRequired')),
        state_id: yup.string().required(t('stateRequired')),
        city_id: yup.string().required(t('cityRequired')),
        event_type: yup.string().required(),
        collaboration: yup.string().nullable(),
        status: yup.string().nullable(),
        note: yup.string().nullable(),
        client_portal: yup.string().required(),
        led_area: yup.string().nullable(),
    }),
    initialValues: {
        venue: detailProject.value.venue,
        event_type: detailProject.value.event_type_raw,
        collaboration: detailProject.value.collaboration,
        status: detailProject.value.status_raw,
        note: detailProject.value.note,
        client_portal: detailProject.value.client_portal,
        country_id: detailProject.value.country_id,
        state_id: detailProject.value.state_id,
        city_id: detailProject.value.city_id,
        led_area: detailProject.value.led_area
    }
})

const [venue] = defineField('venue')
const [led_area] = defineField('led_area');
const [country_id] = defineField('country_id')
const [state_id] = defineField('state_id')
const [city_id] = defineField('city_id')
const [event_type] = defineField('event_type')
const [collaboration] = defineField('collaboration')
const [status] = defineField('status')
const [note] = defineField('note')
const [client_portal] = defineField('client_portal')

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
})

const dialog = ref(false);

const loading = ref(false);

const eventTypeList = ref([]);

const projectStatus = ref([]);

const countries = ref([]);

const states = ref([]);

const cities = ref([]);

const loadingPrepareData = ref(false)

const projectManagerList = ref([]);

const validateData = handleSubmit(async (values) => {
    // call the child function to get updated led setting
    values.led_detail = ledFormComponent.value.getValue();

    loading.value = true;
    const resp = await store.editMoreDetail(values, detailProject.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        emit('close-form');
    }
})

function updateLedArea(total) {
  setFieldValue('led_area', total);
}

async function initEventType() {
    const resp = await store.initEventTypes();

    if (resp.status < 300) {
        eventTypeList.value = resp.data.data;
    }
}

async function initProjectStatus() {
    const resp = await store.initProjectStatus();

    if (resp.status < 300) {
        projectStatus.value = resp.data.data;
    }
}

async function initCountries() {
    const resp = await regionStore.initCountries()

    if (resp.status < 300) {
        countries.value = resp.data.data
    } else {
        countries.value = []
    }
}

async function initStates(countryCode) {
    setFieldValue('state_id', detailProject.value ? detailProject.value.state_id : null)
    const resp = await regionStore.initStates(countryCode)

    if (resp.status < 300) {
        states.value = resp.data.data
    } else {
        states.value = []
    }
}

async function initCities(stateId) {
    setFieldValue('city_id', detailProject.value ? detailProject.value.city_id : null)

    const resp = await regionStore.initCities(stateId)

    if (resp.status < 300) {
        cities.value = resp.data.data
    } else {
        cities.value = []
    }
}

async function prepareData() {
    loadingPrepareData.value = true
    await Promise.all([
        initEventType(),
        initProjectStatus(),
        initCountries(),
        initStates(detailProject.value.country_id),
        initCities(detailProject.value.state_id)
    ])

    loadingPrepareData.value = false
}

watch(props, (values) => {
    if (values) {
        dialog.value = values.isOpen
    }

    if (values.isOpen) {
        prepareData()
    }
})

watch(detailProject, (values) => {
    if (values) {
        setValues({
            venue: values.venue,
            event_type: values.event_type_raw,
            collaboration: values.collaboration,
            status: values.status_raw,
            note: values.note,
            client_portal: values.client_portal,
        })
    }
})

watch(country_id, (values) => {
    initStates(values || 0)
})

watch(state_id, (values) => {
    initCities(values || 0)
})
</script>
