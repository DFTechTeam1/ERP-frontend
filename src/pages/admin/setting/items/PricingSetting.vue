<script setup>
import { ref } from 'vue';
import PricingSettingForm from './PricingSettingForm.vue';

const headers = ref([
    {
        title: 'Name',
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: 'Country',
        key: 'country',
        align: 'start',
        sortable: true,
        maxWidth: '180px'
    },
    {
        title: 'State',
        key: 'state',
        align: 'start',
        sortable: true,
        maxWidth: '180px'
    },
    {
        title: 'City',
        key: 'city',
        align: 'start',
        sortable: true,
        maxWidth: '200px'
    },
    {
        title: 'Price',
        key: 'price',
        align: 'start',
        sortable: true,
        maxWidth: '180px'
    },
]);

const items = ref([
    {
        id: 1,
        name: 'Surabaya',
        country: 'Indonesia',
        state: 'Jawa Timur',
        city: 'Surabaya',
        price: 'Rp7,500,000'
    },
    {
        id: 2,
        name: 'Jakarta',
        country: 'Indonesia',
        state: 'DKI Jakarta',
        city: 'Jakarta Timur, Jakarta Pusat, Jakarta Barat, Jakarta Utara, Jakarta Selatan',
        price: 'Rp7,500,000'
    },
    {
        id: 3,
        name: 'Luar Jawa',
        country: 'Indonesia, Other than Indonesia',
        state: 'Other than jakarta, surabaya and jawa',
        city: 'Other than jakarta, surabaya and jawa',
        price: 'Rp7,500,000'
    },
]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(10);
const isHaveFilterData = ref(false);

const showForm = ref(false);
</script>

<template>
    <div>
        <pricing-setting-form :is-show="showForm"
            @close-event="showForm = false" />
        <table-list
            :headers="headers"
            :items="items"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :has-filter="false"
            :showClearFilter="isHaveFilterData"
            @add-data-event="showForm = true"></table-list>
    </div>
</template>