<template>
    <div>
        <breadcrumb-data
            :title="$t('createProject')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ $t('createProject') }}</v-card-title>
            </v-card-item>

            <v-card-text class="mt-3">
                <v-form @submit="validateData">
                    <v-row>
                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <field-input
                                :label="t('name')"
                                :error-message="errors.name"
                                v-model="name"></field-input>

                            <date-picker
                                :label="t('eventDate')"
                                v-model="project_date"
                                :error-message="errors.project_date"></date-picker>

                            <field-input
                                :label="t('venue')"
                                v-model="venue"
                                :error-message="errors.venue"></field-input>

                            <field-input
                                :label="t('collaboration')"
                                :is-required="false"
                                v-model="collaboration"
                                :error-message="errors.collaboration"></field-input>

                            <field-input
                                :is-readonly="true"
                                :suffix-text="'m<sup>2</sup>'"
                                :label="t('ledArea')"
                                :error-message="errors.led_area"
                                v-model="led_area"></field-input>

                            <field-input
                                v-model="marketing_id"
                                :error-message="errors.marketing_id"
                                :label="t('marketing')"
                                input-type="select"
                                v-if="userRole != 'marketing'"
                                :select-options="marketingList"></field-input>
                        </v-col>

                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <field-input
                                :label="t('clientPortal')"
                                v-model="client_portal"
                                :error-message="errors.client_portal"></field-input>

                            <field-input
                                :label="t('eventType')"
                                inputType="select"
                                :select-options="eventTypeList"
                                v-model="event_type"
                                :error-message="errors.event_type"></field-input>

                            <field-input
                                :label="t('eventClass')"
                                inputType="select"
                                :select-options="classList"
                                v-model="classification"
                                :error-message="errors.classification"></field-input>

                            <field-input
                                :label="t('note')"
                                :is-required="false"
                                v-model="note"
                                :error-message="errors.note"></field-input>

                            <field-input
                                :label="t('pic')"
                                :is-multiple="true"
                                v-if="useGetRole() != 'pm'"
                                v-model="pic"
                                :custom-options="true"
                                :error-message="errors.pic"
                                inputType="select"
                                :select-options="projectManagerList">
                                <template v-slot:selectOption="{props, item}">
                                    <v-list-item
                                        v-bind="props"
                                        :prepend-avatar="item.raw.image">

                                        <template v-slot:title>
                                            {{ item.raw.title }}
                                        </template>
                                        <template v-slot:subtitle>
                                            {{ item.raw.workload_on_date }} Project on this selected date
                                        </template>

                                    </v-list-item>
                                </template>
                            </field-input>
                        </v-col>

                        <v-col
                            cols="12">
                            <v-expansion-panels
                                value="accordion">
                                <v-expansion-panel
                                    title="LED Setting">
                                    <v-expansion-panel-text>
                                        <div class="led-wrapper w-100">
                                            <div 
                                                class="led-item bg-grey-lighten-4"
                                                v-for="(field, key) in fields"
                                                :key="key">
                                                <v-row>
                                                    <v-col
                                                        cols="12"
                                                        lg="6"
                                                        md="6">
                                                        <field-input
                                                            label="Led Width"
                                                            suffix-text="meter"
                                                            :error-message="errors[`led[${key}].width`]"
                                                            @change="updateLedArea"
                                                            v-model="field.value.width"></field-input>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        lg="6"
                                                        md="6">
                                                        <field-input
                                                            label="Led Height"
                                                            suffix-text="meter"
                                                            :error-message="errors[`led[${key}].height`]"
                                                            @change="updateLedArea"
                                                            v-model="field.value.height"></field-input>
                                                    </v-col>
                                                </v-row>

                                                <v-icon
                                                    @click.prevent="removeLed(key)"
                                                    v-if="key != 0"
                                                    class="close-icon"
                                                    :icon="mdiCloseCircle"
                                                    size="25"
                                                    color="red"></v-icon>
                                            </div>

                                            <div class="led-item bg-grey-lighten-4 d-flex align-center justify-center">
                                                <v-btn
                                                    @click.prevent="push({width: '1', height: '1'})">
                                                    <v-icon
                                                        :icon="mdiPlus"></v-icon>
                                                </v-btn>
                                            </div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-col>
                    </v-row>

                    <v-btn
                        class="mt-5"
                        variant="flat"
                        color="primary"
                        :disabled="loading"
                        type="submit">
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
import { useRouter } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();

const positionStore = usePositionStore();

const employeeStore = useEmployeesStore();

const store = useProjectStore();

const { t } = useI18n();

const { defineField, errors, setFieldValue, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
        client_portal: yup.string().required(t('clientPortalRequired')),
        project_date: yup.string().required(t('projectDateRequired')),
        event_type: yup.string().required(t('eventTypeRequired')),
        venue: yup.string().required(t('venueRequired')),
        marketing_id: yup.string().required(t('marketingRequired')),
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
    }),
    initialValues: {
        led: [
            {width: '1', height: '1.9'},
        ],
    },
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
const [pic] = defineField('pic');
const { push, fields, remove } = useFieldArray('led');

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

const loading = ref(false);

const eventTypeList = ref([]);

const classList = ref([]);

const projectManagerList = ref([]);

const marketingList = ref([]);

const userRole = ref(null);

onMounted(() => {
    if (fields.value.length) {
        calculateArea();
    }

    userRole.value = useGetRole();

    initEventType();
    initClassList();
    initProjectManager();
    initMarketing();
})

async function initMarketing() {
    // get marketing id
    const position = await positionStore.getAll({name: 'marketing'})
    
    if (position.status < 300) {
        const selectedPosition = position.data.data[0].value;
        const resp = await employeeStore.getByPosition({id: selectedPosition});
        

        if (resp.status < 300) {
            marketingList.value = resp.data.data.paginated.map((i) => {
                return {
                    value: i.uid,
                    title: i.name,
                }
            });
        }
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
    var sum = areas.reduce((a,b) => a + b);
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
        router.push({path: '/admin/production/projects'});
    }
})

watch(name, (values) => {
    if (values.length) {
        var portal = values
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        setFieldValue('client_portal', portal);
    }
})

watch(project_date, (values) => {
    if (values) {
        // reinit pic
        initProjectManager({date: values});
    }
})
</script>