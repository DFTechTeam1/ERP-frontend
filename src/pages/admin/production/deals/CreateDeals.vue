<script setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ProjectDetailForm from './ProjectDetailForm.vue';
import CalculationForm from './CalculationForm.vue';
import QuotationPreview from './QuotationPreview.vue';
import { useSettingStore } from '@/stores/setting';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { showNotification } from '@/compose/notification';
import { useRoute, useRouter } from 'vue-router';
import { useProjectDealStore } from '@/stores/projectDeal';
import { useProjectClassStore } from '@/stores/projectClass';
import { useRegionStore } from '@/stores/region';
import { useCustomerStore } from '@/stores/customer';

const { t } = useI18n();

const router = useRouter();

const route = useRoute();

const settingStore = useSettingStore();

const breadcrumbs = ref([
    {
        title: t('projectDeals'),
        disabled: false,
        href: '/admin/deals',
    },
    {
        title: t('create'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

const store = useProjectStore();

const regionStore = useRegionStore();

const customerStore = useCustomerStore();

const storeDeal = useProjectDealStore();

const storeProjectClass = useProjectClassStore();

const {
    detailOfProjectDeal
} = storeToRefs(storeDeal);

const {
    designJob
} = storeToRefs(store);

const detailFormRef = ref(null);

const calculationFormRef = ref(null);

const quotationFormRef = ref(null);

const items = ref([
    'Detail Event',
    'Calculation',
    'Summary'
]);

const step = ref(1);

const loading = ref(false);

function nextEvent() {
    step.value += 1;
}

function backEvent() {
    step.value -= 1;
}

function getDetailValue() {
    let values = detailFormRef.value.getValues();

    return values;
}

watch(step, (values, old) => {
    setTimeout(() => {
        if (values && step.value == 2 && old != 3) {
            calculationFormRef.value.setPreview(detailFormRef.value.getValues());
            calculationFormRef.value.checkHighSeason();
        }
    }, 500);
});

function getSettingByKey({data, key}) {
    let output = data.filter((filter) => {
        return filter.key === key;
    });

    if (output.length) output = output[0].value;

    return output;
}

async function getCompanySetting() {
    const resp = await settingStore.getSetting({code: 'company'});
    
    if ((resp.status < 300) && (resp.data.data.length)) {
        // store company information in quotation state
        store.setQuotationOffice({office: {
            name: getSettingByKey({data: resp.data.data, key: 'company_name'}),
            address: getSettingByKey({data: resp.data.data, key: 'company_address'}),
            phone: getSettingByKey({data: resp.data.data, key: 'company_phone'}),
            email: getSettingByKey({data: resp.data.data, key: 'company_email'}),
            logo: getSettingByKey({data: resp.data.data, key: 'company_logo'})
        }});

        store.setQuotationRules({rules: getSettingByKey({data: resp.data.data, key: 'quotation_rules'})});
    }
}

async function getQuotationNumber() {
    if (
        !route.params.id ||
        (
            route.params.id &&
            route.params.type
        )
    ) {
        await store.getQuotationNumber();
    }
}

async function getQuotationItems() {
    await store.getQuotationItems();
}

async function getCalculation() {
    await store.getCalculation();
}

const getDetail = async () => {
    if (route.params.id) {
        await storeDeal.getProjectDetail({projectUid: route.params.id, payload: {edit: 1}});
    }
};

async function initEventType() {
    await store.initEventTypes();
}

async function initClassList() {
    await storeProjectClass.getAll();
}

async function initMarketing() {
    await store.getProjectMarketings();
}

async function initCountries() {
    await regionStore.initCountries();
}

async function getCustomer() {
    await customerStore.getCustomer();
}

async function getProjectCount() {
    let uid = route.params.id ? route.params.id : ''
    await store.getProjectCount(uid);
}

const prepareData = async () => {
    loading.value = true;
    await Promise.all([
        getQuotationNumber(),
        getCompanySetting(),
        getQuotationItems(),
        getCalculation(),
        initEventType(),
        initClassList(),
        initMarketing(),
        initCountries(),
        getCustomer(),
        getProjectCount(),
        getDetail(),
    ]);
    loading.value = false;
};

onMounted(() => {
    prepareData();
});

onBeforeMount(() => {
    // set detail project to null
    storeDeal.setProjectDealDetailState({value: {}});
});

const submitData = async (payload) => {
    let type = payload.type;

    let projectDetail = detailFormRef.value.getPayload();
    let quotationDetail = calculationFormRef.value.getPayload();
    
    // modify status
    let status = 1;
    let requestType = type;
    if (type === 'draft') {
        status = 0;
    } else if (type === 'save_and_download' || type === 'save') {
        status = 2;
    }

    let completePayload = {
        ...projectDetail,
        ...quotationDetail
    }

    completePayload.quotation.is_final = type == 'final' ? 1 : 0;

    completePayload.status = status;
    completePayload.request_type = requestType;
    completePayload.equipment_type = completePayload.quotation.equipment_type;
    completePayload.is_high_season = completePayload.quotation.is_high_season;
    completePayload.quotation.design_job = route.params.id ? detailOfProjectDeal.value.latest_quotation.design_job : designJob.value;
    
    let method = route.params.id && !route.params.type ? 'updateProjectDeal' : (route.params.type ? 'addMoreQuotation' : 'storeProjectDeal');
    let queryParam = route.params.id ? {payload: completePayload, uid: route.params.id} : {payload: completePayload};
    
    if (route.params.id && !route.params.type) completePayload._method = 'PUT';

    quotationFormRef.value.setLoading(true);
    const resp = await store[method](queryParam);
    quotationFormRef.value.setLoading(false);
    
    if (resp.status < 300) {
        showNotification(resp.data.message);
        router.push(`/admin/deals`);
    } else {
        showNotification(resp.response.data.message, 'error');
    }
}
</script>

<template>
    <div>
        <breadcrumb-data
            :title="$t('projectDeals')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <master-card v-if="loading">
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <div class="d-flex justify-center">
                            <v-skeleton-loader type="avatar"></v-skeleton-loader>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div class="d-flex justify-center">
                            <v-skeleton-loader type="avatar"></v-skeleton-loader>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div class="d-flex justify-center">
                            <v-skeleton-loader type="avatar"></v-skeleton-loader>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <template v-for="item in 8"
                        :key="item">
                        <v-col cols="12" md="6">
                            <v-skeleton-loader type="ossein" height="50" width="100%"></v-skeleton-loader>
                        </v-col>
                    </template>
                </v-row>
            </v-card-text>
        </master-card>

        <v-stepper
            v-else
            non-linear
            v-model="step"
            alt-labels
            :items="items"
            hide-actions
            class="deals-stepper">

            <template v-slot:item.1>
                <div class="pt-4">
                    <ProjectDetailForm
                        ref="detailFormRef"
                        @next-event="nextEvent"
                        @back-event="backEvent" />
                </div>
            </template> 
            <template v-slot:item.2>
                <div class="pt-4">
                    <CalculationForm
                        ref="calculationFormRef"
                        @next-event="nextEvent"
                        @back-event="backEvent" />
                </div>
            </template> 
            <template v-slot:item.3>
                <div class="pt-4">
                    <QuotationPreview
                        ref="quotationFormRef"
                        @next-event="submitData"
                        @back-event="backEvent" />
                </div>
            </template> 
        </v-stepper>
    </div>
</template>

<style lang="scss">
.deals-stepper .v-window {
    box-shadow: none;
}
</style>

<style lang="scss" scoped></style>