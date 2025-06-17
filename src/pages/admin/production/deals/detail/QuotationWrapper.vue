<script setup>
import { mdiDownload } from '@mdi/js';
import QuotationPreviewDetail from '@/components/QuotationPreviewDetail.vue';
import QuotationList from './QuotationList.vue';
import { ref } from 'vue';
import { useProjectDealStore } from '@/stores/projectDeal';
import { storeToRefs } from 'pinia';

const store = useProjectDealStore();

const { detailOfProjectDeal } = storeToRefs(store);

const emit = defineEmits(['handling-event']);

const quotationList = ref([
    {
        id: 1,
        quotation_number: "#DF01095",
        name: "Wedding Anniv Mr Budi Mrs The Lee Lee",
        venue: "Ballroom Arilla, Makassar",
        price: 120000000,
        is_final: false
    },
    {
        id: 2,
        quotation_number: "#DF01096",
        name: "Wedding Anniv Mr Budi Mrs The Lee Lee",
        venue: "Ballroom Arilla, Makassar",
        price: 100000000,
        is_final: true
    },
]);

const showPreviewQuotation = ref(false);

const selectedQuotation = ref({});

const detailQuotation = (uid) => {
    selectedQuotation.value = detailOfProjectDeal.value.quotations.filter(filter => filter.id === uid)[0].detail;

    console.log('selectedQuotation.value', selectedQuotation.value);

    showPreviewQuotation.value = true;
    
    emit('handling-event', {
        type: "showButton",
        target: 'back',
        value: true
    });
};

const backToQuotationList = () => {
    showPreviewQuotation.value = false;
}

defineExpose({
    backToQuotationList
});
</script>

<template>
    <div class="quotation-wrapper">
        <quotation-preview-detail 
            v-if="showPreviewQuotation"
            :quotation="selectedQuotation" />

        <template v-for="(item, i) in detailOfProjectDeal.quotations" :key="i">
            <quotation-list
                v-if="!showPreviewQuotation"
                :project="item"
                @click-event="detailQuotation"></quotation-list>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.quotation-wrapper {
    padding: 0 40px;
    margin-top: 15px;
}
</style>