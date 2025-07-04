<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { useProjectDealStore } from '@/stores/projectDeal';
import { mdiDownload } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useEncrypt } from '@/compose/encrypt';
import { computed } from 'vue';

const store = useProjectDealStore();

const { detailOfProjectDeal } = storeToRefs(store);

const headerTransactions = ref([
    { title: 'Number', align: 'start', key: 'number', sortable: false },
    { title: 'Date', align: 'start', key: 'payment_date', sortable: false },
    { title: 'Status', align: 'start', key: 'status', sortable: false },
    { title: 'Payment Due', align: 'start', key: 'payment_due', sortable: false },
    { title: 'Payment At', align: 'start', key: 'paid_at', sortable: false },
    { title: 'Amount', align: 'start', key: 'amount', sortable: false },
    { title: 'Action', align: 'start', key: 'uid', sortable: false },
]);

const downloadInvoice = (uid) => {
    window.open(import.meta.env.VITE_BACKEND + `/invoices/download/${uid}/download`);
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
                :items="detailOfProjectDeal.invoices"
                class="product-item"
                fixed-header>
                <template v-slot:item.status="{ item }">
                    <v-chip size="small" :color="item.status_color">{{ item.status }}</v-chip>
                </template>

                <template v-slot:item.amount="{ item }">
                    {{ formatPrice(item.amount) }}
                </template>

                <template v-slot:item.uid="{ item }">
                    <v-tooltip text="Download Invoice">
                        <template v-slot:activator="{ props }">
                            <v-icon :icon="mdiDownload"
                                class="pointer"
                                @click.prevent="downloadInvoice(item.uid)"
                                v-bind="props"></v-icon>
                        </template>
                    </v-tooltip>
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