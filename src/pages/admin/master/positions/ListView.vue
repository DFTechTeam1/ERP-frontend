<template>
  <breadcrumb-data
    :title="$t('positions')"
    :breadcrumbs="breadcrumbs"
  ></breadcrumb-data>
  <table-list
    :headers="headers"
    :items="listOfPositions"
    :totalItems="totalItems"
    :loading="loading"
    :itemsPerPage="itemsPerPage"
    :filterSearch="true"
    :btnAddText="$t('createPosition')"
    @add-data-event="showForm"
    @bulk-delete-event="bulkDelete"
    @table-event="initPositions"
  >
    <template v-slot:action="{ value }">
      <v-menu open-on-click>
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" :icon="mdiCogOutline" color="blue"></v-icon>
        </template>

        <v-list>
          <v-list-item class="pointer" @click.prevent="editPosition(value)">
            <template v-slot:title>
              <div
                class="d-flex align-center"
                style="gap: 8px; font-size: 12px"
              >
                <v-icon :icon="mdiPencil" size="15"></v-icon>
                Edit
              </div>
            </template>
          </v-list-item>
          <v-list-item class="pointer" @click.prevent="deletePosition(value)">
            <template v-slot:title>
              <div
                class="d-flex align-center"
                style="gap: 8px; font-size: 12px"
              >
                <v-icon :icon="mdiTrashCanOutline" size="15"></v-icon>
                Delete
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </table-list>

  <!-- modal form -->
  <v-dialog v-model="isShowForm" max-width="600" persistent>
    <v-form @submit="validateData">
      <v-card :title="formTitle">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                v-model="name"
                v-bind="nameAttrs"
                :error-messages="errors.name"
                :class="{
                  'mb-3': errors.name,
                }"
                label="Position Name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Select Division"
                v-model="division"
                v-bind="divisionAttrs"
                :items="listDivisionSelect"
                :error-messages="errors.division"
                :class="{
                  'mb-3': errors.name,
                }"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            height="auto"
            size="small"
            class="btn-secondary pt-3 pb-3 mt-3"
            @click.prevent="isShowForm = false"
          >
            <template v-if="isLoading"> Processing ... </template>
            <template v-else> Close </template>
          </v-btn>

          <v-btn
            height="auto"
            type="submit"
            size="small"
            class="btn-primary pt-3 pb-3 mt-3"
          >
            <template v-if="isLoading"> Processing ... </template>
            <template v-else> Save </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <confirmation-modal
    :title="$t('deletePosition')"
    :text="$t('deletePositionConfirmation')"
    :showConfirm="showConfirmation"
    :deleteIds="selectedIds"
    @action-bulk-submit="doBulkDelete"
  ></confirmation-modal>
</template>

<script setup>
import { usePositionStore } from "@/stores/position";
import { useDivisionStore } from "@/stores/division";
import { useMenusStore } from "@/stores/menus";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { mdiPencil, mdiTrashCanOutline, mdiCogOutline } from "@mdi/js";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { useError } from "@/compose/handleError";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const store = usePositionStore();

const divisionStore = useDivisionStore();

const route = useRoute();

const menuStore = useMenusStore();

const itemsPerPage = ref(10);

const totalItems = ref(0);

const showConfirmation = ref(false);

const isShowForm = ref(false);

const loading = ref(true);

const detailData = ref(null);

const formTitle = ref(t("createPosition"));

const selectedIds = ref([]);

let { listOfPositions, totalOfPositions } = storeToRefs(store);

let { listOfDivisions } = storeToRefs(divisionStore);

const isLoading = ref(false);

const { errors, handleSubmit, defineField, resetForm, setErrors } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    division: yup.string().required(),
  }),
});

const validateData = handleSubmit(async (values) => {
  isLoading.value = true;
  values.detailData = detailData.value ? detailData.value.data.data : null;
  values = { ...values, division_id: values.division };
  delete values.division;
  const storeResult = await store.storeData(values);
  isLoading.value = false;

  useError(storeResult, setErrors);

  if (storeResult.status < 300) {
    isShowForm.value = false;
    listDivisionSelect.value = [];
    initPositions();
  }
});

const [name, nameAttrs] = defineField("name");

const [division, divisionAttrs] = defineField("division");

const headers = ref([
  {
    title: "Name",
    key: "name",
    align: "start",
    width: 30,
    sortable: true,
  },
  {
    title: "Division",
    key: "division.name",
    align: "start",
    width: 30,
    sortable: true,
  },
  {
    title: "Action",
    key: "uid",
    align: "start",
    width: "50",
    sortable: false,
  },
]);

const breadcrumbs = ref([
  {
    title: "Master",
    disabled: true,
    href: "#",
  },
  {
    title: "Positions",
    disabled: true,
    href: "#",
  },
]);

async function initPositions(payload) {
  loading.value = true;
  await store.initPositions(payload);
  initDivisions();
  loading.value = false;
  totalItems.value = totalOfPositions.value;
}

async function initDivisions(payload) {
  loading.value = true;
  await divisionStore.initDivisions(payload);
}

async function editPosition(uid) {
  formTitle.value = t("editPosition");
  detailData.value = await store.detailData({ uid: uid });

  if (detailData.value.status < 300) {
    isShowForm.value = true;
    name.value = detailData.value.data.data.name;
    division.value = detailData.value.data.data.division.uid;
  }
}

function deletePosition(uid) {
  bulkDelete({ value: [{ uid: uid }] });
}

function showForm() {
  formTitle.value = t("createPosition");
  isShowForm.value = true;
}

function bulkDelete(payload) {
  showConfirmation.value = true;
  selectedIds.value = payload;
}

async function doBulkDelete(payload) {
  let deleteData = await store.bulkDelete(payload.value);

  if (deleteData.status != undefined && deleteData.status < 300) {
    selectedIds.value = [];
    listDivisionSelect.value = [];
    initPositions();
  }
  showConfirmation.value = false;
}

const listDivisionSelect = ref([]);

watch(listOfDivisions, () => {
  listOfDivisions.value.map((item) => {
    listDivisionSelect.value.push({
      title: item.name,
      value: item.uid,
    });
  });
});

watch(isShowForm, (value) => {
  if (!value) {
    resetForm();
    detailData.value = null;
  }
});

onMounted(() => {
  menuStore.navigateMenu(route.fullPath);
  menuStore.setPathName(
    route.meta.parentData ? route.meta.parentData : route.name
  );
});
</script>
