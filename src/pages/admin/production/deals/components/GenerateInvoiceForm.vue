<script setup>
import { useProjectDealStore } from '@/stores/projectDeal';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import * as yup from 'yup';

const { t } = useI18n();

const store = useProjectDealStore();

const {
    detailOfProjectDeal
} = storeToRefs(store);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    remainingPayment: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['close-event']);

const route = useRoute();

const { defineField, errors, resetForm, handleSubmit, setFieldError } = useForm({
    validationSchema: yup.object({
        payment_amount: yup.string().required(t('paymentAmountRequired')),
        payment_date: yup.string().required()
    })
});

const [payment_amount] = defineField('payment_amount');
const [payment_date] = defineField('payment_date');

const show = ref(false);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

const generateInvoice = handleSubmit(async (values) => {
    // validate
    if (values.payment_amount > detailOfProjectDeal.value.final_quotation.remaining) {
        setFieldError('payment_amount', `Cannot create invoice more than ${detailOfProjectDeal.value.final_quotation.remaining.toLocaleString()}`);
        return;
    }

    emit('close-event');

    let url = import.meta.env.VITE_BACKEND + `/deal-invoice/download/${route.params.id}/download`;
    url += '?amount=' + values.payment_amount;
    url += '&date=' + values.payment_date;
    resetForm();
    window.open(url, '__blank');
});
</script>

<template>
    <v-dialog
        v-model="show"
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-text class="d-flex align-center justify-lg-space-between">
                    <p class="mb-0">{{ $t('requestInvoice') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event', false)"></v-icon>
                </v-card-text>
            </v-card-item>

            <v-card-text>
                <v-form @submit.prevent="generateInvoice">
                    <currency-input v-model="payment_amount"
                        density="compact"
                        :error-message="errors.payment_amount"
                        class="custom-input"
                        label="Payment Amount"></currency-input>

                    <date-picker :label="t('paymentDate')" v-model="payment_date"
                        class="mt-5"
                        density="compact"
                        :error-message="errors.payment_date"></date-picker>
    
                    <div class="d-flex items-center justify-end">
                        <v-btn
                            color="primary"
                            class="mt-3"
                            variant="flat"
                            type="submit">
                            {{ $t('generate') }}
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>