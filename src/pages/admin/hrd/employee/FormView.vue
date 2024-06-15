<template>
    <div>
        <breadcrumb-data
            :title="$t('createEmployee')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ $t('createEmployee') }}</v-card-title>
            </v-card-item>
            <v-divider></v-divider>
            <v-card-text class="no-padding">
                <v-stepper
                    @update:modelValue="updateStepper"
                    alt-labels
                    :items="items"
                    :model-value="step">

                    <template v-slot:item.1>
                        <GeneralForm
                            :detailData="detailData"
                            :listProvinces="provinces"
                            ref="generalForm"></GeneralForm>
                    </template>
                    <template v-slot:item.2>
                        <EducationForm
                            :detailData="detailData"
                            ref="educationForm"></EducationForm>
                    </template>
                    <template v-slot:item.3>
                        <JobDetailForm
                            :detailData="detailData"
                            ref="jobDetailForm"></JobDetailForm>
                    </template>
                    <template v-slot:item.4>
                        <DocumentForm
                            :detailData="detailData"
                            ref="documentForm"></DocumentForm>
                    </template>

                    <!-- <v-stepper-window :model-value="step">
                        <v-stepper-window-item value="1">
                            <GeneralForm
                                ref="generalForm"></GeneralForm>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="2">
                            <EducationForm
                                ref="educationForm"></EducationForm>
                        </v-stepper-window-item>
                        <v-stepper-window-item value="3">
                            <JobDetailForm
                                ref="jobDetailForm"></JobDetailForm>
                        </v-stepper-window-item>
                    </v-stepper-window> -->

                    <template v-slot:next>
                        <v-btn
                            @click.prevent="nextStep"
                            variant="outlined"
                            :disabled="nextDisabled">
                            {{ $t('next') }}
                        </v-btn>
                    </template>
                    <template v-slot:prev>
                        <v-btn
                            @click.prevent="prevStep"
                            variant="outlined">
                            {{ $t('previous') }}
                        </v-btn>
                    </template>
                </v-stepper>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import GeneralForm from './GeneralForm.vue';
import EducationForm from './EducationForm.vue';
import JobDetailForm from './JobDetail.vue';
import DocumentForm from './DocumentForm.vue';
import { useEmployeesStore } from '@/stores/employees';
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useRegionStore } from '@/stores/region';

const storeRegion = useRegionStore();

const router = useRouter();

const route = useRoute();

const store = useEmployeesStore();

const { t } = useI18n();

const provinces = ref([]);
const breadcrumbTitle = ref(t('create'));
const detailData = ref(null);
const nextDisabled = ref(false);
const generalForm = ref(null);
const educationForm = ref(null);
const jobDetailForm = ref(null);
const documentForm = ref(null);
const step = ref(1);
const breadcrumbs = ref([
    {
        title: t('employees'),
        disabled: false,
        href: '/admin/employees/list',
    },
    {
        title: breadcrumbTitle,
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);
const items = ref([
    t('generalInformation'),
    t('education'),
    t('jobDetail'),
    t('documents'),
]);

async function nextStep() {
    
    if (step.value < 4) {
        var nextStep = step.value + 1;

        
        if (step.value == 1) {
            const func = await generalForm.value.validate();
            if (func.valid) {
                generalForm.value.manualTrigger()
                step.value = nextStep;
            }
        } else if (step.value == 2) {
            const validateEducation = await educationForm.value.validate();

            if (validateEducation.valid) {
                educationForm.value.storeEducation()
                step.value = nextStep;
            }
        } else if (step.value == 3) {
            const validateJobDetail = await jobDetailForm.value.validateJobDetail();
            
            if (validateJobDetail.valid) {
                jobDetailForm.value.storeJobDetail();
                step.value = nextStep;
            }
        }
    } else if (step.value == 4) {
        documentForm.value.storeFiles();

        var uid = route.params.id || '';
        nextDisabled.value = true;
        const storeData = await store.storeEmployee({uid: uid});
        nextDisabled.value = false;

        if (storeData.status < 300) {
            setTimeout(() => {
                router.push({path: '/admin/employees/list'});
            }, 1000);
        }
    }
}

function prevStep() {
    step.value = step.value - 1
}

function updateStepper(check) {
    console.log('check', check);
}

async function getEmployeeDetail(uid) {
    detailData.value = await store.detailData({uid: uid});
    
    // get provinces
    getProvinces();
}

async function getProvinces() {
    provinces.value = await storeRegion.getProvinces();
}

onMounted(() => {
    if (route.params.id) {
        getEmployeeDetail(route.params.id);
        breadcrumbTitle.value = t('edit');
    } else {
        getProvinces();
    }
})
</script>