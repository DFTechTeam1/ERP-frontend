<script setup>
import QuotationPreviewDetail from '@/components/QuotationPreviewDetail.vue';
import QuotationList from './QuotationList.vue';
import { ref } from 'vue';
import { useProjectDealStore } from '@/stores/projectDeal';
import { storeToRefs } from 'pinia';

const store = useProjectDealStore();

const { detailOfProjectDeal } = storeToRefs(store);

const emit = defineEmits(['handling-event']);

const showPreviewQuotation = ref(false);

const selectedQuotation = ref({});

const selectedQuotationUid = ref(null);

const detailQuotation = (uid) => {
    let rawQuotation = detailOfProjectDeal.value.quotations.filter(filter => filter.id === uid)[0]
    selectedQuotation.value = detailOfProjectDeal.value.quotations.filter(filter => filter.id === uid)[0].detail;
    selectedQuotation.value.design_job = rawQuotation.design_job;
    selectedQuotationUid.value = detailOfProjectDeal.value.quotations.filter(filter => filter.id === uid)[0].quotation_id;

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

const downloadQuotation = () => {
    window.open(import.meta.env.VITE_BACKEND + `/quotations/download/${selectedQuotationUid.value}/download`, '__blank');
}

defineExpose({
    backToQuotationList,
    downloadQuotation
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