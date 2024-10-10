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
        :custom-filter-button="true"
        :hasCheckbox="false"
        :btnAddText="$t('buildItem')"
        :allowed-create-button="useCheckPermission('create_project')"
        @bulk-delete-event="bulkDelete"
        @add-data-event="buildForm"
        @table-event="getList"
        @filter-action="showFilter"
        @clear-filter-action="clearFilter">

        <template v-slot:bodytable="{ value }">
          <tr>
            <td>
              <p>{{ value.name }}</p>
              <v-chip
                density="compact"
                color="primary"
                class="mt-1 mb-2"
                style="font-size: 12px;">
                {{ value.build_series }}
              </v-chip>
            </td>
            <td>
              {{ value.total_items }} {{ $t('item') }}
            </td>
            <td>
              {{ value.location }}
            </td>
            <td>
              {{ value.total_price }}
            </td>
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
                    class="pointer">
                    <template v-slot:title>
                      <router-link
                        :to="'/admin/inventories/custom/' + value.uid"
                        style="color: #000; font-weight: bold;">
                        <div
                          class="d-flex align-center"
                          style="gap: 8px; font-size: 12px;">
                          <v-icon
                            :icon="mdiEyeCircle"
                            size="15"></v-icon>
                          {{ $t('detail') }}
                        </div>
                      </router-link>
                    </template>
                  </v-list-item>

                  <v-list-item
                    class="pointer">
                    <template v-slot:title>
                      <router-link
                        :to="'/admin/inventories/custom/edit/' + value.uid"
                        style="color: #000; font-weight: bold;">
                        <div
                          class="d-flex align-center"
                          style="gap: 8px; font-size: 12px;">
                          <v-icon
                            :icon="mdiPencil"
                            size="15"></v-icon>
                          {{ $t('edit') }}
                        </div>
                      </router-link>
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>

      </table-list>

      <FilterDialog
        :is-show="showFilterDialog"
        @close-event="closeFilter"></FilterDialog>
    </div>
</template>

<script setup>
import { useCustomInventoriesStore } from '@/stores/customInventories';
import {
  mdiCogOutline,
  mdiEyeCircle, mdiPencil,
} from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';
import {useCheckPermission} from "@/compose/checkPermission";
import TableList from "@/components/TableList.vue";
import FilterDialog from "@/pages/admin/inventory/custom/FilterDialog.vue";

const { t } = useI18n()

const router = useRouter()

const store = useCustomInventoriesStore()

const { listOfInventories, totalOfPagination } = storeToRefs(store)

const page = ref(1)

const showFilterDialog = ref(false);

const showClearFilter = ref(false);

const totalItems = ref(0);

const itemsPerPage = ref(10)

const filterData = ref(null);

const headers = ref([
  {
    title: t('name'),
    key: 'name',
    align: 'start',
    sortable: true
  },
  {
    title: t('totalItem'),
    key: 'name',
    align: 'start',
    sortable: true
  },
  {
    title: t('location'),
    key: 'location',
    align: 'start',
    sortable: true
  },
  {
    title: t('price'),
    key: 'location',
    align: 'start',
    sortable: true
  },
  {
    title: t('action'),
    key: 'uid',
    align: 'start',
    sortable: true
  },
]);

const loading = ref(false)

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('customInventories'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
])

function buildForm() {
    router.push({
        path: '/admin/inventories/custom/create'
    })
}

function showFilter() {
  showFilterDialog.value = true;
}

function clearFilter() {
  filterData.value = null;
  showClearFilter.value = false;
  getList();
}

function closeFilter(payloadFilter) {
  showFilterDialog.value = false;

  if (payloadFilter) {
    filterData.value = payloadFilter
    showClearFilter.value = true;
    getList();
  } else {
    filterData.value = null;
  }
}

async function getList() {
    loading.value = true;
    await store.getList(filterData.value);
    loading.value = false;
}

function bulkDelete(payload) {
}

onMounted(() => {
    getList()
})
</script>
