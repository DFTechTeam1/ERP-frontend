<script setup>
import { useForm } from 'vee-validate';
import LedDetailForm from '../components/LedDetailForm.vue';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { onMounted, watch } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useEmployeesStore } from '@/stores/employees';
import { useProjectClassStore } from '@/stores/projectClass';
import { useRegionStore } from '@/stores/region';
import { mdiPlus } from '@mdi/js';
import CustomerForm from '../customers/CustomerForm.vue';
import { useCustomerStore } from '@/stores/customer';

const { t } = useI18n();

const emit = defineEmits(['next-event']);

const store = useProjectStore();

const customerStore = useCustomerStore();

const employeeStore = useEmployeesStore();

const storeProjectClass = useProjectClassStore();

const regionStore = useRegionStore();

const { defineField, errors, setFieldValue, handleSubmit, values } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        client_portal: yup.string().required(t('clientPortalRequired')),
        project_date: yup.string().required(t('projectDateRequired')),
        event_type: yup.string().required(t('eventTypeRequired')),
        country_id: yup.string().required(t('countryRequired')),
        state_id: yup.string().required(t('stateRequired')),
        city_id: yup.string().required(t('cityRequired')),
        venue: yup.string().required(t('venueRequired')),
        project_class_id: yup.string().required(t('classRequired')),
        collaboration: yup.string().nullable(),
        led_area: yup.string().nullable(),
        marketing_id: yup.array().required(t('marketingRequired')),
        note: yup.string().nullable()
    })
});

const [name]= defineField('name');
const [client_portal]= defineField('client_portal');
const [project_date]= defineField('project_date');
const [event_type]= defineField('event_type');
const [country_id]= defineField('country_id');
const [state_id]= defineField('state_id');
const [city_id]= defineField('city_id');
const [venue]= defineField('venue');
const [collaboration]= defineField('collaboration');
const [project_class_id]= defineField('project_class_id');
const [led_area]= defineField('led_area');
const [marketing_id]= defineField('marketing_id');
const [note]= defineField('note');

const userRole = ref(null);
const description_quill = ref(null);

const eventTypeList = ref([]);
const countries = ref([]);
const venueList = ref([]);
const cities = ref([]);
const states = ref([]);
const classList = ref([]);
const marketingList = ref([]);
const customerList = ref([]);

const loading = ref(false);

const showCustomerForm = ref(false);

function chooseVenue(selectedVenue) {
    setFieldValue('venue', selectedVenue.title);
}

function updateLedArea(total) {
  setFieldValue('led_area', total);
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        setFieldValue('note', description_quill.value.getHTML())
    } else {
        setFieldValue('note', null)
    }
}

async function initEventType() {
    const resp = await store.initEventTypes();

    if (resp.status < 300) {
        eventTypeList.value = resp.data.data;
    }
}

async function initClassList() {
    const resp = await storeProjectClass.getAll();

    if (resp.status < 300) {
        classList.value = resp.data.data.map((elem) => {
            return {
                title: elem.name,
                value: elem.id,
            }
        });
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

async function initMarketing() {
    const resp = await store.getProjectMarketings()

    if (resp.status < 300) {
        marketingList.value = resp.data.data.map((elem) => {
            if (elem.selected) {
                setFieldValue('marketing_id', [elem.uid])
            }

            return {
                title: elem.name,
                value: elem.uid,
            }
        })
    }
}

async function getCustomer() {
    const resp = await customerStore.getCustomer();
    if (resp.status < 300) {
        customerList.value = resp.data.data;
    }
}

const validateData = handleSubmit(async (values) => {
    emit('next-event');
});

const getValues = () => {
    return values;
}

const prepareData = async() => {
    loading.value = true;
    await Promise.all([
        initEventType(),
        initClassList(),
        initMarketing(),
        initCountries(),
        getCustomer()
    ]);
    loading.value = false;
}

const addMoreCustomer = () => {
    showCustomerForm.value = true;
};

const closeCustomerForm = (isRefresh) => {
    showCustomerForm.value = false;

    if (isRefresh) {
        getCustomer();
    }
}

onMounted(() => {
    prepareData();
});

watch(country_id, (values) => {
    initStates(values || 0)
});

watch(state_id, (values) => {
    initCities(values || 0)
});

defineExpose({
    getValues
});
</script>

<template>
    <div>
        <!-- skeleton -->
        <v-row v-if="loading">
            <v-col cols="12" md="6">
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
            </v-col>
            <v-col cols="12" md="6">
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
                <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
            </v-col>
        </v-row>

        <form @submit="validateData" v-else>
            <v-row>
                <v-col cols="12" md="6">
                    <CustomerForm :is-show="showCustomerForm" @close-event="closeCustomerForm" />

                    <v-autocomplete
                        :items="customerList"
                        clearable
                        class="custom-input"
                        autocomplete="off"
                        variant="outlined"
                        label="Customer">
                        <template v-slot:append-item>
                            <div class="add-button-container">
                                <v-list-item @click="addMoreCustomer" class="add-button">
                                    <template v-slot:prepend>
                                        <v-icon :icon="mdiPlus"></v-icon>
                                    </template>

                                    <template v-slot:title>
                                        Add Customer
                                    </template>
                                </v-list-item>
                            </div>
                        </template>
                    </v-autocomplete>

                    <field-input :label="t('name')"
                        custom-class="custom-input"
                        class="mt-8"
                        :error-message="errors.name"
                        v-model="name"></field-input>
        
                    <date-picker :label="t('eventDate')" v-model="project_date"
                        class="mt-8"
                        custom-class="custom-input"
                        :error-message="errors.project_date"></date-picker>
        
                    <field-input :label="t('country')" v-model="country_id"
                        class="mt-8"
                        custom-class="custom-input"
                        :error-message="errors.country_id" input-type="select"
                        :select-options="countries"></field-input>
        
                    <field-input :label="t('city')" v-model="city_id"
                        :error-message="errors.city_id" input-type="select"
                        class="mt-8"
                        custom-class="custom-input"
                        :select-options="cities"></field-input>
        
                    <field-input :label="t('collaboration')" :is-required="false" v-model="collaboration"
                        class="mt-8"
                        custom-class="custom-input"
                        :error-message="errors.collaboration"></field-input>
        
                    <field-input :is-readonly="true" :suffix-text="'m<sup>2</sup>'" :label="t('totalLedArea')"
                        class="mt-8"
                        :error-message="errors.led_area" v-model="led_area"></field-input>
        
                    <LedDetailForm
                        @update-led-event="updateLedArea"
                        ref="ledFormComponent"></LedDetailForm>
                </v-col>
        
                <v-col cols="12" md="6">
                    <field-input :label="t('clientPortal')"
                        custom-class="custom-input"
                        :error-message="errors.client_portal"
                        v-model="client_portal"></field-input>
        
                    <field-input :label="t('eventType')" inputType="select" :select-options="eventTypeList"
                        class="mt-8"
                        custom-class="custom-input"
                        v-model="event_type" :error-message="errors.event_type"></field-input>
        
                    <field-input :label="t('state')" inputType="select" :select-options="states"
                        class="mt-8"
                        custom-class="custom-input"
                        v-model="state_id" :error-message="errors.state_id"></field-input>
        
                    <field-input :label="t('venue')" id="menu-activator" v-model="venue"
                        class="mt-8"
                        custom-class="custom-input"
                        :error-message="errors.venue"></field-input>
        
                    <!-- venue autocomplete -->
                    <v-menu activator="#menu-activator">
                        <v-list>
                            <template v-if="venueList.length">
                                <v-list-item v-for="(list, index) in venueList" :key="index" :value="index"
                                    @keyup.enter="chooseVenue(list)">
                                    <v-list-item-title
                                        class="cursor"
                                        @click.prevent="chooseVenue(list)"
                                        @keyup.enter="chooseVenue(list)">{{ list.title }}</v-list-item-title>
                                </v-list-item>
                            </template>
                            <template v-else>
                                <v-list-item>
                                    <v-list-item-title>{{ $t('venueNotFound') }}</v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-menu>
        
                    <field-input :label="t('eventClass')" inputType="select" :select-options="classList"
                        class="mt-8"
                        custom-class="custom-input"
                        v-model="project_class_id" :error-message="errors.project_class_id"></field-input>
        
                    <field-input v-model="marketing_id" :error-message="errors.marketing_id"
                        :label="t('marketing')" input-type="select" v-if="userRole != 'marketing'"
                        :is-multiple="true"
                        class="mt-8"
                        :select-options="marketingList"></field-input>
        
                    <v-label :text="t('note')" class="mb-3"></v-label>
                    <QuillEditor
                        class="quill-note"
                        theme="snow"
                        ref="description_quill"
                        @update:content="updateDescription" />
                    <div v-if="errors.note" class="invalid-feedback">{{ errors.note }}</div>
                </v-col>
            </v-row>
        
            <v-stepper-actions>
                <template v-slot:next>
                    <v-btn color="primary" variant="flat" type="submit">Next</v-btn>
                </template>

                <template v-slot:prev>
                    <v-btn color="#FAFAFA" variant="flat" @click.prevent="$emit('back-event')">Previous</v-btn>
                </template>
            </v-stepper-actions>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.add-button-container {
  position: sticky;
  bottom: 0;
  background: white; /* Match light theme */
  z-index: 1;
  border-top: 1px solid #e0e0e0; /* subtle separator */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05); /* soft shadow */
}

.add-button {
  cursor: pointer;
  background: rgba(245, 245, 245, 0.9); /* slight gray tint */
  transition: background 0.2s;
}

.add-button:hover {
  background: #eeeeee; /* lighter hover */
}

/* Optional: Match Vuetify's theme colors */
.add-button .v-icon, .add-button span {
  color: var(--v-primary-base); /* uses your theme's primary color */
}
</style>