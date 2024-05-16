<template>
  <v-card rounded="10">
    <template v-slot:title>
      <div class="table-action d-flex align-center justify-space-between mb-4">
        <div 
          class="d-flex align-center ga-2"
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
            class="btn-primary"
            size="small"
            @click.prevent="$emit('addDataEvent')"
          >
            <v-icon :icon="mdiPlus" size="20"></v-icon>
            {{ props.btnAddText }}
          </v-btn>
        </div>
      </div>
    </template>

    <v-data-table-server
      :showSelect="props.hasCheckbox"
      v-model="selected"
      v-model:items-per-page="itemTablePerPage"
      :headers="props.headers"
      :items="itemsTable"
      :items-length="props.totalItems"
      :loading="props.loading"
      :search="search"
      :multi-sort="props.multiSort"
      class="table-componenent"
      item-value="name"
      @update:options="updateEventTable"
      return-object
      :show-select="props.hasCheckbox"
      :show-expand="props.isExpand"
    >
      <template v-slot:item="{ item }" v-if="props.fullCustomBody">
        <slot name="bodytable" :value="item" :selecteddata="selected"></slot>
      </template>

      <template v-slot:item.uid="{ value }" v-if="!props.fullCustomBody">
        <slot name="action" :value="value"></slot>

      </template>

      <template v-slot:expanded-row="{ columns, item }" v-if="props.isExpand">
        <tr>
          <td :colspan="columns.length">
            More info about {{ item.name }}
          </td>
        </tr>
      </template>
    </v-data-table-server>
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
  hasFilter: {
    type: Boolean,
    default: true,
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
});

const emit = defineEmits([
  "tableEvent",
  "bulkDeleteEvent",
  "addDataEvent",
  "filterAction",
  "clearFilterAction"
]);

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
.table-componenent {
  max-height: 600px !important;
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
