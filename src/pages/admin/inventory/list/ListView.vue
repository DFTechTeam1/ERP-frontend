<template>
    <div>
        <breadcrumb-data
            :title="$t('inventories')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items="listOfInventories"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="false"
            :showClearFilter="showClearFilter"
            :fullCustomBody="true"
            :hasCheckbox="false"
            :btnAddText="$t('createInventory')"
            @bulk-delete-event="bulkDelete"
            @add-data-event="showForm"
            @table-event="initInventories"
            @filter-action="showFilter"
            @clear-filter-action="clearFilter">

            <template v-slot:bodytable="{ value }">
                <tr>
                    <td>
                        <div class="d-flex align-center ga-4">
                            <v-avatar
                                :image="value.image"
                                size="40"></v-avatar>
                            <p class="fw-bold">{{ value.name }}</p>
                        </div>
                    </td>
                    <td>
                        <div>
                            <p>{{ value.stock }}</p>
                        </div>
                    </td>
                    <td>
                        <template
                            v-if="value.items.length">
                            <div>
                                <v-chip 
                                    v-for="(location, keyLocation) in value.locations"
                                    :key="keyLocation"
                                    class="mb-2 mt-1" 
                                    density="compact" 
                                    :color="location.color">
                                    {{ location.text }}
                                </v-chip>
                            </div>
                            <!-- <div
                                v-for="(location, keyLocation) in value.items"
                                :key="keyLocation">
                                <v-chip
                                    :color="location.location_badge"
                                    variant="flat"
                                    density="compact">
                                    1 {{ location.location }}
                                </v-chip>
                            </div> -->
                        </template>
                        <template v-else>-</template>
                    </td>
                    <td>{{ value.brand }}</td>
                    <td>{{ value.year_of_purchase }}</td>
                    <td>{{ value.purchase_price }}</td>
                    <td>{{ value.warranty }}</td>
                    <td>
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
                                    @click.prevent="editInventory(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiPencil"
                                            size="15"></v-icon>
                                            {{ $t('edit') }}
                                        </div>
                                    </template>
                                </v-list-item>

                                <v-list-item
                                    class="pointer"
                                    @click.prevent="detailInventory(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiEyeCircle"
                                            size="15"></v-icon>
                                            {{ $t('detail') }}
                                        </div>
                                    </template>
                                </v-list-item>

                                <v-list-item
                                    class="pointer"
                                    @click.prevent="showListItem(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiFileMultiple"
                                            size="15"></v-icon>
                                            {{ $t('viewListItem') }}
                                        </div>
                                    </template>
                                </v-list-item>

                                <v-list-item
                                    class="pointer"
                                    @click.prevent="deleteInventory(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiTrashCanOutline"
                                            size="15"></v-icon>
                                            {{ $t('delete') }}
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>
            
        </table-list>

        <confirmation-modal
            :title="$t('deleteInventory')"
            :text="$t('deleteInventoryConfirmation')"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>

        <!-- filter modal -->
        <filter-inventory
            :show="isShowFilter"
            @filter-event="doFilter"
            @close-event="cancelFilter"></filter-inventory>
        <!-- filter modal -->

        <!-- Detail Item List Item -->
        <list-item
            :is-show-modal="isShowDetailItem"
            :parent-uid="parentUid"
            @close-detail-item="closeDetailItem"></list-item>
        <!-- End Detail Item List Item -->
    </div>
</template>

<script setup>
import { useInventoriesStore } from '@/stores/inventories'
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { mdiCogOutline, mdiEyeCircle, mdiFileMultiple, mdiPencil, mdiTrashCanOutline } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import FilterInventory from './FilterView.vue'
import ListItem from './ListItem.vue'

const router = useRouter();

const { t } = useI18n();

const store = useInventoriesStore();

const itemsPerPage = ref(10);

const totalItems = ref(0);

const showConfirmation = ref(false);

const isShowFilter = ref(false);

const isShowDetailItem = ref(false);

const parentUid = ref(null);

const loading = ref(true);

const selectedIds = ref([]);

const searchParam = ref(null);

const showClearFilter = ref(false);

const { 
    listOfInventories,
    totalOfInventories,
 } = storeToRefs(store);

const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        width: 30,
        sortable: true
    },
    {
        title: t('stock'),
        key: 'stock',
        align: 'start',
        width: 15,
        sortable: true
    },
    {
        title: t('itemLocation'),
        key: 'stock',
        align: 'start',
        width: 15,
        sortable: true
    },
    {
        title: t('brandName'),
        key: 'brand',
        align: 'start',
        width: 15,
        sortable: true
    },
    {
        title: t('yearOfPurchase'),
        key: 'year_of_purchase',
        align: 'start',
        width: 15,
        sortable: true
    },
    {
        title: t('purchasePrice'),
        key: 'purchase_price',
        align: 'start',
        width: 15,
        sortable: true
    },
    {
        title: t('warranty'),
        key: 'warranty',
        align: 'start',
        width: 15,
        sortable: true
    },
    {
        title: t('action'),
        key: 'uid',
        align: 'start',
        width: '50',
        sortable: false
    },
]);

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('inventories'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

function cancelFilter() {
    searchParam.value = null;
    isShowFilter.value = false;
    showClearFilter.value = false;
}

function doFilter(payload) {
    searchParam.value = payload;
    initInventories();
    isShowFilter.value = false;
    showClearFilter.value = true;
}

function clearFilter() {
    searchParam.value = '';
    initInventories();
    showClearFilter.value = false;
}

async function initInventories(payload = '') {
    if (payload == '' && searchParam.value != '') {
        payload = {filter: searchParam.value}
    } else if (payload != '' && searchParam.value != '') {
        payload.filter = searchParam.value;
    }

    loading.value = true;
    await store.initInventories(payload);
    loading.value = false;
    totalItems.value = totalOfInventories.value;
}

function detailInventory(uid) {
    router.push({path: '/admin/inventories/' + uid});
}

function closeDetailItem () {
    isShowDetailItem.value = false;
    parentUid.value = null;
}

function showListItem(uid) {
    isShowDetailItem.value = true;
    parentUid.value = uid;
}

async function editInventory(uid) {
    router.push({path: '/admin/inventories/edit/' + uid});
}

function deleteInventory(uid) {
    bulkDelete({value: [{uid: uid}]});
}

function showForm() {
    router.push({path: '/admin/inventories/create'});
}

function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload
}

function showFilter() {
    isShowFilter.value = true;
}

async function doBulkDelete(payload) {
    let deleteData = await store.bulkDelete(payload.value);

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initInventories();
    }
}
</script>