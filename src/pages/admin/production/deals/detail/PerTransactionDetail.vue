<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';

defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    transaction: {
        type: Object
    }
});

const showDetailImage = ref(false);

const show = ref(false);

const selectedImage = ref(null);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

const detailImage = (indexImage) => {
    selectedImage.value = props.transaction.images.find((val, index) => {
        return index == indexImage
    });
    console.log('selectedImage', selectedImage.value);
    showDetailImage.value = true;
};
</script>

<template>
    <v-dialog v-model="show"
        persistent
        max-width="468">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('detailTransaction') }}

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <!-- dialog image detail -->
                <v-dialog v-model="showDetailImage"
                    width="100%"
                    max-width="400">
                    <master-card>
                        <v-card-text>
                            <v-img :src="selectedImage"
                                :width="400"
                                cover></v-img>
                        </v-card-text>
                    </master-card>
                </v-dialog>

                <div class="transaction-wrapper" v-if="props.transaction">
                    <p class="transaction-wrapper__title">Payment</p>

                    <p class="transaction-wrapper__amount">
                        Rp{{ formatPrice(props.transaction.payment_amount) }}
                    </p>

                    <div class="transaction-wrapper__detail">
                        <div class="transaction-wrapper__detail__item">
                            <p>Payment</p>
                            <p>#Invoice {{ props.transaction.invoice.number }}</p>
                        </div>
                        <div class="transaction-wrapper__detail__item">
                            <p>Customer</p>
                            <p>{{ props.transaction.customer.name }}</p>
                        </div>
                        <div class="transaction-wrapper__detail__item">
                            <p>Invoice Date</p>
                            <p>{{ props.transaction.invoice_date }}</p>
                        </div>
                        <div class="transaction-wrapper__detail__item">
                            <p>Payment Date</p>
                            <p>{{ props.transaction.payment_date }}</p>
                        </div>

                        <div class="transaction-wrapper__detail__item">
                            <template v-for="(img, i) in props.transaction.images"
                                :key="i">
                                <v-img :src="img"
                                    aspect-ratio="4/3"
                                    class="pointer"
                                    @click.prevent="detailImage(i)"
                                    :max-width="50"></v-img>
                            </template>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </master-card>    
    </v-dialog>
</template>

<style lang="scss" scoped>
.transaction-wrapper {
    &__title {
        font-weight: bold;
        font-size: 24px;
        margin-bottom: 25px;
    }

    &__amount {
        font-size: 20px;
        margin-bottom: 25px;
    }

    &__detail {
        &__item {
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            p:last-child {
                font-weight: bold;
            }
        }
    }
}
</style>