<script setup>
import { useProjectDealStore } from '@/stores/projectDeal';
import { storeToRefs } from 'pinia';
import TransactionList from './TransactionList.vue';
import PaymentForm from './PaymentForm.vue';
import SummaryView from './SummaryView.vue';
import InvoiceList from './InvoiceList.vue';

const store = useProjectDealStore();

const { detailOfProjectDeal } = storeToRefs(store);

defineEmits(['update-transaction']);
</script>

<template>
    <div class="transaction-wrapper">
        <template v-if="(detailOfProjectDeal) && (!detailOfProjectDeal.is_final)">
            <v-row>
                <v-col cols="12">
                    <v-empty-state
                        image="/transactions.jpg"
                        text="No final after has been made yet"></v-empty-state>
                </v-col>
            </v-row>
        </template>
        <template v-else>
            <summary-view @update-transaction="$emit('update-transaction')" />

            <invoice-list />

            <payment-form @update-transaction="$emit('update-transaction')" />

            <transaction-list :products="detailOfProjectDeal.transactions"></transaction-list>
        </template>
    </div>
</template>

<style lang="scss">
.product-item table thead tr th {
    background-color: rgba(217,217,217, .4) !important;
}
</style>