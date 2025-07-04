<script setup>
import { formatPrice } from '@/compose/formatPrice';
import PerTransactionDetail from './PerTransactionDetail.vue';
import { ref } from 'vue';

const props = defineProps({
    products: {
        type: Array,
        default: []
    }
});

const headerTransactions = ref([
    { title: 'Date', align: 'start', key: 'transaction_date_raw', sortable: false },
    { title: 'Description', align: 'start', key: 'description', sortable: false },
    { title: 'Reference', align: 'start', key: 'reference', sortable: false },
    { title: 'Amount', align: 'start', key: 'payment_amount', sortable: false },
    { title: 'Action', align: 'start', key: 'uid', sortable: false },
]);

const showTransactionDetail = ref(false);

const selectedTransaction = ref(null);

const detailTransaction = (uid) => {
    showTransactionDetail.value = true;

    selectedTransaction.value = props.products.find(item => item.uid == uid);

    console.log('selectedTransaction', selectedTransaction.value);
};

const closeDetailPerTransaction = () => {
    showTransactionDetail.value = false;
    selectedTransaction.value = null;
};
</script>

<template>
    <div class="transaction-box">
        <per-transaction-detail :is-show="showTransactionDetail"
            :transaction="selectedTransaction"
            @close-event="closeDetailPerTransaction"></per-transaction-detail>

        <div class="transaction-box__status">
            <p class="status" :style="{
                color: '#000'
            }">Transactions</p>
        </div>

        <div class="transaction-box__product">
            <v-data-table-virtual
                :headers="headerTransactions"
                :items="products"
                class="product-item"
                fixed-header>
                <template v-slot:item.description="{ item }">
                    <span v-html="item.description"></span>
                </template>

                <template v-slot:item.payment_amount="{ item }">
                    Rp{{ formatPrice(item.payment_amount) }}
                </template>

                <template v-slot:item.uid="{ item }">
                    <v-btn variant="outlined"
                        size="small"
                        type="button"
                        @click.prevent="detailTransaction(item.uid)">
                        {{ $t('detail') }}
                    </v-btn>
                </template>
            </v-data-table-virtual>
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