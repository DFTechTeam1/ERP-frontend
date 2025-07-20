<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import MakePaymentForm from './MakePaymentForm.vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    deal: {
        type: Object,
        default: () => ({})
    },
    remainingBills: {
        default: 0
    }
});

const emit = defineEmits(['close-event']);

const show = ref(false);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

const submitPayment = (payload) => {
    if (payload.isSuccess) {
        emit('close-event', true);
    }
}
</script>

<template>
    <v-dialog v-model="show"
        max-width="800"
        persistent>
        <master-card>
            <v-card-item>
                <v-card-text class="d-flex align-center justify-lg-space-between">
                    <p class="mb-0">{{ $t('makePayment') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event', false)"></v-icon>
                </v-card-text>
            </v-card-item>

            <v-card-text>
                <make-payment-form 
                    :deal="props.deal"
                    :invoice-list="deal.unpaidInvoices"
                    @on-submit="submitPayment"
                    :selected-remaining-bills="props.remainingBills" />
            </v-card-text>
        </master-card>     
    </v-dialog>
</template>