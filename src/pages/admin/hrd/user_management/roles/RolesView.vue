<template>
    <div>
      <breadcrumb-data
        :title="$t('users')"
        :breadcrumbs="breadcrumbs"></breadcrumb-data>
      
      <table-list
        :headers="headers"
        :items="listOfRoles"
        :totalItems="totalItems"
        :loading="loading"
        :itemsPerPage="itemsPerPage"
        :filterSearch="true"
        :btnAddText="$t('createRole')"
        @bulk-delete-event="bulkDelete"
        @add-data-event="showForm"
        @table-event="initRoles">
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
                        @click.prevent="editRole(value)">
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
                        @click.prevent="deleteRole(value)">
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
            :title="$t('deleteRole')"
            :text="$t('deleteRoleConfirmation')"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';
import { useRoleStore } from '@/stores/role'
import { storeToRefs } from 'pinia';
import { mdiCogOutline, mdiPencil, mdiTrashCanOutline } from '@mdi/js';
import { useRouter } from 'vue-router'

const router = useRouter();

const { t } = useI18n();

const store = useRoleStore();

const loading = ref(false);

const totalItems = ref(0);

const itemsPerPage = ref(10);

const showConfirmation = ref(false);

const selectedIds = ref([]);

const { listOfRoles, totalOfRoles } = storeToRefs(store);

const breadcrumbs = ref([
  {
      title: t('userManagement'),
      disabled: true,
      href: 'breadcrumbs_inventory',
  },
  {
      title: t('role'),
      disabled: true,
      href: 'breadcrumbs_link_1',
  },
]);

const headers = ref([
  {
      title: t('name'),
      key: 'name',
      align: 'start',
      width: 30,
      sortable: true
  },
  {
      title: t('action'),
      key: 'uid',
      align: 'start',
      width: 30,
      sortable: true
  },
])

async function initRoles(payload = '') {
    loading.value = true;
    await store.initRoles(payload);
    loading.value = false;
    totalItems.value = totalOfRoles.value;
}

function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload
}

function editRole(id) {
  router.push({path: '/admin/user-management/roles/edit/' + id});
}

function deleteRole(id) {
  bulkDelete({value: [{uid: id}]});
}

async function doBulkDelete(payload) {
    let deleteData = await store.bulkDelete(payload.value);

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initRoles();
    }
}

function showForm() {
  router.push({path: '/admin/user-management/roles/create'});
}
</script>
  