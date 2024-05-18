<template>
    <div>
        <breadcrumb-data
            :title="$t('brands')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-toolbar
                color="primary"
                :title="t('detailProject')"></v-toolbar>

            <div class="d-flex flex-ro w-100">
                <v-tabs
                    v-model="tab"
                    direction="vertical">
                
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
                        <general-information />
                    </v-window-item>
                    
                    <v-window-item value="tab-teams">
                        <v-card flat>
                            <v-card-text>
                                <team-view></team-view>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-task">
                        <v-card flat>
                            <v-card-text>
                                <kanban-view></kanban-view>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-references">
                        <v-card flat>
                            <v-card-text>
                                <references-view></references-view>
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

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import GeneralInformation from './detail/general//GeneralView.vue';
import TeamView from './detail/teams/TeamList.vue';
import KanbanView from './detail/task/KanbanView.vue';
import ReferencesView from './detail/references/ReferencesView.vue';
import EquipmentList from './detail/equipment/EquipmentList.vue';

const { t } = useI18n();

const breadcrumbs = ref([
    {
        title: t('production'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('project'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
    {
        title: t('detail'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

const tab = ref('tab-equipment-check')
</script>