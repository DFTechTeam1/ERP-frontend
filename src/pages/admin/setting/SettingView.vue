<template>
    <div>
        <v-tabs
            v-model="tab"
            center-active
            bg-color="primary">
            <v-tab 
                value="tab-general"
                :text="t('general')"></v-tab>
            <v-tab 
                value="tab-addon"
                :text="t('addons')"></v-tab>
            <v-tab 
                value="tab-kanban-board"
                :text="t('kanbanBoard')"></v-tab>
        </v-tabs>

        <v-window
            class="w-100"
            v-model="tab">
            <v-window-item value="tab-addon">
                <addon-setting />
            </v-window-item>
            <v-window-item value="tab-kanban-board">
                <kanban-board />
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AddonSetting from './items/AddonSetting.vue';
import KanbanBoard from './items/KanbanBoard.vue';

const { t } = useI18n();

const tab = ref('tab-general');
</script>