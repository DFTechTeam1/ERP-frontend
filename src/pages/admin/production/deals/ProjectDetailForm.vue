<script setup>
import { useForm } from 'vee-validate';
import LedDetailForm from '../components/LedDetailForm.vue';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { onMounted, watch, ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useEmployeesStore } from '@/stores/employees';
import { useProjectClassStore } from '@/stores/projectClass';
import { useRegionStore } from '@/stores/region';
import { mdiPlus } from '@mdi/js';
import CustomerForm from '../customers/CustomerForm.vue';
import { useCustomerStore } from '@/stores/customer';
import { useDateFormatter } from '@/compose/dateFormatter';
import { useProjectDealStore } from '@/stores/projectDeal';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useBreakToken } from '@/compose/breakToken';

const { t } = useI18n();

const emit = defineEmits(['next-event']);

const store = useProjectStore();

const route = useRoute();

const storeDeal = useProjectDealStore();

const customerStore = useCustomerStore();

const employeeStore = useEmployeesStore();

const storeProjectClass = useProjectClassStore();

const regionStore = useRegionStore();

const {
    detailOfProjectDeal
} = storeToRefs(storeDeal);

const {
    listOfEventTypes,
    listOfMarketings
} = storeToRefs(store);

const {
    listOfAllClasses
} = storeToRefs(storeProjectClass);

const {
    listOfWorldCountries,
    listOfWorldStates,
    listOfWorldCities
} = storeToRefs(regionStore);

const {
    listOfAllCustomer
} = storeToRefs(customerStore);

const { defineField, errors, setFieldValue, handleSubmit, values, setValues } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        client_portal: yup.string().required(t('clientPortalRequired')),
        project_date: yup.string().required(t('projectDateRequired')),
        customer_id: yup.string().required(t("customerRequired")),
        event_type: yup.string().required(t('eventTypeRequired')),
        venue: yup.string().required(t('venueRequired')),
        collaboration: yup.string().nullable(),
        note: yup.string().nullable(),
        led_area: yup.string().required(t('ledRequired')),
        led_detail: yup.array().nullable(),
        country_id: yup.string().required(t('countryRequired')),
        state_id: yup.string().required(t('stateRequired')),
        city_id: yup.string().required(t('cityRequired')),
        project_class_id: yup.string().required(t('classRequired')),
        longitude: yup.string().nullable(),
        latitude: yup.string().nullable(),

        city_name: yup.string().nullable(),
        marketing_id: yup.array().required(t('marketingRequired')),
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
const [led_detail] = defineField('led_detail');
const [collaboration]= defineField('collaboration');
const [customer_id]= defineField('customer_id');
const [project_class_id]= defineField('project_class_id');
const [led_area]= defineField('led_area');
const [marketing_id]= defineField('marketing_id');
const [note]= defineField('note');

const userRole = ref(null);
const description_quill = ref(null);

const country = ref(null);
const city = ref(null);

const venueList = ref([]);
const customerList = ref([]);
const customer = ref(null);
const marketingLists = ref([]);

const projectClass = ref(null);

const disableGeneralInformation = ref(route.params.type ? true : false);

const loading = ref(false);

const currentLedDetail = ref(null);

const showCustomerForm = ref(false);

function chooseVenue(selectedVenue) {
    setFieldValue('venue', selectedVenue.title);
}

function updateLedArea(params) {
    setFieldValue('led_area', params.total);

    setFieldValue('led_detail', params.detail);
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        setFieldValue('note', description_quill.value.getHTML())
    } else {
        setFieldValue('note', null)
    }
}

async function initStates(countryCode) {
    setFieldValue('state_id', null)
    await regionStore.initStates(countryCode);

    if (detailOfProjectDeal.value) {
        setFieldValue('state_id', detailOfProjectDeal.value.state_id);
    }
}

async function initCities(stateId) {
    setFieldValue('city_id', null)

    await regionStore.initCities(stateId);

    if (detailOfProjectDeal.value) {
        setFieldValue('city_id', detailOfProjectDeal.value.city_id);
    }
}

async function getCustomer() {
    const resp = await customerStore.getCustomer();
    if (resp.status < 300) {
        customerList.value = resp.data.data;
    }
}

const validateData = handleSubmit(async (values) => {
    console.log('values all', values);
    let selectedCustomer = listOfAllCustomer.value.filter((customer) => {
        return customer.value == values.customer_id;
    });
    let selectedCity = listOfWorldCities.value.filter((city) => {
        return city.value == values.city_id;
    });
    let selectedCountry = listOfWorldCountries.value.filter((country) => {
        return country.value == values.city_id;
    });
    let customerData = {
        name: selectedCustomer[0].title,
        place: selectedCity[0].title + ' ' + selectedCountry.title
    };
    
    let mainLed = [];
    let prefunc = [];
    values.led_detail.forEach((elem) => {
        elem.led.forEach((led) => {
            if (elem.name == 'main') {
                mainLed.push(led);
            } else {
                prefunc.push(led);
            }
        })
    });

    let selectedProjectClass = listOfAllClasses.value.filter((classData) => {
        return classData.value == values.project_class_id;
    });
    console.log('selectedProjectClass', selectedProjectClass);
    let event = {
        name: name.value,
        project_date: useDateFormatter(project_date.value),
        venue: venue.value,
        led: {
            main: mainLed,
            prefunction: prefunc
        },
        event_class: selectedProjectClass[0].title,
        price: 0,
        items: [],
    };

    // custom state for quotation
    store.setQuotationCustomer({customer: customerData});
    store.setQuotationEvent({event: event});

    emit('next-event');
});

const getValues = () => {
    // get city name
    let cityName = listOfWorldCities.value.filter((filter) => {
        return filter.value == city_id.value
    });
    cityName = cityName.length ? cityName[0].title : '';
    setFieldValue('city_name', cityName);

    return values;
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

watch(country_id, (values) => {
    initStates(values || 0)
});

watch(state_id, (values) => {
    initCities(values || 0)
});

watch(projectClass, (values) => {
    if (values) {
        setFieldValue('project_class_id', values.value);
    } else {
        setFieldValue('project_class_id', '');
    }
})

watch(customer, (values) => {
    if(values) {
        setFieldValue('customer_id', values.value);
    }
})

watch(name, (values) => {
    if (values.length) {
        var portal = values
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "")
            .toLowerCase();

        setFieldValue('client_portal', portal);
    } else {
        setFieldValue('client_portal', '');
    }
})

// set payload for that used to send to backend
const getPayload = () => {
    let payload = {
        name: name.value,
        project_date: project_date.value,
        customer_id: customer_id.value,
        event_type: event_type.value,
        venue: venue.value,
        collaboration: collaboration.value,
        note: note.value == undefined ? null : note.value,
        led_area: led_area.value,
        led_detail: led_detail.value,
        country_id: country_id.value,
        state_id: state_id.value,
        city_id: city_id.value,
        project_class_id: project_class_id.value,
        longitude: null,
        latitude: null,
        client_portal: client_portal.value,
        marketing_id: marketing_id.value
    };

    return payload;
};

defineExpose({
    getValues,
    getPayload
});

onMounted(() => {
    if (Object.keys(detailOfProjectDeal.value).length) {
        console.log('detailOfProjectDeal', detailOfProjectDeal.value);
        setValues({
            name: detailOfProjectDeal.value.name,
            customer_id: detailOfProjectDeal.value.customer_id,
            event_type: detailOfProjectDeal.value.event_type,
            country_id: detailOfProjectDeal.value.country_id,
            venue: detailOfProjectDeal.value.venue,
            project_date: detailOfProjectDeal.value.project_date,
            project_class_id: detailOfProjectDeal.value.project_class_id,
            collaboration: detailOfProjectDeal.value.collaboration,
            note: detailOfProjectDeal.value.note,
            led_area: detailOfProjectDeal.value.led_area,
            led_detail: detailOfProjectDeal.value.led_detail,
        });
        
        currentLedDetail.value = detailOfProjectDeal.value.led_detail;

        let marketingIds = detailOfProjectDeal.value.marketings.map((marketing) => {
            return marketing.employee.uid;
        });
        setFieldValue('marketing_id', marketingIds);

        // set quotation number manually
        if (route.params.id && !route.params.type) store.setQuotationNumber({number: detailOfProjectDeal.value.latest_quotation.quotation_id});
    } else {
        const user = useBreakToken('user');

        let searchMarketing = listOfMarketings.value.filter((filter) => {
            return filter.uid == user.employee.uid;
        });
        if (searchMarketing.length) {
            setFieldValue('marketing_id', [user.employee.uid]);
        }
    }
})
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
                        :items="listOfAllCustomer"
                        clearable
                        v-model="customer_id"
                        class="custom-input"
                        autocomplete="off"
                        variant="outlined"
                        :disabled="disableGeneralInformation"
                        label="Customer"
                        item-value="value">
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
                </v-col>

                <v-col cols="12" md="6">
                    <field-input :label="t('name')"
                        custom-class="custom-input"
                        :error-message="errors.name"
                        :is-disabled="disableGeneralInformation"
                        v-model="name"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <field-input :label="t('clientPortal')"
                        custom-class="custom-input"
                        :error-message="errors.client_portal"
                        :is-disabled="disableGeneralInformation"
                        v-model="client_portal"></field-input>
                </v-col>

                <v-col cols="12" md="6">
                    <field-input :label="t('eventType')" inputType="select" :select-options="listOfEventTypes"
                        custom-class="custom-input"
                        :is-disabled="disableGeneralInformation"
                        v-model="event_type" :error-message="errors.event_type"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <field-input :label="t('country')" v-model="country_id"
                        custom-class="custom-input"
                        :is-disabled="disableGeneralInformation"
                        item-value="value"
                        :error-message="errors.country_id" input-type="select"
                        :select-options="listOfWorldCountries"></field-input>
                </v-col>

                <v-col cols="12" md="6">
                    <field-input :label="t('state')"
                        inputType="select"
                        item-value="value"
                        :select-options="listOfWorldStates"
                        :is-disabled="disableGeneralInformation"
                        custom-class="custom-input"
                        v-model="state_id" :error-message="errors.state_id"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <field-input :label="t('city')" v-model="city_id"
                        :error-message="errors.city_id" input-type="select"
                        custom-class="custom-input"
                        item-value="value"
                        :is-disabled="disableGeneralInformation"
                        :select-options="listOfWorldCities"></field-input>
                </v-col>

                <v-col cols="12" md="6">
                    <field-input :label="t('venue')" id="menu-activator" v-model="venue"
                        custom-class="custom-input"
                        :is-disabled="disableGeneralInformation"
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
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <date-picker :label="t('eventDate')"
                        v-model="project_date"
                        format-output="YYYY-MM-DD"
                        custom-class="custom-input"
                        :is-disabled="disableGeneralInformation"
                        :error-message="errors.project_date"></date-picker>
                </v-col>

                <v-col cols="12" md="6">
                    <field-input :label="t('eventClass')"
                        inputType="select"
                        :select-options="listOfAllClasses"
                        custom-class="custom-input"
                        input-value="value"
                        :is-disabled="disableGeneralInformation"
                        v-model="project_class_id" :error-message="errors.project_class_id"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <field-input :label="t('collaboration')" :is-required="false" v-model="collaboration"
                        custom-class="custom-input"
                        :is-disabled="disableGeneralInformation"
                        :error-message="errors.collaboration"></field-input>
                </v-col>

                <v-col cols="12" md="6">
                    <field-input v-model="marketing_id" :error-message="errors.marketing_id"
                        :label="t('marketing')"
                        input-type="select"
                        v-if="userRole != 'marketing'"
                        item-value="uid"
                        item-title="name"
                        :is-disabled="disableGeneralInformation"
                        :is-multiple="true"
                        :select-options="listOfMarketings"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <field-input :is-readonly="true" :suffix-text="'m<sup>2</sup>'" :label="t('totalLedArea')"
                        :is-clearable="false"
                        :error-message="errors.led_area" v-model="led_area"></field-input>
        
                    <LedDetailForm
                        :with-add-button="!route.params.type"
                        :with-delete-button="!route.params.type"
                        :data="currentLedDetail"
                        @update-led-event="updateLedArea"
                        :return-object="true"
                        ref="ledFormComponent"></LedDetailForm>
                </v-col>

                <v-col cols="12" md="6">
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