<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TransactionDetail from './detail/TransactionDetail.vue';
import QuotationList from './detail/QuotationList.vue';
import QuotationWrapper from './detail/QuotationWrapper.vue';
import { useProjectDealStore } from '@/stores/projectDeal';
import { useRoute, useRouter } from 'vue-router';
import { mdiDownload } from '@mdi/js';
import { useDisplay } from 'vuetify';
import { storeToRefs } from 'pinia';

const { t } = useI18n();

const { mobile } = useDisplay();

const store = useProjectDealStore();

const {
    detailOfProjectDeal
} = storeToRefs(store);

const route = useRoute();

const router = useRouter();

const breadcrumbs = ref([
    {
        title: t('projectDeals'),
        disabled: false,
        href: '/admin/deals',
    },
    {
        title: t('detail'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

const tab = ref('transactions');

const loading = ref(false);

const quotationWrapperRef = ref(null);

const showBackButton = ref(false);

const targetBackButton = ref('');

const callTheEvent = (payload) => {
    if (payload.type == 'showButton') {
        if (payload.target == 'back') {
            showBackButton.value = payload.value;
            targetBackButton.value = 'goToQuotationList'
        }
    }
};

const back = () => {
    if (targetBackButton.value) {
        quotationWrapperRef.value.backToQuotationList();
        
        // reset button
        showBackButton.value = false;
        targetBackButton.value = '';
    }
};

const downloadQuotation = () => {
    if (targetBackButton.value) {
        quotationWrapperRef.value.downloadQuotation();
    }
};

const addMoreQuotation = () => {
    router.push(`/admin/deals/${route.params.id}/edit/quotations`);
}

const getDetail = async () => {
    loading.value = true;
    await store.getProjectDetail({projectUid: route.params.id});
    loading.value = false;
};

const updateTranscation = () => {
    getDetail();
}

onMounted(() => {
    store.setProjectDealDetailState({value: {}});
    getDetail();
});
</script>

<template>
    <div>
        <breadcrumb-data
            :title="$t('detail')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <master-card>
            <v-card-text style="position: relative;">
                <template v-if="loading">
                    <div style="padding: 20px 40px">
                        <v-skeleton-loader type="ossein" width="100%" height="50px"></v-skeleton-loader>
    
                        <v-row class="mt-5">
                            <v-col cols="6">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-skeleton-loader type="ossein" width="100%" height="90px"></v-skeleton-loader>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-skeleton-loader type="ossein" width="100%" height="90px"></v-skeleton-loader>
                                    </v-col>
                                </v-row>
                            </v-col>
    
                            <v-col cols="12">
                                <v-skeleton-loader type="card" width="100%" height="90px"></v-skeleton-loader>
                            </v-col>
                        </v-row>
                    </div>
                </template>

                <template v-else>
                    <div class="btn-overflow"
                        :class="{
                            'is-mobile': mobile
                        }">
                        <v-btn density="compact"
                            color="primary"
                            class="pointer"
                            v-if="tab === 'quotations' && showBackButton"
                            type="button"
                            @click.prevent="back">Back</v-btn>
                        <v-btn density="compact"
                            class="pointer"
                            :class="{
                                'ml-2': !mobile
                            }"
                            v-if="tab === 'quotations' && showBackButton"
                            type="button"
                            variant="flat"
                            :icon="mdiDownload"
                            @click.prevent="downloadQuotation"></v-btn>
                        <v-btn density="compact"
                            class="pointer"
                            :class="{
                                'ml-2': !mobile,
                                'w-100': mobile
                            }"
                            v-if="tab === 'quotations' && !showBackButton && (!detailOfProjectDeal.is_final)"
                            type="button"
                            color="primary"
                            variant="flat"
                            @click.prevent="addMoreQuotation">
                            Add Quotation
                        </v-btn>
                    </div>
                    <v-tabs v-model="tab">
                        <v-tab value="transactions">Transactions</v-tab>
                        <v-tab value="quotations">Quotations</v-tab>
                    </v-tabs>
                    <v-tabs-window v-model="tab" class="no-shadow">
                        <v-tabs-window-item
                            class="mt-4"
                            value="transactions">
                            <transaction-detail @update-transaction="updateTranscation" />
                        </v-tabs-window-item>
                        <v-tabs-window-item value="quotations" class="mt-4">
                            <quotation-wrapper ref="quotationWrapperRef" @handling-event="callTheEvent" />
                        </v-tabs-window-item>
                    </v-tabs-window>
                </template>
            </v-card-text>
        </master-card>
    </div>
</template>

<style scoped lang="scss">
.transaction-wrapper {
    position: relative;
    width: 100%;
}

.btn-overflow {
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 999999;
}

.btn-overflow.is-mobile {
    position: relative !important;
    top: unset;
    right: unset;
    margin-bottom: 15px;
}
</style>