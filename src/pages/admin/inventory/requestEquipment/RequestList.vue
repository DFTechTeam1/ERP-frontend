<template>
    <div>
        <breadcrumb-data
            :title="$t('inventories')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items="listOfRequestEquipments"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="true"
            :btnAddText="$t('createBrand')"
            :has-checkbox="false"
            :custom-status="true"
            :has-add-button="false"
            @table-event="initRequestEquipment">
            <template v-slot:status="{ value }">
                <v-chip
                    density="compact"
                    :color="value.status_color">
                    {{ value.status }}
                </v-chip>
            </template>

            <template v-slot:action="{ value }">
                <v-menu
                    open-on-click>
                    <template v-slot:activator="{ props }">
                    <v-icon
                        v-bind="props"
                        :icon="mdiCogOutline"
                        color="blue"></v-icon>
                    </template>
            
                    <v-list>
                        <v-list-item
                            class="pointer"
                            @click.prevent="detailRequest(value)">
                            <template v-slot:title>
                                <div
                                    class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                    :icon="mdiEye"
                                    size="15"></v-icon>
                                    {{ $t('detail') }}
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </table-list>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoriesStore } from '@/stores/inventories';
import { storeToRefs } from 'pinia';
import { mdiCogOutline, mdiEye } from '@mdi/js';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useInventoriesStore();

const { listOfRequestEquipments } = storeToRefs(store);

const { t } = useI18n();

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('requestEquipment'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

const totalItems = ref(100);

const loading = ref(false);

const itemsPerPage = ref(100);

const headers = ref([
    {
        title: 'Name',
        key: 'name',
        align: 'start',
        width: 30,
        sortable: true
    },
    {
        title: t('projectDate'),
        key: 'project_date',
        align: 'start',
        width: 30,
        sortable: true
    },
    {
        title: t('totalEquipment'),
        key: 'equipment_total',
        align: 'start',
        width: 30,
        sortable: true
    },
    {
        title: t('status'),
        key: 'status',
        align: 'start',
        width: 30,
        sortable: true
    },
    {
        title: 'Action',
        key: 'uid',
        align: 'start',
        width: '50',
        sortable: false
    },
]);

async function initRequestEquipment(payload) {
    loading.value = true;
    await store.requestEquipmentList(payload);
    loading.value = false;
}

function detailRequest(payload) {
    router.push({path: '/admin/inventories/request-equipment/' + payload});
}
</script>