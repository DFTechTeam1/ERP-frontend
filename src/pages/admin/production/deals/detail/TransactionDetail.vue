<script setup>
import { useProjectDealStore } from '@/stores/projectDeal';
import { storeToRefs } from 'pinia';

const store = useProjectDealStore();

const { detailOfProjectDeal } = storeToRefs(store);
</script>

<template>
    <div>
        <v-row v-if="(detailOfProjectDeal) && (detailOfProjectDeal.transactions) && (!detailOfProjectDeal.transactions.length)">
            <v-col cols="12">
                <v-empty-state
                    image="/transactions.jpg"
                    text="No final after has been made yet"></v-empty-state>
            </v-col>
        </v-row>
    </div>
</template>