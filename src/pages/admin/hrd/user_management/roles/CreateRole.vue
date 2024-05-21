<template>
    <div>
        <breadcrumb-data
            :title="$t('role')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ title }}</v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form class="mt-5" @submit="validateData">
                    <field-input
                        :label="t('name')"
                        v-model="name"
                        :error-message="errors.name"></field-input>

                    <v-divider></v-divider>

                    <v-label class="mt-5">{{ $t('permissions') }}</v-label>

                    <v-row class="row-permissions">
                        <v-col
                            cols="12"
                            lg="4"
                            md="4"
                            v-for="(permission, i) in listOfPermissions"
                            :key="i">
                            
                            <div class="d-flex align-center justify-space-between">
                                <p class="title">{{ i }}</p>

                                <div class="form-check">
                                    <input class="" type="checkbox" :id="'checkbox-all-' + i" @click="checkAll(permission, i)">
                                    <label class="form-check-label" :for="'checkbox-all-' + i">
                                      {{ $t('checkAll') }}
                                    </label>
                                </div>
                            </div>

                            <v-row>
                                <v-col
                                    class="pb-0"
                                    cols="12"
                                    lg="6"
                                    md="6"
                                    v-for="(permissionList, x) in permission"
                                    :key="x">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" :value="permissionList.id" :id="'checkbox-' + permissionList.name + permissionList.id">
                                        <label class="form-check-label" :for="'checkbox-' + permissionList.name + permissionList.id">
                                          {{ permissionList.name }}
                                        </label>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-btn
                        class="mt-5"
                        variant="outlined"
                        :disabled="loading"
                        color="primary"
                        type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped lang="scss">
.title {
    font-weight: bold;
    font-size: 15px;
    margin: 10px;
    text-transform: capitalize;
}

.form-check-label {
    margin-left: 5px;
}

.permission-wrapper {
    display: flex;
    gap: 10px;
    margin-top: 10px;

    .permission-item {

        .permission-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 5px;
        }
    }
}

.form-check {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const store = useRoleStore();

const { t } = useI18n();

const { defineField, errors, handleSubmit, setValues } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
    }),
})

const [name] = defineField('name');

const detailRole = ref(null);

const loading = ref(false);

const title = ref(t('createRole'));

const breadcrumbs = ref([
  {
      title: t('userManagement'),
      disabled: true,
      href: 'breadcrumbs_inventory',
  },
  {
      title: t('role'),
      disabled: false,
      href: '/admin/user-management/roles',
  },
  {
      title: t('create'),
      disabled: true,
      href: 'breadcrumbs_link_1',
  },
]);

const { listOfPermissions } = storeToRefs(store);

const validateData = handleSubmit(async(values) => {
    loading.value = true;
    var permissions = [];
    document.querySelectorAll('.form-check-input:checked').forEach(element => {
        permissions.push(element.value);
    });

    values.permissions = permissions;

    if (route.params.id) {
        values.detailData = {uid: route.params.id};
    }

    const storeData = await store.storeData(values);

    loading.value = false;

    if (storeData.status < 300) {
        router.push({path: '/admin/user-management/roles'});
    }
})

async function initPermission() {
    await store.initPermissions();
}

function checkAll(values, index) {
    var isCheck = document.querySelector('#checkbox-all-' + index).checked;

    for (let a = 0; a < values.length; a++) {
        if (isCheck) {
            document.getElementById('checkbox-' + values[a].name + values[a].id).setAttribute('checked', true);
        } else {
            document.getElementById('checkbox-' + values[a].name + values[a].id).removeAttribute('checked');
        }
    }
}

async function initRole() {
    detailRole.value = await store.detailData({uid: route.params.id});
    
    setValues({
        name: detailRole.value.name,
    });

    if (detailRole.value.permissions.length) {
        for (let a = 0; a < detailRole.value.permissions.length; a++) {
            document.getElementById('checkbox-' + detailRole.value.permissions[a].name + detailRole.value.permissions[a].id).setAttribute('checked', true);
        }
    }
}

onMounted(async () => {
    await initPermission();

    if (route.params.id) {
        title.value = t('editRole');
        initRole();
    }
})
</script>