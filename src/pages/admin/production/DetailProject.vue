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
                            v-if="(detailProject) && (detailProject.is_time_to_complete_project || (detailProject.show_alert_event_is_done && !detailProject.feedback_given)) && (detailProject.can_complete_project)"
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
                v-if="useCheckPermission('list_member') && useCheckPermission('list_entertainment_member')"
                cols="12"
                md="5">
                <v-skeleton-loader v-if="loading" type="card" height="800"></v-skeleton-loader>
                <master-card
                    v-else
                    :min-height="useCheckPermission('list_request_song') ? 830 : 400"
                    :max-height="useCheckPermission('list_request_song') ? 830 : 400"
                    height="100%">
                    <v-toolbar color="surface">
                        <v-toolbar-title class="d-flex align-center justify-space-between">
                            <v-btn-toggle
                                color="primary"
                                base-color="grey-lighten-4"
                                group
                                rounded="1"
                                density="compact"
                                v-model="teamSelection">
                                <v-btn value="teams" v-if="useCheckPermission('list_member')">
                                    {{ $t('teams') }}
                                </v-btn>
                                <v-btn value="entertainment" v-if="useCheckPermission('list_entertainment_member')">
                                    {{ $t('entertainment') }}
                                </v-btn>
                            </v-btn-toggle>
                        </v-toolbar-title>

                        <v-btn icon v-if="useCheckPermission('add_team_member')">
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
                        <team-view :detail="detailProject" v-if="teamSelection == 'teams'"></team-view>
                        <entertainment-list :detail="detailProject" v-if="teamSelection == 'entertainment'"></entertainment-list>
                    </v-card-text>
                </master-card>
            </v-col>

            <v-col
                cols="12"
                :md="useCheckPermission('list_member') && useCheckPermission('list_entertainment_member') ? '7' : '12'">
                <v-row>
                    <v-col cols="12"
                        :md="!useCheckPermission('list_member') ? '6': '12'">
                        <v-skeleton-loader v-if="loading" type="card" height="400"></v-skeleton-loader>
                        <master-card
                            v-else
                            class="mb-2"
                            min-height="400"
                            max-height="400"
                            height="100%">
                            <v-toolbar color="surface" class="pe-4">
                                <v-toolbar-title>
                                    {{ $t('references') }}
                                </v-toolbar-title>

                                <v-spacer></v-spacer>

                                <div class="d-flex align-center ga-2">
                                    <v-btn
                                        v-if="(detailProject) && useCheckPermission('add_references')"
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        @click.prevent="showFormReferences = true">
                                        {{ $t('addReferences') }}
                                    </v-btn>

                                    <v-btn
                                        v-if="(detailProject) && (detailProject.references) && (detailProject.references.files != undefined || detailProject.references.pdf != undefined || detailProject.references.link != undefined) && (!detailProject.project_is_complete) && useCheckPermission('add_references')"
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        @click.prevent="downloadReferences()">
                                        <v-icon
                                            :icon="mdiDownloadMultiple"
                                            size="20"
                                            class="pointer"></v-icon>

                                        <v-tooltip
                                            activator="parent"
                                            location="start"
                                          >{{ $t('download') }}</v-tooltip>
                                    </v-btn>
                                </div>
                            </v-toolbar>

                            <v-card-text
                                class="m-0"
                                style="height: 100%; overflow: hidden; padding: 0; padding-bottom: 20px;">
                                <references-view :media="references" :show-form="showFormReferences" @close-form="closeFormReferences"
                                    @open-form="showFormReferences = true"></references-view>
                            </v-card-text>
                        </master-card>
                    </v-col>
                    <v-col cols="12"
                        :md="!useCheckPermission('list_member') ? '6': '12'"
                        v-if="useCheckPermission('list_request_song')">
                        <v-skeleton-loader v-if="loading" type="card" height="400"></v-skeleton-loader>
                        <master-card
                            v-else
                            class="mb-2"
                            max-height="400"
                            min-height="400"
                            height="100%">
                            <v-toolbar color="surface" class="pe-4">
                                <v-toolbar-title>
                                    {{ $t('songs') }}
                                </v-toolbar-title>

                                <v-spacer></v-spacer>

                                <div class="d-flex align-center ga-2"
                                    v-if="useCheckPermission('create_request_song') || useCheckPermission('distribute_request_song')">

                                    <v-menu>
                                        <template v-slot:activator="{ props }">
                                            <v-btn
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                type="button"
                                                v-bind="props">
                                                {{ $t('action') }}
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-item @click.prevent="showSongForm = true"
                                                v-if="useCheckPermission('create_request_song')">
                                                <v-list-item-title>
                                                    <v-icon
                                                        :icon="mdiPlus"
                                                        size="15"></v-icon>
                                                    {{ $t('addSongs') }}
                                                </v-list-item-title>
                                            </v-list-item>
                                            <v-list-item @click.prevent="showBulkSongDistribute = true"
                                                v-if="useCheckPermission('distribute_request_song')">
                                                <v-list-item-title>
                                                    <v-icon
                                                        :icon="mdiPlusBoxMultiple"
                                                        size="15"></v-icon>
                                                    {{ $t('bulkDistributeSong') }}
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </div>
                            </v-toolbar>

                            <v-card-text
                                class="m-0"
                                style="height: 100%; overflow: hidden; padding: 0; padding-bottom: 20px;">
                                <song-list v-if="detailProject"
                                    :songs="detailProject.songs" />
                                <song-form :is-show="showSongForm"
                                    @close-event="showSongForm = false"></song-form>
                                <bulk-distribute :is-show="showBulkSongDistribute"
                                    @close-event="showBulkSongDistribute = false" />
                            </v-card-text>
                        </master-card>
                    </v-col>
                </v-row>
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
                    v-if="(detailProject) && (detailProject.showreels) && useCheckPermission('add_showreels') &&
                    tab == 'tab-showreels'"
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

                    <v-tab
                        :text="t('task')"
                        color="primary"
                        v-if="useCheckPermission('list_task')"
                        value="tab-task"></v-tab>
                    <v-tab :text="t('progress')" color="primary" value="tab-progress"></v-tab>
                    <v-tab :text="t('showreels')" color="primary" value="tab-showreels"></v-tab>
                    <v-tab :text="t('equipmentCheck')" color="primary" value="tab-equipment-check"></v-tab>

                </v-tabs>

                <v-tabs-window v-model="tab">
                  <v-tabs-window-item value="tab-task">
                    <v-card flat class="no-shadow">
                      <v-card-text>
                        <kanban-view :can-move-to-progress="canMoveToProgress"
                          :can-move-to-review-client="canMoveToReviewClient"
                          :can-move-to-review-pm="canMoveToReviewPm" :can-move-to-revise="canMoveToRevise"
                          :can-move-to-completed="canMoveToCompleted" :can-move-task="canMoveTask"
                          :can-add-task="canAddTask" :can-delete-task="canDeleteTask"></kanban-view>
                      </v-card-text>
                      </v-card>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="tab-progress">
                    <progress-view />
                  </v-tabs-window-item>

                  <v-tabs-window-item value="tab-showreels">
                    <v-card flat class="no-shadow">
                      <v-card-text>
                        <showreels-view :open-form="isShowShowreels"></showreels-view>
                      </v-card-text>
                    </v-card>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="tab-equipment-check">
                    <v-card flat class="no-shadow">
                      <v-card-text>
                        <equipment-list></equipment-list>
                      </v-card-text>
                      </v-card>
                  </v-tabs-window-item>
                </v-tabs-window>

                <!-- <v-window class="w-100 no-shadow" v-model="tab">

                    <v-window-item value="tab-progress">
                        <progress-view />
                    </v-window-item>

                    <v-window-item value="tab-task" v-if="useCheckPermission('list_task')">
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
                </v-window> -->
            </div>
        </v-card>

        <request-team-form
            :is-show="showFormTeamRequest"
            :project-uid="teamRequestProjectUid"
            @close-event="closeRequestTeam"></request-team-form>

        <request-entertainment-team
            :is-show="showRequestEntertainment"
            :project-uid="requestEntertainmentProjectUid"
            @close-event="closeRequestEntertainment"></request-entertainment-team>

        <feedback-form
            :is-show="isShowFeedbackForm"
            @close-event="closeFeedbackForm"></feedback-form>
    </div>
</template>

<style scoped lang="scss">
.tab-detail-project {
    display: block;
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
import GeneralInformation from './detail/general/GeneralView.vue';
import TeamView from './detail/teams/TeamList.vue';
import EntertainmentList from './detail/teams/EntertainmentList.vue';
import KanbanView from './detail/task/KanbanView.vue';
import ReferencesView from './detail/references/ReferencesView.vue';
import SongList from './detail/songs/SongList.vue';
import EquipmentList from './detail/equipment/EquipmentList.vue';
import ShowreelsView from './detail/showreels/ShowreelsView.vue'
import ProgressView from './detail/progress/ProgressView.vue';
import RequestTeamForm from './RequestTeam.vue'
import RequestEntertainmentTeam from './RequestEntertainmentTeam.vue'
import FeedbackForm from './ReportAsDone.vue'
import ProjectReport from './ProjectReport.vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useCheckPermission } from '@/compose/checkPermission';
import { mdiDotsVertical, mdiHandBackLeftOutline, mdiDownloadMultiple, mdiPlus, mdiPlusBoxMultiple } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useProjectClassStore } from '@/stores/projectClass';
import { showNotification } from '@/compose/notification'
import SongForm from './detail/songs/SongForm.vue';
import BulkDistribute from './detail/songs/BulkDistribute.vue';
import { useGetRole } from '@/compose/getRole';
import BaseRole from '@/enums/system/BaseRole';

const store = useProjectStore();

const storeProjectClass = useProjectClassStore()

const { detailProject } = storeToRefs(store)

const { mobile } = useDisplay();

const route = useRoute();

const router = useRouter();

const showFormTeamRequest = ref(false)

const showRequestEntertainment = ref(false)

const requestEntertainmentProjectUid = ref(null)

const showSongForm = ref(false);

const showBulkSongDistribute = ref(false);

const showFormReferences = ref(false)

const teamRequestProjectUid = ref(null)

const teamSelection = ref('teams')

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

const tabDirection = ref('horizontal');

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
    const resp = await store.getDetail({ id: route.params.id });
    console.log("resp", resp);
    if ((resp.response) && (resp.response.status == 403)) { // if autorized, go to unauthorize page
      router.push('/not-allowed');
    }
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

function closeRequestEntertainment() {
    showRequestEntertainment.value = false
    requestEntertainmentProjectUid.value = null
}

function showRequestTeam() {
    if (teamSelection.value == 'entertainment') {
        showRequestEntertainment.value = true
        requestEntertainmentProjectUid.value = route.params.id
    } else {
        showFormTeamRequest.value = true
        teamRequestProjectUid.value = route.params.id
    }
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

function downloadReferences() {
    if (detailProject.value.references.files == undefined && detailProject.value.references.pdf == undefined) {
        showNotification(t('projectHasNoReferences'), 'error')
        return
    }

    store.downloadReferences(detailProject.value)
}

onMounted(() => {
    initProjectDetail();
    if (mobile.value) {
        tabDirection.value = 'horizontal';
    } else {
        tabDirection.value = 'horizontal';
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

    if (useGetRole() == BaseRole.Entertainment || useGetRole() == BaseRole.ProjectManagerEntertainment) {
        tab.value = 'tab-equipment-check';
    } else {
        tab.value = 'tab-task';
    }

    console.log('tab', tab.value);
})
</script>
