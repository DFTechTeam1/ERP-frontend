<template>
    <div>
        <breadcrumb-data
            :title="$t('detailEmployee')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>
            
        <master-card>
            <v-card-text>
                <template v-if="loadingPrepare">
                    <v-skeleton-loader
                        type="list-item-avatar-three-line"></v-skeleton-loader>
                </template>
                <template v-else>
                    <v-row>
                        <!-- Sidebar -->
                        <v-col cols="12"
                            style="border-right: 1px solid #e6e6e6;"
                            md="3">
                            <div class="image d-flex align-center justify-center">
                                <v-avatar
                                    size="100">
                                    <v-img
                                        src="/user.png"></v-img>
                                </v-avatar>
                            </div>
    
                            <div class="text-center">
                                <p class="fw-bold" style="font-size: 20px;" v-if="detailOfEmployee">{{ detailOfEmployee.data.data.name }}</p>
                            </div>
        
                            <v-divider class="mt-5 mb-5"></v-divider>
        
                            <v-list v-model:opened="open">
                                <v-list-group
                                    value="general">
                                    <template v-slot:activator="{ props }">
                                        <v-list-item
                                            v-bind="props"
                                            :prepend-icon="mdiAccount"
                                            class="pointer"
                                            :title="t('general')">
                                        </v-list-item>
                                    </template>
        
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/general`">
                                        <v-list-item
                                            :title="t('personal')"
                                            value="personal"></v-list-item>
                                    </router-link>
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/employment`">
                                        <v-list-item
                                            :title="t('employment')"
                                            value="employment"></v-list-item>
                                    </router-link>
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/account`">
                                        <v-list-item
                                            :title="t('account')"
                                            value="account"></v-list-item>
                                    </router-link>
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/education`">
                                        <v-list-item
                                            :title="t('education') + ' & ' + t('experience')"
                                            value="employment"></v-list-item>
                                    </router-link>
                                </v-list-group>
        
                                <v-list-group
                                    value="timeMangement">
                                    <template v-slot:activator="{ props }">
                                        <v-list-item
                                            v-bind="props"
                                            :title="t('timeManagement')"
                                            class="pointer"
                                            :prepend-icon="mdiClock"></v-list-item>
                                    </template>
        
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/attendance`">
                                        <v-list-item
                                            :title="t('attendance')"
                                            value="attendance"></v-list-item>
                                    </router-link>
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/timeoff`">
                                        <v-list-item
                                            :title="t('timeoff')"
                                            value="timeoff"></v-list-item>
                                    </router-link>
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/overtime`">
                                        <v-list-item
                                            :title="t('overtime')"
                                            value="overtime"></v-list-item>
                                    </router-link>
                                </v-list-group>
        
                                <v-list-group value="payroll">
                                    <template v-slot:activator="{ props }">
                                        <v-list-item v-bind="props"
                                            :title="t('payroll')"
                                            class="pointer"
                                            :prepend-icon="mdiCalculator"></v-list-item>
                                    </template>
        
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/payrollinfo`">
                                        <v-list-item
                                            :title="t('payrollInfo')"
                                            value="payrollInfo"></v-list-item>
                                    </router-link>
                                </v-list-group>
        
                                <v-list-group value="finance">
                                    <template v-slot:activator="{ props }">
                                        <v-list-item
                                            v-bind="props"
                                            :title="t('finance')"
                                            class="pointer"
                                            :prepend-icon="mdiCash"></v-list-item>
                                    </template>
        
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/reimbursement`">
                                        <v-list-item
                                            :title="t('reimbursement')"
                                            value="reimbursement"></v-list-item>
                                    </router-link>
                                </v-list-group>
        
                                <v-list-group value="assets">
                                    <template v-slot:activator="{ props }">
                                        <v-list-item
                                            v-bind="props"
                                            :title="t('assets')"
                                            class="pointer"
                                            :prepend-icon="mdiBox"></v-list-item>
                                    </template>
        
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/asset`">
                                        <v-list-item
                                            :title="t('assetInfo')"
                                            value="assetInfo"></v-list-item>
                                    </router-link>
                                </v-list-group>
        
                                <v-list-group value="projects">
                                    <template v-slot:activator="{ props }">
                                        <v-list-item
                                            v-bind="props"
                                            :title="t('projects')"
                                            class="pointer"
                                            :prepend-icon="mdiCalendar"></v-list-item>
                                    </template>
        
                                    <router-link class="disable-link" activeClass="detail-employee-active-menu" :to="`/admin/employees/${route.params.id}/projects`">
                                        <v-list-item
                                            :title="t('projectList')"
                                            value="projectList"></v-list-item>
                                    </router-link>
                                </v-list-group>
                            </v-list>
                        </v-col>
        
                        <!-- Content -->
                        <v-col cols="12"
                            md="9">
                            <router-view :loading-parent="loadingPrepare"></router-view>
                        </v-col>
                    </v-row>
                </template>
            </v-card-text>
        </master-card>
    </div>
</template>

<style lang="scss" scoped>
.detail-title {
    font-size: 20px;
    font-weight: bold;
}
</style>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { mdiAccount, mdiBox, mdiCalculator, mdiCalendar, mdiCash, mdiClock } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n()

const open = ref(['general'])

const route = useRoute()

const store = useEmployeesStore()

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

const { detailOfEmployee } = storeToRefs(store)

const loadingPrepare = ref(false)

async function initDetailEmployee() {
    loadingPrepare.value = true
    await store.detailData({uid: route.params.id})
    loadingPrepare.value = false
}

onMounted(() => {
    initDetailEmployee()
})
</script>