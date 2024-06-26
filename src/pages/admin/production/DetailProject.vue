<template>
    <div>
        <breadcrumb-data
            :title="$t('project')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-toolbar
                color="primary"
                :title="t('detailProject')"></v-toolbar>

            <div class="w-100 tab-detail-project">
                <v-tabs
                    show-arrows
                    v-model="tab"
                    class="border"
                    :direction="tabDirection">
                
                    <v-tab
                        color="primary"
                        :text="t('general')"
                        value="tab-general"></v-tab>
                    <v-tab
                        color="primary"
                        :text="t('teams')"
                        value="tab-teams"></v-tab>
                    <v-tab
                        :text="t('progress')"
                        color="primary"
                        value="tab-progress"></v-tab>
                    <v-tab
                        :text="t('references')"
                        color="primary"
                        value="tab-references"></v-tab>
                    <v-tab
                        :text="t('task')"
                        color="primary"
                        value="tab-task"></v-tab>
                    <v-tab
                        :text="t('showreels')"
                        color="primary"
                        value="tab-showreels"></v-tab>
                    <v-tab
                        :text="t('equipmentCheck')"
                        color="primary"
                        value="tab-equipment-check"></v-tab>
    
                </v-tabs>
                
                <v-window
                    class="w-100"
                    v-model="tab">
                    <v-window-item value="tab-general">
                        <general-information 
                            :detail="detailProject" />
                    </v-window-item>

                    <v-window-item value="tab-progress">
                        <progress-view />
                    </v-window-item>
                    
                    <v-window-item value="tab-teams">
                        <v-card flat>
                            <v-card-text>
                                <team-view
                                    :detail="detailProject"></team-view>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-task">
                        <v-card flat>
                            <v-card-text>
                                <kanban-view
                                    :can-move-to-progress="canMoveToProgress"
                                    :can-move-to-review-client="canMoveToReviewClient"
                                    :can-move-to-review-pm="canMoveToReviewPm"
                                    :can-move-to-revise="canMoveToRevise"
                                    :can-move-to-completed="canMoveToCompleted"
                                    :can-move-task="canMoveTask"
                                    :can-add-task="canAddTask"></kanban-view>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-references">
                        <v-card flat>
                            <v-card-text>
                                <references-view
                                    :media="references"></references-view>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-equipment-check">
                        <v-card flat>
                            <v-card-text>
                                <equipment-list></equipment-list>
                            </v-card-text>
                        </v-card>
                    </v-window-item>
                </v-window>
            </div>
        </v-card>
    </div>
</template>

<style scoped lang="scss">
.tab-detail-project {
    display: flex;
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
import ProgressView from './detail/progress/ProgressView.vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useCheckPermission } from '@/compose/checkPermission';

const store = useProjectStore();

const { mobile } = useDisplay();

const route = useRoute();

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

const detailProject = ref(null);

const references = ref([]);

const tabDirection = ref('vertical');

const canMoveToProgress = ref(false);

const canMoveToReviewPm = ref(false);

const canMoveToReviewClient = ref(false);

const canMoveToRevise = ref(false);

const canMoveToCompleted = ref(false);

const canMoveTask = ref(false);

const canAddTask = ref(false);

const tab = ref('tab-general')

async function initProjectDetail() {
    const resp = await store.getDetail({id: route.params.id});

    if (resp.status < 300) {
        detailProject.value = resp.data.data;
        references.value = detailProject.value.references;
    }
}

onMounted(() => {
    initProjectDetail();
    if (mobile.value) {
        tabDirection.value = 'horizontal';
    } else {
        tabDirection.value = 'vertical';
    }

    canMoveToProgress.value = useCheckPermission('move_task_to_progress');
    canMoveToReviewClient.value = useCheckPermission('move_task_to_review_client');
    canMoveToReviewPm.value = useCheckPermission('move_task_to_review_pm');
    canMoveToRevise.value = useCheckPermission('move_task_to_revise');
    canMoveToCompleted.value = useCheckPermission('move_task_to_completed');
    canMoveTask.value = useCheckPermission('move_task');
    canAddTask.value = useCheckPermission('add_task');
}) 
</script>