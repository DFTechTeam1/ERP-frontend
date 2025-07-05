<script setup>
import { useProjectDealStore } from '@/stores/projectDeal';
import { storeToRefs } from 'pinia';
import MakePaymentForm from '../components/MakePaymentForm.vue';
import { computed } from 'vue';
import { useEncrypt } from '@/compose/encrypt';

const store = useProjectDealStore();

const { detailOfProjectDeal } = storeToRefs(store);

defineEmits(['update-transaction']);

const invoiceList = computed(() => {
    let output = [];

    const saltKey = import.meta.env.VITE_SALT_KEY;
    var { decodedString } = useEncrypt(detailOfProjectDeal.value.invoices, saltKey);
    output = decodedString;
    return output.filter(filter => filter.need_to_pay);
});
</script>

<template>
    <div class="transaction-box" v-if="!detailOfProjectDeal.is_paid">
        <div class="transaction-box__status">
            <p class="status" :style="{
                color: '#000'
            }">Receive Payment</p>
        </div>

        <div class="transaction-box__customer">
            <make-payment-form
                :invoice-list="invoiceList"
                :deal="detailOfProjectDeal"
                @on-submit="$emit('update-transaction')"
                :selected-remaining-bills="detailOfProjectDeal.remaining_payment_raw" />
        </div>
    </div>
</template>

<style lang="scss" scoped>

.transaction-box {
    border: 1px solid #000000;
    border-color: rgba(0,0,0, .2);
    border-radius: 8px;
    margin-top: 38px;
    
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