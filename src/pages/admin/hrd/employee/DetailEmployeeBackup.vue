<template>
    <div>
        <breadcrumb-data
            :title="$t('detailEmployee')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>
        
        <template v-if="loading">
            <v-skeleton-loader
                class="mx-auto border"
                type="card-avatar, actions"
                ></v-skeleton-loader>
        </template>
        <template v-else-if="!loading && detailOfEmployee">
            <v-card>
                <!-- <v-card-item>
                    <v-card-title>
                        {{ detailOfEmployee.data.data.name }}
                    </v-card-title>
                </v-card-item> -->

                <v-card-text>
                    <div class="d-flex ga-4">
                        <v-avatar
                            size="100">
                            <v-img
                                src="/user.png"></v-img>
                        </v-avatar>

                        <div class="profile">
                            <p class="fw-bold">{{ detailOfEmployee.data.data.name }} - {{ detailOfEmployee.data.data.employee_id }}</p>
                            <p class="email">{{ detailOfEmployee.data.data.email }}</p>
                            <v-chip
                                class="mt-3"
                                :color="detailOfEmployee.data.data.status_color">
                                {{ detailOfEmployee.data.data.status_text }}
                            </v-chip>
                            <v-chip
                                class="mt-3"
                                color="cyan-lighten-1">
                                {{ detailOfEmployee.data.data.position.name }}
                            </v-chip>
                        </div>
                    </div>

                    <v-divider class="my-5"></v-divider>

                    <v-tabs
                        v-model="tab"
                        center-active
                        bg-color="primary">
                        <v-tab 
                            value="tab-general"
                            :text="t('general')"></v-tab>

                        <v-tab 
                            value="tab-project"
                            :text="t('project')"></v-tab>
                    </v-tabs>

                    <v-window
                        class="w-100"
                        v-model="tab">
                        <v-window-item value="tab-general">
                            <general-info></general-info>
                        </v-window-item>
                        <v-window-item value="tab-project">
                            <project-info></project-info>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';
import GeneralInfo from './detail/GeneralInfo.vue';
import ProjectInfo from './detail/ProjectInfo.vue';

const store = useEmployeesStore();

const { detailOfEmployee } = storeToRefs(store);

const { t } = useI18n();

const route = useRoute();

const breadcrumbs = ref([
    {
        title: t('employees'),
        disabled: false,
        href: '/admin/employees/list',
    },
    {
        title: t('detailEmployee'),
        disabled: true,
        href: '/admin/employees',
    },
]);

const loading = ref(false);

const tab = ref('tab-general');

async function getDetail(payload) {
    loading.value = true;
    await store.detailData(payload);
    loading.value = false;
}

onMounted(() => {
    if (route.params.id) {
        getDetail({uid: route.params.id});
    }
})
</script>