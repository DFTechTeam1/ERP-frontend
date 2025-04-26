<template>
  <v-card rounded="10"
    :class="{
      'no-shadow': !props.hasShadow
    }">
    <v-card-item>
      <v-card-title>
        <div class="table-action mb-4">
          <div
            class="table-action__item"
            v-if="props.hasFilter && !filterSearch">
            <v-btn
              variant="flat"
              color="primary"
              size="small"
              @click.prevent="filterAction"
            >
              <v-icon :icon="mdiFilterCog" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="end"
              >
                {{ filterButtonTooltip }}
              </v-tooltip>
            </v-btn>

            <div
              class="cursor-pointer"
              v-if="showClearFilter"
              @click.prevent="clearFilter">
              <v-icon
                :icon="mdiClose"
                color="red"
                size="20">
              </v-icon>
              <v-tooltip
                activator="parent"
                location="end"
              >
              {{ $t('clearFilter') }}
              </v-tooltip>
            </div>

            <slot name="custom-filter-button" v-if="props.customFilterButton"></slot>
          </div>

          <div class="w-25">
            <div class="table-search-input"
              v-if="filterSearch">
              <input
                type="text"
                class="search"
                v-model="search"
                placeholder="Search by name"
              />
              <v-icon :icon="mdiMagnify" class="icon-search"></v-icon>
            </div>
          </div>

          <div class="d-flex align-center" style="gap: 10px">
            <v-btn
              variant="flat"
              color="warning"
              size="small"
              :disabled="!selected.length"
              @click.prevent="bulkDelete"
              v-if="props.hasCheckbox"
            >
              <v-icon :icon="mdiTrashCanOutline" size="20"></v-icon>
            </v-btn>

            <v-btn
              variant="flat"
              color="primary"
              size="small"
              v-if="props.hasAddButton && !props.hasAddDropdown && props.allowedCreateButton"
              @click.prevent="$emit('addDataEvent')"
            >
              <v-icon :icon="mdiPlus" size="20"></v-icon>
              {{ props.btnAddText }}
            </v-btn>

            <v-btn
              variant="flat"
              color="primary"
              size="small"
              v-if="props.hasAddButton && props.hasAddDropdown"
            >
              <v-icon :icon="mdiPlus" size="20"></v-icon>
              {{ props.btnAddText }}

              <v-menu activator="parent">
                <slot name="addDropdown"></slot>
              </v-menu>
            </v-btn>
          </div>
        </div>

        <div v-if="props.hasFilterMobile"
          class="table-action__item mobile">
          <slot name="custom-filter-button-mobile" v-if="props.customFilterButtonMobile"></slot>
        </div>
      </v-card-title>
      <v-card-subtitle v-if="props.showFilterResult">
        <slot name="filter-result"></slot>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-data-table-server
        :showSelect="props.hasCheckbox"
        v-model="selected"
        v-model:items-per-page="itemTablePerPage"
        :headers="props.headers"
        :items="itemsTable"
        :items-length="props.totalItems"
        :loading="props.loading"
        :loading-text="t('processing')"
        :search="search"
        :multi-sort="props.multiSort"
        class="table-componenent"
        item-value="name"
        @update:options="updateEventTable"
        return-object
        :show-select="props.hasCheckbox"
        :show-expand="props.isExpand"
      >
        <template v-slot:headers="{ headers, isSorted, getSortIcon, toggleSort }" v-if="props.customHeader">
          <slot name="headerTable"
            :headers="headers"
            :isSorted="isSorted"
            :getSortIcon="getSortIcon"
            :toggleSort="toggleSort"></slot>
        </template>

        <template v-slot:item.status="{ item }" v-if="props.customStatus">
          <slot name="status" :value="item"></slot>
        </template>

        <template v-slot:item="{ item }" v-if="props.fullCustomBody">
          <slot name="bodytable" :value="item" :selecteddata="selected"></slot>
        </template>

        <template v-slot:item.uid="{ value }" v-if="!props.fullCustomBody">
          <slot name="action" :value="value" :items="itemsTable"></slot>

        </template>

        <template v-slot:expanded-row="{ columns, item }" v-if="props.isExpand">
          <tr>
            <td :colspan="columns.length">
              More info about {{ item.name }}
            </td>
          </tr>
        </template>
      </v-data-table-server>
    </v-card-text>

  </v-card>
</template>

<script setup>
import { mdiClose, mdiFilterCog, mdiMagnify, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import { watch } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  hasFilterMobile: {
    type: Boolean,
    default: false
  },
  customHeader: {
    type: Boolean,
    default: false,
  },
  customFilterButton: {
    type: Boolean,
    default: false,
  },
  customFilterButtonMobile: {
    type: Boolean,
    default: false,
  },
  showFilterResult: {
    type: Boolean,
    default: false,
  },
  allowedCreateButton: {
    type: Boolean,
    default: true,
  },
  customStatus: {
    type: Boolean,
    default: false,
  },
  hasShadow: {
    type: Boolean,
    default: true,
  },
  hasFilter: {
    type: Boolean,
    default: true,
  },
  hasAddButton: {
    type: Boolean,
    default: true,
  },
  hasAddDropdown: {
    type: Boolean,
    default: false,
  },
  filterSearch: {
    type: Boolean,
    default: false,
  },
  hasCheckbox: {
    type: Boolean,
    default: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  btnAddText: {
    type: String,
    default: "Create",
  },
  multiSort: {
    type: Boolean,
    default: true,
  },
  isExpand: {
    type: Boolean,
    default: false,
  },
  fullCustomBody: {
    type: Boolean,
    default: false,
  },
  showClearFilter: {
    type: Boolean,
    default: false,
  },
  filterTooltip: {
    type: String,
  },
});

const filterButtonTooltip = ref(t('filter'));

const selected = ref([]);
const search = ref("");
const itemTablePerPage = ref(10);
const itemsTable = ref([]);

onMounted(() => {
  itemTablePerPage.value = props.itemsPerPage;

  itemsTable.value = props.items
});

const emit = defineEmits([
  "tableEvent",
  "bulkDeleteEvent",
  "addDataEvent",
  "filterAction",
  "clearFilterAction"
]);

function filterHeaders(headers) {
    var filter = headers.filter((item) => {
        return item.available;
    });
    return filter;
}

function bulkDelete() {
  emit("bulkDeleteEvent", selected);
}

function updateEventTable({ page, itemsPerPage, sortBy }) {
  emit("tableEvent", { page, itemsPerPage, sortBy, search });
}

function filterAction() {
  emit("filterAction");
}

function clearFilter() {
  emit("clearFilterAction");
}

watch(props, (valueItems) => {
  itemsTable.value = valueItems.items;

  if (valueItems.filterTooltip) {
    filterButtonTooltip.value = valueItems.filterTooltip;
  }
})

watch(selected, (value) => {
  var uids = value.map(itemSelected => itemSelected.uid);

  var newArr = props.items.map((item) => {
    item.selected = uids.includes(item.uid);

    item.checked = uids.includes(item.uid);

    return item;
  });

  itemsTable.value = newArr;
})
</script>

<style scoped lang="scss">
.table-action {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

@media screen and (max-width: 578px) {
  .table-action {

    &__item {
      display: block !important;
    }
  }
}

.table-search-input {
  position: relative;
  width: 100%;

  .search {
    width: 100%;
    background-color: transparent;
    border: 1px solid #e6e6e6;
    font-size: 13px;
    padding: 10px 45px 10px 15px;
    line-height: 1.5;
    border-radius: 8px;

    &:focus {
      outline: none !important;
      border-color: #e6e6e6;
    }
  }

  .icon-search {
    position: absolute;
    top: 5px;
    right: 10px;
  }
}
</style>
