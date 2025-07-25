<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { showNotification } from '@/compose/notification';
import { useFinanceStore } from '@/stores/finance';
import { useProjectDealStore } from '@/stores/projectDeal';
import { mdiClose } from '@mdi/js';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import * as yup from 'yup';

const { t } = useI18n();

const store = useProjectDealStore();

const financeStore = useFinanceStore();

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
    },
    currentInvoice: {
        type: Object,
        value: {}
    }
});

const emit = defineEmits(['close-event', 'update-transaction']);

const route = useRoute();

const { defineField, errors, resetForm, handleSubmit, setFieldError, setFieldValue } = useForm({
    validationSchema: yup.object({
        amount: yup.string().required(t('paymentAmountRequired')),
        transaction_date: yup.string().required(),
        is_down_payment: yup.boolean().default(false)
    })
});

const [amount] = defineField('amount');
const [transaction_date] = defineField('transaction_date');
const [is_down_payment] = defineField('is_down_payment');

const show = ref(false);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        if (values.currentInvoice) {
            if (Object.keys(values.currentInvoice).length) {
                setFieldValue('amount', values.currentInvoice.amount);

                setFieldValue('transaction_date', moment(values.currentInvoice.billing_date, 'DD MMMM YYYY').format('YYYY, MMMM DD'));
            }
        }
    }
});

const generateInvoice = handleSubmit(async (values) => {
    // validate
    if (values.amount > detailOfProjectDeal.value.final_quotation.remaining) {
        setFieldError('amount', `Cannot create invoice more than ${detailOfProjectDeal.value.final_quotation.remaining.toLocaleString()}`);
        return;
    }

    let transactionDate = moment(values.transaction_date, 'YYYY, MMMM DD').format('YYYY-MM-DD');
    values.transaction_date = transactionDate;

    let resp = null;

    if (props.currentInvoice == undefined || props.currentInvoice == null) {
        resp = await financeStore.generateBillInvoice(values, route.params.id);
    } else {
        values.invoice_uid = props.currentInvoice.uid;
        values.payment_date = values.transaction_date;
        resp = await financeStore.updateInvoice(values);
    }

    if (resp.status < 300) {
        resetForm();
        emit('update-transaction');

        if (resp.data.data.url) {
            window.open(resp.data.data.url, '__blank');
        }
    } else {
        showNotification(resp.response.data.message, 'error');
    }
});

const closeForm = () => {
    resetForm();
    emit('close-event', false);
};
</script>

<template>
    <v-dialog
        :persistent="true"
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
                        @click.prevent="closeForm()"></v-icon>
                </v-card-text>
            </v-card-item>

            <v-card-text>
                <v-form @submit.prevent="generateInvoice">
                    <currency-input v-model="amount"
                        density="compact"
                        :error-message="errors.amount"
                        class="custom-input"
                        label="Payment Amount"></currency-input>

                    <date-picker :label="t('paymentDate')" v-model="transaction_date"
                        class="mt-5"
                        density="compact"
                        :error-message="errors.transaction_date"></date-picker>

                    <v-switch label="Down Payment Invoice?" color="primary" v-model="is_down_payment"></v-switch>

                    <div class="d-flex items-center justify-end mb-3">
                        <p :style="{
                            fontSize: '12px'
                        }">Remaining Amount <span :style="{fontWeight: 'bold', fontSize: '13px'}">{{ formatPrice(props.remainingPayment) }}</span></p>
                    </div>
    
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