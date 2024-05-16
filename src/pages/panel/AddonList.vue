<template>
    <div>
        <breadcrumb-data
            :title="$t('addons')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items="listOfAddons"
            :totalItems="totalOfAddon"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="true"
            :btnAddText="$t('createAddon')"
            @bulk-delete-event="bulkDelete"
            @add-data-event="showForm"
            @table-event="initAddons">
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
                            @click.prevent="editAddon(value)">
                            <template v-slot:title>
                                <div
                                    class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                    :icon="mdiPencil"
                                    size="15"></v-icon>
                                    {{ $t('upgradeAddon') }}
                                </div>
                            </template>
                        </v-list-item>
                        <v-list-item
                            class="pointer"
                            @click.prevent="deleteSupplier(value)">
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
            </template>
        </table-list>

        <confirmation-modal
            title="Delete Addon"
            text="Are you sure to delete this addon?"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>

        <upgrade-form
            :is-show="showUpgradeForm"
            :detail="detailId"
            @close-event-upgrade="closeUpgradeForm"></upgrade-form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAddonStore } from '@/stores/addon';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { mdiCogOutline, mdiPencil, mdiTrashCanOutline } from '@mdi/js';
import UpgradeForm from './UpgradeForm.vue';

const router = useRouter();

const store = useAddonStore();

const { t } = useI18n();

const headers = ref([
    {
        title: 'Name',
        key: 'name',
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

const { listOfAddons, totalOfAddon } = storeToRefs(store);

const addons = ref([]);

const loading = ref(false);

const showUpgradeForm = ref(false);

const showConfirmation = ref(false);

const selectedIds = ref([]);

const detailId = ref(null);

const itemsPerPage = ref(10);

const breadcrumbs = ref([
    {
        title: t('addons'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('addonList'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

function showForm() {
    router.push({path: '/panel/addons/create'});
}

function editAddon(id) {
    // router.push({path: '/panel/addons/edit/' + id});
    showUpgradeForm.value = true;
    detailId.value = id;
}

async function initAddons(payload) {
    loading.value = true;
    addons.value = store.initAddons(payload);
    loading.value = false;
    // totalItems.value = totalOfInventoryTypes.value;
}

function deleteSupplier(uid) {
    bulkDelete({value: [{uid: uid}]});
}

function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload
}

async function doBulkDelete(payload) {
    let deleteData = await store.bulkDelete(payload.value);

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initAddons();
    }
}

function closeUpgradeForm() {
    showUpgradeForm.value = false;
    detailId.value = null;
}
</script>