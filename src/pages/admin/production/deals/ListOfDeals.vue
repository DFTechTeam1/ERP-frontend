<script setup>
import { useProjectStore } from '@/stores/project';
import { useProjectDealStore } from '@/stores/projectDeal';
import { mdiCheckDecagram, mdiCogOutline, mdiDownload, mdiEyeCircle, mdiInvoice, mdiLogin } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import PaymentDialog from './components/PaymentDialog.vue';
import { showNotification } from '@/compose/notification';

const { t } = useI18n();

const store = useProjectStore();
const storeDeal = useProjectDealStore();

const router = useRouter();

const {
    linkOfQuotationUrl
} = storeToRefs(store);

const {
    listOfProjectDeals,
    totalOfProjectDeals
} = storeToRefs(storeDeal);

const breadcrumbs = ref([
    {
        title: t('projectDeals'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

const itemsPerPage = ref(10);
const totalItems = ref(0);

const headers = ref([
    {
        title: t('date'),
        key: 'project_date',
        align: 'start',
        sortable: true,
        minWidth: '150px'
    },
    {
        title: t('statusProject'),
        key: 'status_project',
        align: 'start',
        sortable: true
    },
    {
        title: t('statusPayment'),
        key: 'status',
        align: 'start',
        sortable: true
    },
    {
        title: t('event'),
        key: 'name',
        align: 'start',
        sortable: true,
        minWidth: '230px'
    },
    {
        title: t('marketing'),
        key: 'marketing',
        align: 'start',
        sortable: true
    },
    {
        title: t('venue'),
        key: 'venue',
        align: 'start',
        sortable: true
    },
    {
        title: t('city'),
        key: 'city',
        align: 'start',
        sortable: true,
        minWidth: '150px'
    },
    {
        title: t('EO'),
        key: 'collaboration',
        align: 'start',
        sortable: true
    },
    {
        title: t('price'),
        key: 'latest_price',
        align: 'start',
        sortable: true
    },
    {
        title: t('DP'),
        key: 'down_payment',
        align: 'start',
        sortable: true
    },
    {
        title: t('remainingPayment'),
        key: 'remaining_payment',
        align: 'start',
        sortable: true
    },
    {
        title: t('action'),
        key: 'uid',
        align: 'start',
        sortable: true
    },
]);

const loading = ref(false);

const showConfirm = ref(false);

const finalIds = ref(null);

const showPaymentDialog = ref(false);

const selectedPaymentDeal = ref(null);

const selectedRemainingBills = ref(0);

const createDeal = () => {
    router.push('/admin/deals/create');
};

const downloadQuotation = (encryptedQuotationId) => {
    window.open(import.meta.env.VITE_BACKEND + `/quotations/download/${encryptedQuotationId}/download`, '__blank');
};

const openPaymentDialog = (encryptedQuotationId) => {
    selectedPaymentDeal.value = listOfProjectDeals.value.find((item) => item.uid === encryptedQuotationId);
    showPaymentDialog.value = true;
};

const initProjectDeals = async(payload = '') => {
    if (payload === '') {
        payload = {page: 1, itemsPerPage: 10}
    }

    storeDeal.setProjectParams({
        page: payload.page,
        itemsPerPage: payload.itemsPerPage,
        sortBy: payload.sortBy,
    });

    loading.value = true;
    const resp = await storeDeal.initProjectDeals();
    loading.value = false;

    totalItems.value = totalOfProjectDeals.value;
    itemsPerPage.value = parseInt(payload.itemsPerPage || 10);
};

const paymentDialogClosed = (uid) => {
    const filter = listOfProjectDeals.value.filter((item) => {
        return item.uid === uid;
    });

    if (filter.length) {
        selectedRemainingBills.value = filter[0].remaining_payment;
    }

    showPaymentDialog.value = false;
}

const publishProject = async (projectDealId, type) => {
    const resp = await storeDeal.publishProject({projectDealId: projectDealId, type: type});

    if (resp.status < 300) {
        showNotification(resp.data.message);
        initProjectDeals();
    } else {
        showNotification(resp.response.data.message, 'error');
    }
};

const makeFinal = (projectDealId) => {
    finalIds.value = [projectDealId];
    showConfirm.value = true;
};

const doFinal = async (deleteIds) => {
    loading.value = true;
    const resp = await storeDeal.publishProject({projectDealId: deleteIds[0], type: 'publish_final'});
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        initProjectDeals();
        showConfirm.value = false;
    } else {
        showNotification(resp.response.data.message, 'error');
    }
};

onMounted(() => {
    if (linkOfQuotationUrl.value) {
        // duplicate in variable
        let url = linkOfQuotationUrl.value;

        // reset state
        store.resetQuotationUrl();

        // redirect
        window.open(url, '__blank');
    }
});
</script>

<template>
    <div>
        <breadcrumb-data
            :title="$t('projectDeals')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <PaymentDialog :is-show="showPaymentDialog"
            :remaining-bills="selectedRemainingBills"
            :deal="selectedPaymentDeal"
            @close-event="paymentDialogClosed" />

        <table-list
            :headers="headers"
            :items-per-page="itemsPerPage"
            :total-items="totalOfProjectDeals"
            :loading="loading"
            :has-checkbox="false"
            :items="listOfProjectDeals"
            :custom-status="true"
            @table-event="initProjectDeals"
            @add-data-event="createDeal">
            <template v-slot:status="{ value }">
                <v-chip :color="value.status_payment_color" size="small" density="compact">{{ value.status_payment }}</v-chip>
            </template>

            <template v-slot:status_project="{ value }">
                <v-chip :color="value.status_project_color" size="small" density="compact">{{ value.status_project }}</v-chip>
            </template>

            <template v-slot:action="{ value, items }">
                <v-menu open-on-click>
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props"
                            :icon="mdiCogOutline"
                            color="blue"></v-icon>
                    </template>

                    <v-list>
                        <v-list-item class="pointer" @click.prevent=""
                            v-if="!value.can_publish_project">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiDownload"
                                        size="13"></v-icon>

                                    <span>Download Invoice</span>
                                </div>
                            </template>
                        </v-list-item>

                        <v-list-item class="pointer" @click.prevent="downloadQuotation(value.uid)"
                            v-if="!value.can_publish_project">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiDownload"
                                        size="13"></v-icon>
                                    <span>Download Quotation</span>
                                </div>
                            </template>
                        </v-list-item>

                        <v-list-item class="pointer" @click.prevent="makeFinal(value.uid)"
                            v-if="value.can_make_final">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiCheckDecagram"
                                        size="13"></v-icon>
                                    <span>Make as Final</span>
                                </div>
                            </template>
                        </v-list-item>

                        <v-list-item class="pointer" @click.prevent="publishProject(value.uid, 'publish_final')"
                            v-if="value.can_publish_project">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiCheckDecagram"
                                        size="13"></v-icon>
                                    <span>Publish as Final</span>
                                </div>
                            </template>
                        </v-list-item>

                        <v-list-item class="pointer" @click.prevent="publishProject(value.uid, 'publish')"
                            v-if="value.can_publish_project">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiLogin"
                                        size="13"></v-icon>
                                    <span>Publish</span>
                                </div>
                            </template>
                        </v-list-item>

                        <v-list-item class="pointer" @click.prevent="openPaymentDialog(value.uid)"
                            v-if="value.can_make_payment">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiInvoice"
                                        size="13"></v-icon>
                                    <span>Make Payment</span>
                                </div>
                            </template>
                        </v-list-item>

                        <v-list-item
                            class="pointer">
                            <template v-slot:title>
                                <router-link
                                    :to="'/admin/deals/create'">
                                    <div
                                        class="d-flex align-center"
                                        style="gap: 8px; font-size: 12px;">
                                        <v-icon
                                        :icon="mdiEyeCircle"
                                        size="13"></v-icon>
                                        {{ $t('detail') }}
                                    </div>
                                </router-link>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </table-list>

        <confirmation-modal 
            title="Make final"
            text="Are you sure to make this quotation as final?"
            :laoding="loading"
            :show-confirm="showConfirm"
            :delete-ids="finalIds"
            @action-bulk-submit="doFinal" />
    </div>
</template>