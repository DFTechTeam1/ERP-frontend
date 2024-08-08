<template>
    <breadcrumb-data
      :title="$t('projectClass')"
      :breadcrumbs="breadcrumbs"
    ></breadcrumb-data>
    <table-list
      :headers="headers"
      :items="listOfProjectClasses"
      :totalItems="totalItems"
      :loading="loading"
      :itemsPerPage="itemsPerPage"
      :filterSearch="true"
      :btnAddText="$t('createProjectClass')"
      @add-data-event="showForm"
      @bulk-delete-event="bulkDelete"
      @table-event="initProjectClass"
    >
      <template v-slot:action="{ value }">
        <v-menu open-on-click>
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" :icon="mdiCogOutline" color="blue"></v-icon>
          </template>
  
          <v-list>
            <v-list-item class="pointer" @click.prevent="editProjectClass(value)">
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
            <v-list-item class="pointer" @click.prevent="deleteProjectClass(value)">
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
            <field-input
                :label="t('name')"
                v-model="name"
                class="mb-3"
                :error-message="errors.name"></field-input>

            <field-input
                input-type="number"
                :label="t('maximalPoint')"
                v-model="maximal_point"
                :error-message="errors.maximal_point"></field-input>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              height="auto"
              size="small"
              class="btn-secondary pt-3 pb-3 mt-3"
              @click.prevent="closeForm"
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
      :title="$t('deleteProjectClass')"
      :text="$t('deleteProjectClassConfirmation')"
      :showConfirm="showConfirmation"
      :deleteIds="selectedIds"
      @action-bulk-submit="doBulkDelete"
    ></confirmation-modal>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import { storeToRefs } from "pinia";
  import { mdiPencil, mdiTrashCanOutline, mdiCogOutline } from "@mdi/js";
  import * as yup from "yup";
  import { useForm } from "vee-validate";
  import { useError } from "@/compose/handleError";
  import { useI18n } from "vue-i18n";
import { useProjectClassStore } from "@/stores/projectClass";
  
  const { t } = useI18n();
  
  const store = useProjectClassStore();

  const { listOfProjectClasses, totalOfClasses } = storeToRefs(store)
  
  const itemsPerPage = ref(10);
  
  const totalItems = ref(0);
  
  const showConfirmation = ref(false);
  
  const isShowForm = ref(false);
  
  const loading = ref(true);
  
  const detailData = ref(null);
  
  const formTitle = ref(t("createPosition"));
  
  const selectedIds = ref([]);

  const editItem = ref(null)
  
  const isLoading = ref(false);
  
  const { errors, handleSubmit, defineField, resetForm, setErrors, setFieldValue } = useForm({
    validationSchema: yup.object({
      name: yup.string().required(t('nameRequired')),
      maximal_point: yup.string().required(t('maximalPointRequired')),
    }),
  });
  
  const validateData = handleSubmit(async (values) => {
    isLoading.value = true;

    var storeResult;

    if (editItem.value) {
        storeResult = await store.update(values, editItem.value.uid);
    } else {
        storeResult = await store.store(values);
    }
    isLoading.value = false;
  
    useError(storeResult, setErrors);
  
    if (storeResult.status < 300) {
      isShowForm.value = false;
      initProjectClass();
    }
  });
  
  const [name] = defineField("name");
  
  const [maximal_point] = defineField("maximal_point");
  
  const headers = ref([
    {
      title: t('name'),
      key: "name",
      align: "start",
      width: 30,
      sortable: true,
    },
    {
      title: t('maximalPoint'),
      key: "maximal_point",
      align: "start",
      width: 30,
      sortable: true,
    },
    {
      title: t('action'),
      key: "uid",
      align: "start",
      width: "50",
      sortable: false,
    },
  ]);
  
  const breadcrumbs = ref([
    {
      title: t("master"),
      disabled: true,
      href: "#",
    },
    {
      title: t('manageProjectClass'),
      disabled: true,
      href: "#",
    },
  ]);
  
  async function initProjectClass(payload) {
    loading.value = true;
    await store.getList(payload);
    loading.value = false;
    totalItems.value = totalOfClasses.value;
  }
  
  async function editProjectClass(uid) {
    var selected = listOfProjectClasses.value.filter((filter) => {
        return filter.uid == uid
    })

    if (selected.length) {
        editItem.value = selected[0]

        setFieldValue('name', selected[0].name)
        setFieldValue('maximal_point', selected[0].point)

        formTitle.value = t("editProjectClass");
        isShowForm.value = true;
    }
  }
  
  function deleteProjectClass(uid) {
    bulkDelete({ value: [{ uid: uid }] });
  }

  function closeForm() {
    isShowForm.value = false
    editItem.value = null
  }
  
  function showForm() {
    formTitle.value = t("createProjectClass");
    isShowForm.value = true;
  }
  
  function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload;
  }
  
  async function doBulkDelete(payload) {
    payload.value = payload.value.map((elem) => {
        return {uid: elem.uid}
    })
    let deleteData = await store.bulkDelete(payload.value);
  
    if (deleteData.status != undefined && deleteData.status < 300) {
        selectedIds.value = [];
        initProjectClass();
    }
    showConfirmation.value = false;
  }
  
  watch(isShowForm, (value) => {
    if (!value) {
      resetForm();
      detailData.value = null;
    }
  });
  </script>
  