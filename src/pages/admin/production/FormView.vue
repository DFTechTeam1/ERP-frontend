<template>
    <div>
        <breadcrumb-data :title="$t('createProject')" :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ $t('createProject') }}</v-card-title>
            </v-card-item>

            <v-card-text class="mt-3">
                <v-form @submit="validateData">
                    <v-row>
                        <v-col cols="12" lg="6" md="6">
                            <field-input :label="t('name')" :error-message="errors.name" v-model="name"></field-input>

                            <date-picker :label="t('eventDate')" v-model="project_date"
                                :error-message="errors.project_date"></date-picker>

                            <field-input :label="t('country')" v-model="country_id"
                                :error-message="errors.country_id" input-type="select"
                                :select-options="countries"></field-input>

                            <field-input :label="t('city')" v-model="city_id"
                                :error-message="errors.city_id" input-type="select"
                                :select-options="cities"></field-input>

                            <field-input :label="t('collaboration')" :is-required="false" v-model="collaboration"
                                :error-message="errors.collaboration"></field-input>

                            <field-input :is-readonly="true" :suffix-text="'m<sup>2</sup>'" :label="t('ledArea')"
                                :error-message="errors.led_area" v-model="led_area"></field-input>

                            <v-expansion-panels value="accordion" v-model="panel">
                                <v-expansion-panel title="LED Setting">
                                    <v-expansion-panel-text>
                                        <div class="led-wrapper w-100">
                                            <div class="led-item bg-grey-lighten-4" v-for="(field, key) in fields"
                                                :key="key">
                                                <v-row>
                                                    <v-col cols="12" lg="6" md="6">
                                                        <field-input label="Led Width" suffix-text="meter"
                                                            :error-message="errors[`led[${key}].width`]"
                                                            @change="updateLedArea"
                                                            v-model="field.value.width"></field-input>
                                                    </v-col>
                                                    <v-col cols="12" lg="6" md="6">
                                                        <field-input label="Led Height" suffix-text="meter"
                                                            :error-message="errors[`led[${key}].height`]"
                                                            @change="updateLedArea"
                                                            v-model="field.value.height"></field-input>
                                                    </v-col>
                                                </v-row>

                                                <v-icon @click.prevent="removeLed(key)" v-if="key != 0"
                                                    class="close-icon" :icon="mdiCloseCircle" size="25"
                                                    color="red"></v-icon>
                                            </div>

                                            <div class="led-item bg-grey-lighten-4 d-flex align-center justify-center">
                                                <v-btn @click.prevent="push({ width: '1', height: '1' })">
                                                    <v-icon :icon="mdiPlus"></v-icon>
                                                </v-btn>
                                            </div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-col>

                        <v-col cols="12" lg="6" md="6">
                            <field-input :label="t('clientPortal')" v-model="client_portal"
                                :error-message="errors.client_portal"></field-input>

                            <field-input :label="t('eventType')" inputType="select" :select-options="eventTypeList"
                                v-model="event_type" :error-message="errors.event_type"></field-input>

                            <field-input :label="t('state')" inputType="select" :select-options="states"
                                v-model="state_id" :error-message="errors.state_id"></field-input>

                            <field-input :label="t('venue')" id="menu-activator" v-model="venue"
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
                                v-model="classification" :error-message="errors.classification"></field-input>

                            <field-input :label="t('note')" :is-required="false" v-model="note"
                                :error-message="errors.note"></field-input>

                            <field-input :label="t('pic')" :is-multiple="true" v-if="useGetRole() != 'pm'" v-model="pic"
                                :custom-options="true" :error-message="errors.pic" inputType="select"
                                :select-options="projectManagerList">
                                <template v-slot:selectOption="{ props, item }">
                                    <v-list-item v-bind="props" :prepend-avatar="item.raw.image" :base-color="item.raw.coloring">

                                        <template v-slot:title>
                                            {{ item.raw.title }}
                                        </template>
                                        <template v-slot:subtitle>
                                            {{ $t('projectOnThisMonth', {number: item.raw.workload_on_date}) }}
                                        </template>

                                    </v-list-item>
                                </template>
                            </field-input>

                            <field-input :label="t('status')" input-type="select" :select-options="statusList"
                                v-model="status" :error-message="errors.status"></field-input>

                            <field-input v-model="marketing_id" :error-message="errors.marketing_id"
                                :label="t('marketing')" input-type="select" v-if="userRole != 'marketing'"
                                :is-multiple="true"
                                :select-options="marketingList"></field-input>
                        </v-col>
                    </v-row>

                    <v-btn class="mt-5" variant="flat" color="primary" :disabled="loading" type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped lang="scss">
.led-wrapper {
    .led-item {
        padding: 8px 12px;
        border: 1px solid #f4f4f4;
        border-radius: 4px;
        margin-bottom: 18px;
        position: relative;

        .close-icon {
            position: absolute;
            top: -15px;
            right: -10px;
            cursor: pointer;
        }
    }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import { mdiCloseCircle, mdiPlus } from '@mdi/js';
import { useGetRole } from '@/compose/getRole';
import { useProjectStore } from '@/stores/project';
import { useEmployeesStore } from '@/stores/employees';
import { usePositionStore } from '@/stores/position';
import { useRegionStore } from '@/stores/region'
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();

const positionStore = usePositionStore();

const employeeStore = useEmployeesStore();

const store = useProjectStore();

const regionStore = useRegionStore()

const { t } = useI18n();

const { defineField, errors, setFieldValue, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
        status: yup.string().required(),
        client_portal: yup.string().required(t('clientPortalRequired')),
        project_date: yup.string().required(t('projectDateRequired')),
        event_type: yup.string().required(t('eventTypeRequired')),
        venue: yup.string().required(t('venueRequired')),
        marketing_id: yup.array().required(t('marketingRequired')),
        collaboration: yup.string().nullable(),
        note: yup.string().nullable(),
        classification: yup.string().required(t('eventClassRequired')),
        led_area: yup.string().required(),
        pic: yup.array().required(t('picRequired')),
        led: yup.array().of(
            yup.object().shape({
                width: yup.string().required(t('ledWidthRequired')),
                height: yup.string().required(t('ledHeightRequired')),
            }),
        ),
        country_id: yup.string().required(t('countryRequired')),
        state_id: yup.string().required(t('stateRequired'))
    }),
    initialValues: {
        led: [
            { width: '1', height: '1' },
        ],
        status: 2,
    },
})

const [name] = defineField('name');
const [status] = defineField('status');
const [client_portal] = defineField('client_portal');
const [project_date] = defineField('project_date');
const [event_type] = defineField('event_type');
const [venue] = defineField('venue');
const [marketing_id] = defineField('marketing_id');
const [collaboration] = defineField('collaboration');
const [note] = defineField('note');
const [classification] = defineField('classification');
const [led_area] = defineField('led_area');
const [pic] = defineField('pic');
const [country_id] = defineField('country_id');
const [state_id] = defineField('state_id');
const [city_id] = defineField('city_id');
const { push, fields, remove } = useFieldArray('led');

const panel = ref([0])

const breadcrumbs = ref([
    {
        title: t('project'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('projectList'),
        disabled: false,
        href: '/admin/production/projects',
    },
    {
        title: t('create'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

const statusList = ref([
    {
        title: t('draft'),
        value: 2,
    },
    {
        title: t('ongoing'),
        value: 1,
    },
])

const loading = ref(false);

const eventTypeList = ref([]);

const classList = ref([]);

const projectManagerList = ref([]);

const marketingList = ref([]);

const userRole = ref(null);

const countries = ref([])

const states = ref([])

const cities = ref([])

const venueList = ref([]);

onMounted(() => {
    if (fields.value.length) {
        calculateArea();
    }

    userRole.value = useGetRole();

    initEventType();
    initClassList();
    initProjectManager();
    initMarketing();
    initCountries()
})

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
            return {
                title: elem.name,
                value: elem.uid,
            }
        })
    }

    console.log('marketing list', marketingList.value)
}

async function initProjectManager(payload = null) {
    const resp = await employeeStore.getProjectManager(payload);

    if (resp.status < 300) {
        projectManagerList.value = resp.data.data;
    }
}

async function initEventType() {
    const resp = await store.initEventTypes();

    if (resp.status < 300) {
        eventTypeList.value = resp.data.data;
    }
}

async function initClassList() {
    const resp = await store.initClassList();

    if (resp.status < 300) {
        classList.value = resp.data.data;
    }
}

function calculateArea() {
    var areas = [];
    for (let a = 0; a < fields.value.length; a++) {
        var width = fields.value[a].value.width;
        var height = fields.value[a].value.height;

        var total = parseFloat(width) * parseFloat(height);
        areas.push(total);
    }
    var sum = areas.reduce((a, b) => a + b);
    // var average = sum / areas.length;

    setFieldValue('led_area', sum.toString());
}

function updateLedArea() {
    calculateArea();
}

function removeLed(key) {
    remove(key);

    calculateArea();
}

const validateData = handleSubmit(async (values) => {
    loading.value = true;

    const resp = await store.storeProject(values);

    loading.value = false;

    if (resp.status < 300) {
        router.push({ path: '/admin/production/projects' });
    }
})

function chooseVenue(selectedVenue) {
    setFieldValue('venue', selectedVenue.title);
}

watch(name, (values) => {
    if (values.length) {
        var portal = values
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        setFieldValue('client_portal', portal);
    }
})

watch(country_id, (values) => {
    initStates(values || 0)
})

watch(state_id, (values) => {
    initCities(values || 0)
})

watch(project_date, (values) => {
    if (values) {
        // reinit pic
        initProjectManager({ date: values });
    }
})

watch(venue, async (values) => {
    if (values.length > 4) {
        const resp = await store.autocompleteVenue({search: values});

        if (resp.status < 300) {
            venueList.value = resp.data.data
        }

        console.log('venueList', venueList.value);
    } else {
        venueList.value = [];
    }
})
</script>