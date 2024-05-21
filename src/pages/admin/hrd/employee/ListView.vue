<template>
    <div>
        <breadcrumb-data
            :title="$t('employees')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items="listOfEmployees"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="false"
            :showClearFilter="showClearFilter"
            :fullCustomBody="true"
            :hasCheckbox="false"
            :btnAddText="$t('createEmployee')"
            :filter-tooltip="t('filterEmployee')"
            @bulk-delete-event="bulkDelete"
            @add-data-event="showForm"
            @table-event="initEmployees"
            @filter-action="showFilter"
            @clear-filter-action="clearFilter">

            <template v-slot:bodytable="{ value }">
                <tr>
                    <td>
                        <div class="d-flex align-center ga-4">
                            <v-avatar
                                :image="'/user.png'"
                                size="40"></v-avatar>
                            <div>
                                <p class="fw-bold">{{ value.name }}</p>
                                <p class="email">{{ value.email }}</p>
                            </div>
                        </div>
                    </td>
                    <td>{{ value.position }}</td>
                    <td>{{ value.employee_id }}</td>
                    <td>{{ value.level_staff }}</td>
                    <td>
                        <div>
                            <v-chip
                                :color="value.status_color">
                                {{ value.status }}
                            </v-chip>
                        </div>
                    </td>
                    <td>{{ value.join_date }}</td>
                    <td>{{ value.phone }}</td>
                    <td>{{ value.placement }}</td>
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
                                    @click.prevent="editEmployee(value.uid)">
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
                                    @click.prevent="addAsUser(value.uid)"
                                    v-if="!value.user">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiAccountPlus"
                                            size="15"></v-icon>
                                            {{ $t('addAsUser') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    @click.prevent="deleteEmployee(value.uid)">
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
            :title="$t('deleteEmployee')"
            :text="$t('deleteEmployeeConfirmation')"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>

        <add-as-user-view
            :is-show="showConfirmationAddtoUser"
            :employee_id="selectedAddUserId"
            @close-form-add-user="closeFormAddUser"></add-as-user-view>

        <filter-employee 
            :show="isShowFilter"
            @filter-event="doFilter"
            @close-event="cancelFilter"></filter-employee>
    </div>
</template>

<style scoped lang="scss">
.email {
    font-size: 11px;
}
</style>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEmployeesStore } from '@/stores/employees'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { 
    mdiCogOutline, 
    mdiEyeCircle, 
    mdiPencil, 
    mdiTrashCanOutline,
    mdiAccountPlus
 } from '@mdi/js';
import FilterEmployee from './FilterEmployee.vue';
import AddAsUserView from './AddAsUser.vue';

const { t } = useI18n();

const router = useRouter();

const store = useEmployeesStore();

const { 
    listOfEmployees,
    totalOfEmployees,
 } = storeToRefs(store);

const showConfirmation = ref(false);
const showConfirmationAddtoUser = ref(false);
const selectedIds = ref([]);
const selectedAddUserId = ref(null);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const loading = ref(true);
const showClearFilter = ref(false);
const isShowFilter = ref(false);
const searchParam = ref(null);
const breadcrumbs = ref([
    {
        title: t('employees'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);
const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: t('position'),
        key: 'position',
        align: 'start',
        // width: 15,
        sortable: true
    },
    {
        title: t('nip'),
        key: 'nip',
        align: 'start',
        // width: 15,
        sortable: true
    },
    {
        title: t('level'),
        key: 'level',
        align: 'start',
        // width: 15,
        sortable: true
    },
    {
        title: t('status'),
        key: 'status',
        align: 'start',
        // width: 15,
        sortable: true
    },
    {
        title: t('joinDate'),
        key: 'joinDate',
        align: 'start',
        // width: 15,
        sortable: true
    },
    {
        title: t('phone'),
        key: 'phone',
        align: 'start',
        // width: 15,
        sortable: true
    },
    {
        title: t('placement'),
        key: 'placement',
        align: 'start',
        // width: 15,
        sortable: true
    },
    {
        title: t('action'),
        key: 'action',
        align: 'start',
        width: '50',
        sortable: false
    },
]);

function showForm() {
    router.push({path: '/admin/employees/create'});
}

function deleteEmployee(uid) {
    bulkDelete({value: [{uid: uid}]});
}

async function doAddUser(payload) {
    console.log('payload add user', payload);

    await store.addToUser(payload);
    showConfirmationAddtoUser.value = false;
}

async function doBulkDelete(payload) {
    let deleteData = await store.bulkDelete(payload.value);

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initEmployees();
    }
}

async function initEmployees(payload = '') {
    if (payload == '' && searchParam.value != '') {
        payload = {filter: searchParam.value}
    } else if (payload != '' && searchParam.value != '') {
        payload.filter = searchParam.value;
    }

    loading.value = true;
    await store.initEmployees(payload);
    loading.value = false;
    totalItems.value = totalOfEmployees.value;
}

function addAsUser(id) {
    showConfirmationAddtoUser.value = true;
    selectedAddUserId.value = id;
}

function closeFormAddUser(payload) {
    console.log('payload ref', payload);
    showConfirmationAddtoUser.value = false;
    selectedAddUserId.value = null;

    if (payload.refresh) {
        initEmployees();
    }
}

function editEmployee(uid) {
    router.push({path: '/admin/employees/edit/' + uid});
}

function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload
}

function showFilter() {
    isShowFilter.value = true;
}

function clearFilter() {
    searchParam.value = '';
    initEmployees();
    showClearFilter.value = false;
}

function doFilter(payload) {
    searchParam.value = payload;
    initEmployees();
    isShowFilter.value = false;
    showClearFilter.value = true;
}

function cancelFilter() {
    searchParam.value = null;
    isShowFilter.value = false;
    showClearFilter.value = false;
}
</script>