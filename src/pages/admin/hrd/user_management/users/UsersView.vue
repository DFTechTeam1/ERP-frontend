<template>
  <div>
        <breadcrumb-data
            :title="$t('users')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

      <table-list
          :headers="headers"
          :items="listOfUsers"
          :totalItems="totalItems"
          :loading="loading"
          :itemsPerPage="itemsPerPage"
          :filterSearch="true"
          :has-add-button="useCheckPermission('create_user')"
          :btnAddText="$t('createUser')"
          @bulk-delete-event="bulkDelete"
          @add-data-event="showForm"
          @table-event="initUsers">
          <template v-slot:action="{ value, items }">
            
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
                            v-if="checkEditAction(value, items) && useCheckPermission('edit_user')"
                            class="pointer"
                            @click.prevent="editUser(value)">
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
                            v-if="checkDeleteAction(value, items) && useCheckPermission('delete_user')"
                            @click.prevent="deleteUser(value)">
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
          :title="$t('deleteUser')"
          :text="$t('deleteUserConfirmation')"
          :showConfirm="showConfirmation"
          :deleteIds="selectedIds"
          @action-bulk-submit="doBulkDelete"></confirmation-modal>

        <form-view 
            :is-show="isShowForm"
            :detail="detailData"
            @close-event="closeForm"></form-view>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { mdiCogOutline, mdiPencil, mdiTrashCanOutline } from '@mdi/js';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import FormView from './FormView.vue';
import { useCheckPermission } from '@/compose/checkPermission';

const { t } = useI18n();

const store = useUserStore();

const itemsPerPage = ref(10);

const totalItems = ref(0);

const showConfirmation = ref(false);

const isShowForm = ref(false);

const loading = ref(true);

const detailData = ref(null);

const formTitle = ref(t('createBrand'));

const selectedIds = ref([]);

const { 
  listOfUsers,
  totalOfUsers,
} = storeToRefs(store);

const headers = ref([
  {
      title: t('email'),
      key: 'email',
      align: 'start',
      width: 30,
      sortable: true
  },
  {
      title: t('role'),
      key: 'role_name',
      align: 'start',
      width: 30,
      sortable: true
  },
  {
      title: t('lastLoginAt'),
      key: 'last_login_at',
      align: 'start',
      width: 30,
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
      title: t('userManagement'),
      disabled: true,
      href: 'breadcrumbs_inventory',
  },
  {
      title: t('users'),
      disabled: true,
      href: 'breadcrumbs_link_1',
  },
]);

async function initUsers(payload) {
  loading.value = true;
  await store.initUsers(payload);
  loading.value = false;
  totalItems.value = totalOfUsers.value;
}

async function editUser(uid) {
  formTitle.value = t('editUser');
  detailData.value = await store.detailData({uid: uid});

  if (detailData.value.status < 300) {
      isShowForm.value = true;
      
  }
}

function deleteUser(uid) {
    console.log('uid', uid);
  bulkDelete({value: [{uid: uid}]});
}

function showForm() {
  formTitle.value = t('createBrand');
  isShowForm.value = true;
}

function bulkDelete(payload) {
  showConfirmation.value = true;
  selectedIds.value = payload
}

async function doBulkDelete(payload) {
    console.log('pa', payload);
    let deleteData = await store.bulkDelete(payload.value);

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initUsers();
    }
}

function closeForm() {
    isShowForm.value = false;
    initUsers();
}

function checkDeleteAction(uid, items) {
    var out = true;
    items.forEach((elem) => {
        if (elem.uid == uid) {
            out = elem.is_deleteable;
        }
    })

    return out;
}

function checkEditAction(uid, items) {
    var out = true;
    items.forEach((elem) => {
        if (elem.uid == uid) {
            out = elem.is_editable;
        }
    })

    return out;
}

watch(isShowForm, (value) => {
  if (!value) {
      detailData.value = null;
  }
});
</script>