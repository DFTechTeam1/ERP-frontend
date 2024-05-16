<template>
    <div>
        <div class="body-item">
            <div class="body-title">{{ $t('brand') }}</div>
            <div class="body-value">
                {{ props.info.brand.name }}
            </div>
        </div>
        <div class="body-item">
            <div class="body-title">{{ $t('supplier') }}</div>
            <div class="body-value">
                {{ props.info.supplier ? props.info.supplier.name : '-' }}
            </div>
        </div>
        <div class="body-item">
            <div class="body-title">{{ $t('unit') }}</div>
            <div class="body-value">
                {{ props.info.unit ? props.info.unit.name : '-' }}
            </div>
        </div>
        <div class="body-item">
            <div class="body-title">{{ $t('purchasePrice') }}</div>
            <div class="body-value">
                {{ props.info.purchase_price ? props.info.purchase_price : '-' }}
            </div>
        </div>
        <div class="body-item">
            <div class="body-title">{{ $t('yearOfPurchase') }}</div>
            <div class="body-value">
                {{ props.info.year_of_purchase ? props.info.year_of_purchase : '-' }}
            </div>
        </div>
        <div class="body-item">
            <div class="body-title">{{ $t('warranty') }}</div>
            <div class="body-value">
                {{ props.info.warranty ? props.info.warranty + ' ' + t('year') : '-' }}
            </div>
        </div>
        <div class="body-item">
            <div class="body-title">{{ $t('description') }}</div>
            <div class="body-value">
                <div v-html="props.info.description"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    info: {
        type: Object,
        required: true,
    },
})
</script>

<style scoped>
.body-item {
    margin-bottom: 10px;
    padding-left: 15px;

    .body-title {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
    }

    .body-value {
        padding-left: 4px;
    }
}
</style>