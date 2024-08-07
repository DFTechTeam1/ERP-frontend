<template>
    <div>
        <breadcrumb-data :title="$t('project')" :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <!-- general information -->
        <v-row>
            <project-report v-if=" (detailProject) && (detailProject.feedback_given)" :is-loading="loading" />
            <v-col
                cols="12"
                class="pb-0">
                <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
                <master-card class="mb-2" v-else>
                    <v-toolbar color="surface">
                        <v-toolbar-title>
                            {{ $t('generalInformation') }}
                        </v-toolbar-title>

                        <v-spacer></v-spacer>

                        <v-btn
                            class="me-5"
                            variant="flat"
                            color="success"
                            density="compact"
                            v-if="(detailProject) && (detailProject.is_time_to_complete_project)"
                            @click.prevent="showFeedbackForm">
                            {{ $t('reportAsDone') }}
                        </v-btn>
                    </v-toolbar>
        
                    <v-card-text>
                        <general-information :detail="detailProject" />
                    </v-card-text>
                </master-card>
            </v-col>

            <v-col
                cols="12"
                md="5">
                <v-skeleton-loader v-if="loading" type="card" height="400"></v-skeleton-loader>
                <master-card
                    v-else
                    max-height="400"
                    height="100%">
                    <v-toolbar color="surface">
                        <v-toolbar-title class="d-flex align-center justify-space-between">
                            {{ $t('teams') }}
                        </v-toolbar-title>
    
                        <v-spacer></v-spacer>
    
                        <v-btn icon>
                            <v-icon
                                :icon="mdiDotsVertical"></v-icon>
    
                            <v-menu
                                activator="parent">
                                <v-list>
                                    <v-list-item class="pointer" @click.prevent="showRequestTeam">
                                        <v-icon
                                            :icon="mdiHandBackLeftOutline"
                                            class="me-2"
                                            size="15"></v-icon>
                                        {{ $t('requestOtherTeamMember') }}
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-btn>
                    </v-toolbar>
        
                    <v-card-text
                        class="m-0"
                        style="height: 100%; overflow: scroll; padding: 0; padding-bottom: 60px;">
                        <team-view :detail="detailProject"></team-view>
                    </v-card-text>
                </master-card>
            </v-col>

            <v-col
                cols="12"
                md="7">
                <v-skeleton-loader v-if="loading" type="card" height="400"></v-skeleton-loader>
                <master-card
                    v-else
                    class="mb-2"
                    max-height="400"
                    height="100%">
                    <v-toolbar color="surface">
                        <v-toolbar-title>
                            {{ $t('references') }}
                        </v-toolbar-title>

                        <v-spacer></v-spacer>

                        <v-btn
                            v-if="(detailProject) && (detailProject.references.length) && (!detailProject.project_is_complete)"
                            variant="outlined"
                            color="primary"
                            size="small"
                            class="mb-5 mt-3"
                            @click.prevent="showFormReferences = true">
                            {{ $t('addReferences') }}
                        </v-btn>
                    </v-toolbar>
        
                    <v-card-text
                        class="m-0"
                        style="height: 100%; overflow: scroll; padding: 0; padding-bottom: 20px;">
                        <references-view :media="references" :show-form="showFormReferences" @close-form="closeFormReferences"
                            @open-form="showFormReferences = true"></references-view>
                    </v-card-text>
                </master-card>
            </v-col>
        </v-row>

        <v-card class="mt-5">
            <v-toolbar color="surface">
                <v-toolbar-title>
                    {{ $t('detailProject') }}
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn
                    class="me-5"
                    variant="flat"
                    color="primary"
                    v-if="(detailProject) && (detailProject.showreels)"
                    @click.prevent="openShowreelsForm">
                    {{ $t('uploadShowreels') }}
                </v-btn>

                <!-- <v-btn icon v-if="tab == 'tab-task'">
                    <v-icon :icon="mdiFilter"></v-icon>

                    <v-menu activator="parent">
                        <v-list>
                            <v-list-item class="pointer" @click.prevent="filterTaskView('all')">
                                <v-list-item-title>All task</v-list-item-title>
                            </v-list-item>
                            <v-list-item class="pointer" @click.prevent="filterTaskView('assigned')">
                                <v-list-item-title>Assigned to me</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn> -->
            </v-toolbar>

            <div class="w-100 tab-detail-project">
                <v-tabs show-arrows v-model="tab" :direction="tabDirection">

                    <v-tab :text="t('task')" color="primary" value="tab-task"></v-tab>
                    <v-tab :text="t('progress')" color="primary" value="tab-progress"></v-tab>
                    <v-tab :text="t('showreels')" color="primary" value="tab-showreels"></v-tab>
                    <v-tab :text="t('equipmentCheck')" color="primary" value="tab-equipment-check"></v-tab>

                </v-tabs>

                <v-window class="w-100 no-shadow" v-model="tab">

                    <v-window-item value="tab-progress">
                        <progress-view />
                    </v-window-item>

                    <v-window-item value="tab-task">
                        <v-card flat class="no-shadow">
                            <v-card-text>
                                <kanban-view :can-move-to-progress="canMoveToProgress"
                                    :can-move-to-review-client="canMoveToReviewClient"
                                    :can-move-to-review-pm="canMoveToReviewPm" :can-move-to-revise="canMoveToRevise"
                                    :can-move-to-completed="canMoveToCompleted" :can-move-task="canMoveTask"
                                    :can-add-task="canAddTask" :can-delete-task="canDeleteTask"></kanban-view>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-equipment-check">
                        <v-card flat class="no-shadow">
                            <v-card-text>
                                <equipment-list></equipment-list>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-showreels">
                        <v-card flat class="no-shadow">
                            <v-card-text>
                                <showreels-view :open-form="isShowShowreels"></showreels-view>
                            </v-card-text>
                        </v-card>
                    </v-window-item>
                </v-window>
            </div>
        </v-card>

        <request-team-form
            :is-show="showFormTeamRequest"
            :project-uid="teamRequestProjectUid"
            @close-event="closeRequestTeam"></request-team-form>

        <feedback-form
            :is-show="isShowFeedbackForm"
            @close-event="closeFeedbackForm"></feedback-form>
    </div>
</template>

<style scoped lang="scss">
.tab-detail-project {
    display: flex;
}

.report-subtitle {
    font-size: 12px;
}

.show-more-text {
    font-size: 13px;
}

@media all and (max-width: 560px) {
    .tab-detail-project {
        display: block !important;
    }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import GeneralInformation from './detail/general//GeneralView.vue';
import TeamView from './detail/teams/TeamList.vue';
import KanbanView from './detail/task/KanbanView.vue';
import ReferencesView from './detail/references/ReferencesView.vue';
import EquipmentList from './detail/equipment/EquipmentList.vue';
import ShowreelsView from './detail/showreels/ShowreelsView.vue'
import ProgressView from './detail/progress/ProgressView.vue';
import RequestTeamForm from './RequestTeam.vue'
import FeedbackForm from './ReportAsDone.vue'
import ProjectReport from './ProjectReport.vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useCheckPermission } from '@/compose/checkPermission';
import { mdiDotsVertical, mdiHandBackLeftOutline } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useProjectClassStore } from '@/stores/projectClass';

const store = useProjectStore();

const storeProjectClass = useProjectClassStore()

const { detailProject } = storeToRefs(store)

const { mobile } = useDisplay();

const route = useRoute();

const showFormTeamRequest = ref(false)

const showFormReferences = ref(false)

const teamRequestProjectUid = ref(null)

const { t } = useI18n();

const breadcrumbs = ref([
    {
        title: t('production'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('project'),
        disabled: false,
        href: '/admin/production/projects',
    },
    {
        title: t('detail'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

const references = ref([]);

const tabDirection = ref('vertical');

const canMoveToProgress = ref(false);

const canMoveToReviewPm = ref(false);

const isShowFeedbackForm = ref(false)

const canMoveToReviewClient = ref(false);

const canMoveToRevise = ref(false);

const canMoveToCompleted = ref(false);

const canMoveTask = ref(false);

const canDeleteTask = ref(false)

const canAddTask = ref(false);

const isShowShowreels = ref(false)

const tab = ref('tab-task')

const loading = ref(false)

async function initProjectDetail() {
    loading.value = true
    await store.getDetail({ id: route.params.id });
    loading.value = false
}

function openShowreelsForm() {
    isShowShowreels.value = true
}

function showFeedbackForm() {
    isShowFeedbackForm.value = true
}

function closeFeedbackForm() {
    isShowFeedbackForm.value = false
}

function showRequestTeam() {
    showFormTeamRequest.value = true
    teamRequestProjectUid.value = route.params.id
}

function closeRequestTeam() {
    showFormTeamRequest.value = false
    teamRequestProjectUid.value = null
}

function closeFormReferences() {
    showFormReferences.value = false
}

function initProjectClass() {
    storeProjectClass.getAll()
}

onMounted(() => {
    initProjectDetail();
    if (mobile.value) {
        tabDirection.value = 'horizontal';
    } else {
        tabDirection.value = 'vertical';
    }

    initProjectClass()

    canMoveToProgress.value = useCheckPermission('move_task_to_progress');
    canMoveToReviewClient.value = useCheckPermission('move_task_to_review_client');
    canMoveToReviewPm.value = useCheckPermission('move_task_to_review_pm');
    canMoveToRevise.value = useCheckPermission('move_task_to_revise');
    canMoveToCompleted.value = useCheckPermission('move_task_to_completed');
    canMoveTask.value = useCheckPermission('move_task');
    canAddTask.value = useCheckPermission('add_task');
    canDeleteTask.value = useCheckPermission('delete_task');
}) 
</script>