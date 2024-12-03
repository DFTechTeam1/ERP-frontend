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
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('name')"
                                :error-message="errors.name"
                                v-model="name"></field-input>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('clientPortal')"
                                v-model="client_portal"
                                :error-message="errors.client_portal"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <date-picker :label="t('eventDate')" v-model="project_date"
                                :error-message="errors.project_date"></date-picker>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('eventType')" inputType="select" :select-options="eventTypeList"
                                v-model="event_type" :error-message="errors.event_type"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('country')" v-model="country_id"
                                :error-message="errors.country_id" input-type="select"
                                :select-options="countries"></field-input>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('state')" inputType="select" :select-options="states"
                                v-model="state_id" :error-message="errors.state_id"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('city')" v-model="city_id"
                                :error-message="errors.city_id" input-type="select"
                                :select-options="cities"></field-input>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
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
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('collaboration')" :is-required="false" v-model="collaboration"
                                :error-message="errors.collaboration"></field-input>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :label="t('eventClass')" inputType="select" :select-options="classList"
                                v-model="classification" :error-message="errors.classification"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input :is-readonly="true" :suffix-text="'m<sup>2</sup>'" :label="t('totalLedArea')"
                                :error-message="errors.led_area" v-model="led_area"></field-input>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <field-input v-model="marketing_id" :error-message="errors.marketing_id"
                                :label="t('marketing')" input-type="select" v-if="userRole != 'marketing'"
                                :is-multiple="true"
                                :select-options="marketingList"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                          <LedDetailForm
                            @update-led-event="updateLedArea"
                            ref="ledFormComponent"></LedDetailForm>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 pt-0 mb-2">
                            <v-label :text="t('note')" class="mb-3"></v-label>
                            <QuillEditor
                                class="quill-note"
                                theme="snow"
                                ref="description_quill"
                                @update:content="updateDescription" />
                            <div v-if="errors.note" class="invalid-feedback">{{ errors.note }}</div>
                        </v-col>
                    </v-row>

                    <v-btn class="mt-5" variant="flat" color="primary" :disabled="loading" type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>

                <LedForm :is-show="isShowLedForm" @close-event="closeLedForm" />
            </v-card-text>
        </v-card>
    </div>
</template>

<style lang="scss">
.quill-note {
    height: 100px !important;
}
</style>

<style scoped lang="scss">
.led-item {
    .title {
        font-size: 16px;
    }

    .subtitle {
        font-size: 13px;
    }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import { mdiClose, mdiCloseCircle, mdiMonitorScreenshot, mdiPlus } from '@mdi/js';
import { useGetRole } from '@/compose/getRole';
import { useProjectStore } from '@/stores/project';
import { useEmployeesStore } from '@/stores/employees';
import { useRegionStore } from '@/stores/region'
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { useProjectClassStore } from '@/stores/projectClass';
import LedForm from './LedForm.vue';
import LedDetailForm from './components/LedDetailForm.vue';

const router = useRouter();

const employeeStore = useEmployeesStore();

const store = useProjectStore();

const storeProjectClass = useProjectClassStore()

const regionStore = useRegionStore()

const { t } = useI18n();

const { defineField, errors, setFieldValue, setFieldError, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
        client_portal: yup.string().required(t('clientPortalRequired')),
        project_date: yup.string().required(t('projectDateRequired')),
        event_type: yup.string().required(t('eventTypeRequired')),
        venue: yup.string().required(t('venueRequired')),
        marketing_id: yup.array().required(t('marketingRequired')),
        collaboration: yup.string().nullable(),
        note: yup.string().nullable(),
        classification: yup.string().required(t('eventClassRequired')),
        led_area: yup.string().required(t('ledAreaRequired')),
        country_id: yup.string().required(t('countryRequired')),
        state_id: yup.string().required(t('stateRequired'))
    })
})

const [name] = defineField('name');
const [client_portal] = defineField('client_portal');
const [project_date] = defineField('project_date');
const [event_type] = defineField('event_type');
const [venue] = defineField('venue');
const [marketing_id] = defineField('marketing_id');
const [collaboration] = defineField('collaboration');
const [note] = defineField('note');
const [classification] = defineField('classification');
const [led_area] = defineField('led_area');
const [country_id] = defineField('country_id');
const [state_id] = defineField('state_id');
const [city_id] = defineField('city_id');
const { push, fields, remove } = useFieldArray('led');

const marketingCount = ref('')

const ledFormComponent = ref(null);

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

const ledSetting = ref([])

const loading = ref(false);

const isShowLedForm = ref(false)

const eventTypeList = ref([]);

const classList = ref([]);

const description_quill = ref(null);

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

function showLedForm() {
    isShowLedForm.value = true
}

function closeLedForm(payload = null) {
    isShowLedForm.value = false

    if (payload) {
        ledSetting.value.push(payload)

        updateTotalLed()
    }

    console.log('ledSetting', ledSetting.value);
}

function updateTotalLed() {
    var total = []
    for (let a = 0; a < ledSetting.value.length; a++) {
        total.push(parseFloat(ledSetting.value[a].totalRaw))
    }

    var sum = total.reduce((a, b) => a + b);

    setFieldValue('led_area', sum)
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

// function updateLedArea() {
//     calculateArea();
// }

function updateLedArea(total) {
  setFieldValue('led_area', total);
}

const validateData = handleSubmit(async (values) => {
    if (marketingCount.value == 0 || marketingCount.value == '') {
        setFieldError('marketing_id', t('marketingRequired'))
        return
    }
    loading.value = true;

    // call the child function to get updated led setting
    values.led_detail = ledFormComponent.value.getValue();

    const resp = await store.storeProject(values);

    loading.value = false;

    if (resp.status < 300) {
        router.push({ path: '/admin/production/projects' });
    }
})

function chooseVenue(selectedVenue) {
    setFieldValue('venue', selectedVenue.title);
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        setFieldValue('note', description_quill.value.getHTML())
    } else {
        setFieldValue('note', null)
    }
}

watch(marketing_id, (values) => {
    marketingCount.value = values.length
})

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

function removeLed(key) {
    var newArr = ledSetting.value.filter((elem, keyData) => {
        return keyData != key
    })

    ledSetting.value = newArr

    if (ledSetting.value.length) {
        updateTotalLed()
    } else {
        setFieldValue('led_area', '0')
    }
}
</script>
