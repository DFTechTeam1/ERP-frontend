<script setup>
import { useRegionStore } from '@/stores/region';
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const { defineField, errors, setFieldValue } = useForm({
    validationSchema: yup.object({
        country_id: yup.string().nullable(),
        state_id: yup.string().nullable(),
        city_id: yup.string().nullable(),
        name: yup.string().required(t("nameRequired"))
    })
});

const [country_id] = defineField('country_id');
const [state_id] = defineField('state_id');
const [city_id] = defineField('city_id');
const [name] = defineField('name');

const regionStore = useRegionStore();

const show = ref(false);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
});

const loading = ref(false);

const countries = ref([]);

const states = ref([]);

const cities = ref([]);

watch(props, (values) => {
    show.value = values.isShow;

    if (values.isShow) {
        initCountries();
    }
});

watch(country_id, (values) => {
    console.log('values', values);
    if (values) {
        initStates(values);
    };
});

watch(state_id, (values) => {
    if (values) {
        initCities(values);
    };
});

async function initCountries() {
    loading.value = true;
    const resp = await regionStore.initCountries()
    loading.value = false;

    if (resp.status < 300) {
        countries.value = resp.data.data
    } else {
        countries.value = []
    }
}

async function initStates(countryCode) {
    setFieldValue('state_id', null)
    const resp = await regionStore.initStates(countryCode)

    if (resp.status < 300) {
        states.value = resp.data.data
    } else {
        states.value = []
    }
}

async function initCities(stateId) {
    setFieldValue('city_id', null)

    const resp = await regionStore.initCities(stateId)

    if (resp.status < 300) {
        cities.value = resp.data.data
    } else {
        cities.value = []
    }
}
</script>

<template>
    <v-dialog v-model="show"
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <span>Create Price Guide</span>

                    <v-icon :icon="mdiClose"
                        size="18"
                        color="red"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <div v-if="loading">
                    <v-skeleton-loader type="list-item"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item"></v-skeleton-loader>
                    <v-skeleton-loader type="list-item"></v-skeleton-loader>
                    <v-skeleton-loader type="actions"></v-skeleton-loader>
                </div>
                <v-form v-else>
                    <field-input 
                        input-type="text"
                        :label="t('name')"
                        v-model="name"
                        class="mb-2"
                        :error-message="errors.name"
                        density="compact" />

                    <field-input
                        input-type="select"
                        :select-options="countries"
                        density="compact"
                        :is-required="false"
                        class="mb-2"
                        v-model="country_id"
                        :error-message="errors.country_id"
                        :label="t('country')" />

                    <field-input
                        input-type="select"
                        :select-options="states"
                        density="compact"
                        class="mb-2"
                        :is-required="false"
                        :error-message="errors.state_id"
                        v-model="state_id"
                        :label="t('state')" />

                    <field-input
                        input-type="select"
                        :select-options="cities"
                        density="compact"
                        :is-required="false"
                        v-model="city_id"
                        :error-message="errors.city_id"
                        :label="t('city')" />

                    <div class="d-flex align-center justify-end w-100">
                        <v-btn variant="flat" color="primary" type="submit" class="mt-2">
                                {{ $t('save') }}
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>