<template>
    <v-dialog
        v-model="showModal"
        max-width="500"
        persistent>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between">
                    <span>{{ $t('filterInventory') }}</span>
                    <v-icon
                        :icon="mdiClose"
                        class="cursor-pointer"
                        @click.prevent="closeFilter"></v-icon>
                </div>
            </v-card-title>
            <v-card-text>
                <v-form @submit="doFilter">
                    <field-input
                        v-model="name"
                        :isRequired="false"
                        :errorMessage="errors.name"
                        :label="t('name')"></field-input>

                    <v-row>
                        <v-col 
                            md="5"
                            lg="5">
                            <field-input
                                inputType="select"
                                :isRequired="false"
                                :label="t('stock')"
                                :errorMessage="errors.stockCondition"
                                v-model="stockCondition"
                                :selectOptions="stockConditions"></field-input>
                        </v-col>
                        <v-col
                            md="7"
                            lg="7">
                            <field-input
                                v-model="quantity"
                                :isRequired="false"
                                :label="t('quantity')"></field-input>
                        </v-col>
                    </v-row>

                    <field-input
                        v-model="brand"
                        :isRequired="false"
                        :label="t('brand')"></field-input>

                    <year-picker 
                        v-model="yearOfPurchase"
                        :isRequired="false"
                        :label="t('yearOfPurchase')"/>

                        <v-row>
                            <v-col 
                                md="5"
                                lg="5">
                                <field-input
                                    inputType="select"
                                    :isRequired="false"
                                    :label="t('purchasePrice')"
                                    v-model="purchasePriceCondition"
                                    :selectOptions="stockConditions"></field-input>
                            </v-col>
                            <v-col
                                md="7"
                                lg="7">
                                <field-input
                                    :isRequired="false"
                                    v-model="purchasePrice"
                                    :label="t('price')"></field-input>
                            </v-col>
                        </v-row>

                        <field-input
                            v-model="warranty"
                            :isRequired="false"
                            :suffixText="t('year')"
                            :label="t('warranty')"></field-input>

                    <v-btn
                        width="100%"
                        type="submit"
                        color="primary">
                        {{ $t('search') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { mdiClose } from '@mdi/js';

const { t } = useI18n()

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['filterEvent', 'closeEvent']);

const stockConditions = ref([
    {value: 'more_than', title: t('moreThan')},
    {value: 'equal', title: t('equal')},
    {value: 'less_than', title: t('lessThan')},
])

const { errors, resetForm, defineField, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().nullable(),
        quantity: yup.string().nullable(),
        stockCondition: yup.string().nullable(),
        brand: yup.string().nullable(),
        yearOfPurchase: yup.string().nullable(),
        purchasePriceCondition: yup.string().nullable(),
        purchasePrice: yup.string().nullable(),
        warranty: yup.string().nullable(),
    })
})

const showModal = ref(false);
const [name] = defineField('name');
const [stockCondition] = defineField('stockCondition');
const [quantity] = defineField('quantity');
const [brand] = defineField('brand');
const [yearOfPurchase] = defineField('yearOfPurchase');
const [purchasePriceCondition] = defineField('purchasePriceCondition');
const [purchasePrice] = defineField('purchasePrice');
const [warranty] = defineField('warranty');

const doFilter = handleSubmit((values) => {
    console.log('values', values);
    resetForm();
    emit('filterEvent', values);
})

function closeFilter() {
    resetForm();

    emit('closeEvent');
}

// function doFilter() {
//     emit('filterEvent', {
//         name: name.value,
//         stock: {
//             condition: stockCondition.value,
//             quantity: quantity.value,
//         },
//         brand: brand.value,
//         year_of_purchase: yearOfPurchase.value,
//         price: {
//             condition: purchasePriceCondition.value,
//             price: purchasePrice.value,
//         },
//         warranty: warranty.value,
//     })

//     name.value = '';
//     stockCondition.value = '';
//     quantity.value = '';
//     brand.value = '';
//     yearOfPurchase.value = '';
//     purchasePriceCondition.value = '';
//     purchasePrice.value = '';
//     warranty.value = '';
// }

watch(props, (values) => {
    showModal.value = values.show
})
</script>