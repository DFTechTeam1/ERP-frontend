<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const breadcrumbs = ref([
    {
        title: t('projectDeals'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

const headers = ref([
    {
        title: t('date'),
        key: 'project_date',
        align: 'start',
        sortable: true,
        minWidth: '150px'
    },
    {
        title: t('event'),
        key: 'event',
        align: 'start',
        sortable: true
    },
    {
        title: t('marketing'),
        key: 'marketing',
        align: 'start',
        sortable: true
    },
    {
        title: t('venue'),
        key: 'marketing',
        align: 'start',
        sortable: true
    },
    {
        title: t('city'),
        key: 'city',
        align: 'start',
        sortable: true
    },
    {
        title: t('EO'),
        key: 'eo',
        align: 'start',
        sortable: true
    },
    {
        title: t('price'),
        key: 'price',
        align: 'start',
        sortable: true
    },
    {
        title: t('DP'),
        key: 'dp',
        align: 'start',
        sortable: true
    },
    {
        title: t('remainingPayment'),
        key: 'remaining_payment',
        align: 'start',
        sortable: true
    },
    {
        title: t('status'),
        key: 'status',
        align: 'start',
        sortable: true
    },
    {
        title: t('action'),
        key: 'action',
        align: 'start',
        sortable: true
    },
]);

const loading = ref(false);

const items = ref([
    {
        id: 1,
        project_date: "21 Jan 2025",
        event: "Tifannys Birthday GSJS",
        marketing: "Charles",
        venue: "The Suri - Queen City Mall",
        city: 'Jakarta',
        eo: "Fairytale",
        price: "Rp120,000,000",
        dp: "Rp10,000,000",
        remaining_payment: "Rp100,000,000",
        status: 1,
        status_badge: "success"
    }
])
</script>

<template>
    <div>
        <breadcrumb-data
            :title="$t('projectDeals')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items-per-page="10"
            :total-items="0"
            :loading="loading"
            :has-checkbox="false"
            :items="items"
            :custom-status="true">
            <template v-slot:status="{ item }">
                <v-chip color="primary">Paid</v-chip>
            </template>
        </table-list>
    </div>
</template>