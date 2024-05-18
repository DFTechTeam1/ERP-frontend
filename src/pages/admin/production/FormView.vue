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
                <v-form>
                    <v-row>
                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <field-input
                                :label="t('name')"
                                v-model="name"></field-input>

                            <date-picker
                                :label="t('eventDate')"></date-picker>

                            <field-input
                                :label="t('venue')"></field-input>

                            <field-input
                                :label="t('collaboration')"
                                :is-required="false"></field-input>

                            <field-input
                                :is-readonly="true"
                                :suffix-text="'m<sup>2</sup>'"
                                :label="t('ledArea')"
                                v-model="led_area"></field-input>
                        </v-col>

                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <field-input
                                :label="t('clientPortal')"
                                v-model="client_portal"></field-input>

                            <field-input
                                :label="t('eventType')"
                                inputType="select"
                                :select-options="eventTypeList"></field-input>

                            <field-input
                                :label="t('eventClass')"
                                inputType="select"
                                :select-options="classList"></field-input>

                            <field-input
                                :label="t('note')"></field-input>

                            <field-input
                                :label="t('pic')"
                                v-if="useGetRole() != 'pm'"
                                inputType="select"
                                :select-options="projectManagerList"></field-input>
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
                        color="primary">
                        {{ $t('save') }}
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

const employeeStore = useEmployeesStore();

const store = useProjectStore();

const { t } = useI18n();

const { defineField, errors, setFieldValue } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
        client_portal: yup.string().required(),
        date: yup.string().required(),
        event_type: yup.string().required(),
        venue: yup.string().required(),
        marketing_id: yup.string().required(),
        collaboration: yup.string().nullable(),
        note: yup.string().nullable(),
        classification: yup.string().required(),
        led_area: yup.string().required(),
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
const { push, fields } = useFieldArray('led');
const [led_area] = defineField('led_area');

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

const eventTypeList = ref([]);

const classList = ref([]);

const projectManagerList = ref([]);

onMounted(() => {
    if (fields.value.length) {
        calculateArea();
    }

    initEventType();
    initClassList();
    initProjectManager();
})

async function initProjectManager() {
    const resp = await employeeStore.getProjectManager();

    if (resp.status < 300) {
        projectManagerList.value = resp.data.data;
    }
}

async function initEventType() {
    const resp = await store.initProjects();

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
    var average = sum / areas.length;

    setFieldValue('led_area', average.toString());
}

function updateLedArea() {
    calculateArea();
}
</script>