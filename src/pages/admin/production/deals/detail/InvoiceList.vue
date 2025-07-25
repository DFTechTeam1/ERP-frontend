<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { useProjectDealStore } from '@/stores/projectDeal';
import { mdiCheck, mdiClose, mdiDotsVertical, mdiDownload, mdiPen, mdiTrashCan } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useEncrypt } from '@/compose/encrypt';
import { computed } from 'vue';
import GenerateInvoiceForm from '../components/GenerateInvoiceForm.vue';
import { ref } from 'vue';
import { showNotification } from '@/compose/notification';
import { useFinanceStore } from '@/stores/finance';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['update-transaction']);

const { t } = useI18n();

const store = useProjectDealStore();

const financeStore = useFinanceStore();

const { detailOfProjectDeal } = storeToRefs(store);

const headerTransactions = ref([
    { title: 'Number', align: 'start', key: 'number', sortable: false },
    { title: 'Date', align: 'start', key: 'payment_date', sortable: false },
    { title: 'Status', align: 'start', key: 'status', sortable: false },
    { title: 'Payment Due', align: 'start', key: 'payment_due', sortable: false },
    { title: 'Billing Date', align: 'start', key: 'billing_date', sortable: false },
    { title: 'Payment At', align: 'start', key: 'paid_at', sortable: false },
    { title: 'Amount', align: 'start', key: 'amount', sortable: false },
    { title: 'Action', align: 'start', key: 'uid', sortable: false },
]);

const downloadInvoice = (url) => {
    window.open(url, '__blank');
};

const stateRemainingPayment = ref(0);

const showGenerateInvoice = ref(false);

const showConfirmationApproveChanges = ref(false);

const defaultInvoiceActionConfirmationTitle = ref(t("approveChanges"));

const defaultInvoiceActionConfirmationText = ref(t("areYouSureApproveChanges"));

const selectedInvoiceToBeApprove = ref([]);

const currentInvoice = ref({});

const loading = ref(false);

const isShowDeleteConfirmation = ref(false);

const isOnRevise = ref(false);

const selectedIds = ref([]);

const showEditForm = (remainingPayment, invoice) => {
    showGenerateInvoice.value = true;
    stateRemainingPayment.value = parseInt(remainingPayment);
    currentInvoice.value = invoice;
};

const invoices = computed(() => {
    let output = [];

    if (detailOfProjectDeal.value) {
        const saltKey = import.meta.env.VITE_SALT_KEY;
        var { decodedString } = useEncrypt(detailOfProjectDeal.value.invoices, saltKey);
        output = decodedString;
    }
    return output;
});

const closeGenerateInvoiceForm = () => {
    showGenerateInvoice.value = false;
    currentInvoice.value = {};
};

const updateTransactionData = () => {
    showGenerateInvoice.value = false;
    emit('update-transaction');
};

const deleteInvoice = (invoice) => {
    isShowDeleteConfirmation.value = true;
    selectedIds.value = [invoice.uid];
};

const approveInvoice = (invoice) => {
    showConfirmationApproveChanges.value = true;
    selectedInvoiceToBeApprove.value = [invoice];

    isOnRevise.value = false;
};

const rejectInvoice = (invoice) => {
    showConfirmationApproveChanges.value = true;
    selectedInvoiceToBeApprove.value = [invoice];

    isOnRevise.value = true;

    // change title and text of confirmation modal
    defaultInvoiceActionConfirmationTitle.value = t("rejectChanges");
    defaultInvoiceActionConfirmationText.value = t("areYouRejectChanges");
};

/**
 * Approve changes
 * @param {object} invoice
 */
const doApproveInvoice = async (invoice) => {
    let invoiceUid = invoice[0].uid;
    let invoicePendingUpdateId = invoice[0].pending_update_id;
    loading.value = true;

    // define the correct action based on type, is reject or not
    let actionData = isOnRevise.value ? 'rejectInvoiceChanges' : 'approveInvoiceChanges';

    const resp = await financeStore[actionData](invoiceUid, invoicePendingUpdateId);
    loading.value = false;

    const message = resp.status < 300 ? resp.data.message : resp.response.data.message;
    const type = resp.status < 300 ? 'success' : 'error';
    showNotification(message, type);

    if (resp.status < 300) {
        showConfirmationApproveChanges.value = false;
        selectedInvoiceToBeApprove.value = [];
        emit('update-transaction');
    }
};

const doDeleteInvoice = async (uids) => {
    loading.value = true;
    const resp = await store.deleteInvoice(uids[0]);
    loading.value = false;

    const message = resp.status < 300 ? resp.data.message : resp.response.data.message;
    const type = resp.status < 300 ? 'success' : 'error';
    showNotification(message, type);

    if (resp.status < 300) {
        isShowDeleteConfirmation.value = false;
        selectedIds.value = [];
        emit('update-transaction');
    }
};
</script>

<template>
    <div class="transaction-box">
        <div class="transaction-box__status">
            <p class="status" :style="{
                color: '#000'
            }">Invoice List</p>
        </div>

        <div class="transaction-box__product">
            <v-data-table-virtual
                :headers="headerTransactions"
                :items="invoices"
                class="product-item"
                fixed-header>
                <template v-slot:item.status="{ item }">
                    <v-chip size="small" :color="item.status_color">{{ item.status }}</v-chip>
                </template>

                <template v-slot:item.amount="{ item }">
                    {{ formatPrice(item.amount) }}
                </template>

                <template v-slot:item.uid="{ item }">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn :icon="mdiDotsVertical" v-bind="props" variant="flat"></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click.prevent="downloadInvoice(item.invoice_url)">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiDownload"></v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>Download Invoice</span>
                                </template>
                            </v-list-item>
                            <v-list-item @click.prevent="showEditForm(detailOfProjectDeal.final_quotation.remaining, item)" v-if="item.can_edit_invoice">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiPen"></v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>{{ $t('edit') }}</span>
                                </template>
                            </v-list-item>
                            <v-list-item @click.prevent="deleteInvoice(item)" v-if="item.can_delete_invoice">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiTrashCan"></v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>{{ $t('delete') }}</span>
                                </template>
                            </v-list-item>
                            <v-list-item @click.prevent="approveInvoice(item)" v-if="item.can_approve_invoice">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiCheck"></v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>{{ $t('approve') }}</span>
                                </template>
                            </v-list-item>
                            <v-list-item @click.prevent="rejectInvoice(item)" v-if="item.can_reject_invoice">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiClose"></v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>{{ $t('reject') }}</span>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table-virtual>

            <generate-invoice-form
                v-if="(detailOfProjectDeal)"
                :remaining-payment="stateRemainingPayment"
                @close-event="closeGenerateInvoiceForm(detailOfProjectDeal.final_quotation.remaining)"
                @update-transaction="updateTransactionData"
                :current-invoice="currentInvoice"
                :is-show="showGenerateInvoice"></generate-invoice-form>

            <confirmation-modal
                title="Delete invoice"
                text="Are you sure to delete this unpaid invoice?"
                :loading="loading"
                :show-confirm="isShowDeleteConfirmation"
                :delete-ids="selectedIds"
                @actionBulkSubmit="doDeleteInvoice"></confirmation-modal>

            <confirmation-modal
                :title="defaultInvoiceActionConfirmationTitle"
                :text="defaultInvoiceActionConfirmationText"
                :loading="loading"
                :show-confirm="showConfirmationApproveChanges"
                :delete-ids="selectedInvoiceToBeApprove"
                @actionBulkSubmit="doApproveInvoice"></confirmation-modal>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.transaction-box {
    border: 1px solid #000000;
    border-color: rgba(0,0,0, .2);
    border-radius: 8px;
    margin-top: 38px;

    &__product {
        padding: 16px 24px;
        margin-bottom: 20px;

        &__header,
        &__body {
            display: flex;
            width: 100%;
            padding: 20px 30px;
            background-color: rgba(217,217,217, .4);

            .left {
                width: 50%;
                font-weight: bold;
            }

            .right {
                width: 50%;
                text-align: right;
                font-weight: bold;
            }
        }

        &__body {
            background-color: unset;
            padding: 12px 30px;
            border-bottom: 1px solid rgba(0,0,0,.2);
        }

        &__body.empty {
            color: transparent;
        }

        &__body.transaction {
            .left,
            .right {
                color: #26CEFD;
            }
        }
    }
    
    &__status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(0,0,0, .2);
        padding-bottom: 16px;
        margin-bottom: 16px;
        
        .status {
            font-weight: bold;
            font-size: 16px;
            color: #F4511E;
        }
    }
}
</style>