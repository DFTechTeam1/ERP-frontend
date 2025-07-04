<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { showNotification } from '@/compose/notification';
import { useFinanceStore } from '@/stores/finance';
import { mdiAsterisk } from '@mdi/js';
import moment from 'moment';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const { defineField, errors, handleSubmit, setFieldValue } = useForm({
    validationSchema: yup.object({
        payment_amount: yup.string().required(t('paymentAmountRequired')),
        transaction_date: yup.string().required(t('dateRequired')),
        note: yup.string().nullable(),
        references: yup.string().nullable(),
        images: yup.array().required()
    }),
    initialValues: {
        transaction_date: moment().format('YYYY, MMMM DD')
    }
});

const [transaction_date] = defineField('transaction_date');
const [payment_amount] = defineField('payment_amount');
const [note] = defineField('note');
const [reference] = defineField('reference');

const store = useFinanceStore();

const emit = defineEmits(['on-submit']);

const props = defineProps({
    selectedRemainingBills: {
        default: 0
    },
    deal: {
        type: Object,
        default: () => ({})
    }
});

const pond = ref(null);

const loading = ref(false);

const myFiles = ref([]);

const remainingBills = computed(() => {
    let output = 0;
    if (props.deal) {
        output = props.deal.remaining_payment_raw;

        if (payment_amount.value) {
            output = props.deal.remaining_payment_raw - payment_amount.value;
        }
    }
    return output;;
});

function handleFilePondInit() {
  // example of instance method call on pond reference
  pond.value;
}

function updateImageValue() {
    var _value = pond.value ? pond.value.getFile().file : '';
    setFieldValue('images', [{image: _value}]);
}

const validateData = handleSubmit(async(values) => {
    let transactionDate = moment(values.transaction_date, 'YYYY, MMMM DD').format('YYYY-MM-DD');
    let formData = new FormData();

    formData.append('payment_amount', values.payment_amount);
    formData.append('transaction_date', transactionDate);
    formData.append('note', values.note == undefined ? '' : values.note);
    formData.append('reference', values.reference == undefined ? '' : values.reference);
    if ((values.images) && (values.images.length)) {
        for (let a = 0; a < values.images.length; a++) {
            formData.append(`images[${a}][image]`, values.images[a].image);
        }
    }

    loading.value = true;
    const resp = await store.createTransaction({payload: formData, quotationId: props.deal.latest_quotation_id, projectDealUid: props.deal.uid});
    loading.value = false;

    const message = resp.status < 300 ? resp.data.message : resp.response.data.message;
    const type = resp.status < 300 ? 'success' : 'error';
    showNotification(message, type);

    emit('on-submit', {isSuccess: resp.status < 300 ? true : false});
});
</script>

<template>
    <v-form @submit.prevent="validateData">
        <v-row>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <currency-input v-model="payment_amount"
                    density="compact"
                    :error-message="errors.payment_amount"
                    class="custom-input"
                    label="Payment Amount"></currency-input>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <date-picker :label="t('paymentDate')" v-model="transaction_date"
                    density="compact"
                    :error-message="errors.transaction_date"></date-picker>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <v-label>Note</v-label>
                <field-input
                    input-type="textarea"
                    :row="3"
                    v-model="note"
                    :is-solo="true"
                    :label="t('note')"></field-input>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <field-input
                    :label="t('references')"
                    v-model="reference"
                    :is-required="false"
                    density="compact"
                    class="custom-input"></field-input>

                <!-- remaining bills -->
                <div class="remain mt-5 d-flex align-center justify-space-between">
                    <p :style="{
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }">Remaining Bills</p>
                    <p :style="{
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }">Rp{{ props.deal ? formatPrice(remainingBills) : 0 }}</p>
                </div>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <v-label class="mb-2">
                    {{ $t("attachments") }}
                    <v-icon
                    :icon="mdiAsterisk"
                    size="8"
                    color="red"></v-icon>
                </v-label>
                <file-pond-com
                    name="test"
                    ref="pond"
                    class-name="my-pond"
                    label-idle="Drop files here..."
                    allow-multiple="true"
                    accepted-file-types="image/jpeg, image/png"
                    v-bind:files="myFiles"
                    v-on:init="handleFilePondInit"
                    v-on:addfile="updateImageValue"
                ></file-pond-com>
                <div :style="{
                    color: 'rgb(176,0,32)',
                    fontSize: '12px',
                }"
                v-if="errors.images">{{ errors.images }}</div>
            </v-col>

            <v-col cols="12">
                <v-btn color="primary" 
                    type="submit"
                    class="mt-5"
                    :disabled="loading">Add Payment</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>