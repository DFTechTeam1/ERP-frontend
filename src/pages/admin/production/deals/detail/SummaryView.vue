<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { useProjectDealStore } from '@/stores/projectDeal';
import { mdiDownload, mdiInvoice, mdiMailbox, mdiPhoneOutline, mdiPrinterOutline } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import GenerateInvoiceForm from '../components/GenerateInvoiceForm.vue';
import { useEncrypt } from '@/compose/encrypt';

const store = useProjectDealStore();

const { detailOfProjectDeal } = storeToRefs(store);

const showGenerateInvoice = ref(false);

const emit = defineEmits(['update-transaction']);

const headers = ref([
    { title: 'Product', align: 'start', key: 'product', sortable: false },
    { title: 'Description', align: 'start', key: 'description', sortable: false },
    { title: 'Amount', align: 'end', key: 'amount', sortable: false },
]);

const previewQuotation = ({uid, type}) => {
    window.open(import.meta.env.VITE_BACKEND + `/quotations/download/${uid}/${type}`);
};

const previewGeneralInvoice = () => {
    window.open(import.meta.env.VITE_BACKEND + `/invoices/download/general?projectDealUid=${detailOfProjectDeal.value.uid}`, '__blank');
}

const stateRemainingPayment = ref(0);

const closeGenerateInvoiceForm = () => {
    showGenerateInvoice.value = false;
};

const updateTransactionData = () => {
    showGenerateInvoice.value = false;
    emit('update-transaction');
};

const generateInvoice = (remainingPayment) => {
    showGenerateInvoice.value = true;
    stateRemainingPayment.value = parseInt(remainingPayment);
};

// download historical invoice, we only need project deal uid here
const generateHistoryInvoice = () => {
    return window.open(import.meta.env.VITE_BACKEND + `/invoices/download/history?projectDealUid=${detailOfProjectDeal.value.uid}`, '__blank');
};
</script>

<template>
    <div class="transaction-box">
        <div class="transaction-box__status">
            <p class="status"
                :class="'text-' + detailOfProjectDeal.status_payment_color">
                {{ detailOfProjectDeal.status_payment }}

                <span :style="{
                    color: '#000',
                    fontWeight: 'normal',
                    fontSize: '12px',
                    marginLeft: '10px'
                }">({{ detailOfProjectDeal.event_date }})</span>
            </p>
            <div class="transaction-box__status__action">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn variant="outlined" color="light" density="compact"
                            :prepend-icon="mdiPrinterOutline"
                            v-bind="props">
                            Print
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item @click.prevent="generateInvoice(detailOfProjectDeal.final_quotation.remaining)"
                            v-if="!detailOfProjectDeal.is_paid"
                            :prepend-icon="mdiInvoice">
                            <v-list-item-title>{{ $t('createCollectionInvoice') }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.prevent="generateHistoryInvoice"
                            :prepend-icon="mdiDownload">
                            <v-list-item-title>{{ $t('downloadHistoryInvoice') }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.prevent="previewGeneralInvoice"
                            :prepend-icon="mdiDownload">
                            <v-list-item-title>{{ $t('downloadGeneralInvoice') }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.prevent="previewQuotation({uid: detailOfProjectDeal.final_quotation.quotation_id, type: 'download'})"
                            :prepend-icon="mdiDownload">
                            <v-list-item-title>Download Quotation</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.prevent="previewQuotation({uid: detailOfProjectDeal.final_quotation.quotation_id, type: 'stream'})"
                            :prepend-icon="mdiPrinterOutline">
                            <v-list-item-title>Quotation</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>

        <!-- invoice form -->
        <generate-invoice-form
            v-if="(detailOfProjectDeal)"
            :remaining-payment="stateRemainingPayment"
            @close-event="closeGenerateInvoiceForm(detailOfProjectDeal.final_quotation.remaining)"
            @update-transaction="updateTransactionData"
            :is-show="showGenerateInvoice"></generate-invoice-form>

        <div class="transaction-box__customer">
            <v-row>
                <v-col cols="12" md="4">
                    <template v-if="(detailOfProjectDeal) && (detailOfProjectDeal.customer)">
                        <p class="transaction-box__customer__title">
                            Customer
                        </p>
                        <p class="transaction-box__customer__name">
                            {{ detailOfProjectDeal.customer.name }}
                        </p>
                        <div class="transaction-box__customer__detail">
                            <v-icon :icon="mdiPhoneOutline" size="10"></v-icon>
                            <p class="transaction-box__customer__detail__phone">{{ detailOfProjectDeal.customer.phone }}</p>
                        </div>
                        <div class="transaction-box__customer__detail" v-if="detailOfProjectDeal.customer.email">
                            <v-icon :icon="mdiMailbox" size="10"></v-icon>
                            <p class="transaction-box__customer__detail__phone">{{ detailOfProjectDeal.customer.email }}</p>
                        </div>
                    </template>
                    <template v-else>
                        <v-skeleton-loader type="list-item-three-line" height="30px" width="100%"></v-skeleton-loader>
                    </template>
                </v-col>

                <v-col cols="12" md="4">
                    <template v-if="(detailOfProjectDeal) && (detailOfProjectDeal.customer)">
                        <p class="transaction-box__customer__title">
                            Project Name
                        </p>
                        <p class="transaction-box__customer__name">
                            {{ detailOfProjectDeal.name }}
                        </p>
                    </template>
                    <template v-else>
                        <v-skeleton-loader type="list-item-three-line" height="30px" width="100%"></v-skeleton-loader>
                    </template>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <p class="transaction-box__customer__title">
                        Project Date
                    </p>
                    <p class="transaction-box__customer__name">
                        {{ detailOfProjectDeal.event_date }}
                    </p>
                </v-col>

                <!-- <v-col cols="12" md="4">
                    <p class="transaction-box__customer__title">
                        Due Date
                    </p>
                    <p class="transaction-box__customer__name">
                        -
                    </p>
                </v-col> -->
            </v-row>
        </div>

        <div class="transaction-box__product">
            <v-data-table-virtual
                :headers="headers"
                :items="detailOfProjectDeal.products"
                class="product-item"
                fixed-header>
                <template v-slot:item.description="{ item }">
                    <span v-html="item.description"></span>
                </template>

                <template v-slot:item.amount="{ item }">
                    Rp{{ formatPrice(item.amount) }}
                </template>
            </v-data-table-virtual>

            <v-row>
                <v-col cols="12" md="6"></v-col>
                <v-col cols="12" md="6" v-if="(detailOfProjectDeal) && (detailOfProjectDeal.final_quotation)">
                    <div class="transaction-box__product__body">
                        <div class="left">Sub Total</div>
                        <div class="right">Rp{{ formatPrice(detailOfProjectDeal.fix_price) }}</div>
                    </div>
                    <div class="transaction-box__product__body transaction"
                        v-for="(trx, t) in detailOfProjectDeal.transactions"
                        :key="t">
                        <div class="left">Payment {{ trx.transaction_date_raw }}</div>
                        <div class="right">Rp{{ formatPrice(trx.payment_amount) }}</div>
                    </div>
                    <div class="transaction-box__product__body">
                        <div class="left">Balance Due</div>
                        <div class="right">Rp{{ formatPrice(detailOfProjectDeal.remaining_price) }}</div>
                    </div>
                </v-col>
            </v-row>
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
        }
    }
    
    &__customer {
        padding: 16px 24px;

        &__title {
            color: rgba(0,0,0,.3);
            font-size: 12px;
        }

        &__name {
            font-size: 14px;
            color: #000;
            margin-top: 4px;
        }

        &__detail {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-top: 4px;

            &__phone {
                font-size: 10px;
                color: rgba(0,0,0,.6);
            }
        }
    }
}

.title {
    font-weight: bold;
    font-size: 16px;
}
</style>