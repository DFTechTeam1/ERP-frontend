<template>
    <div>
        <v-tabs
            v-model="tab"
            center-active
            bg-color="primary">
            <v-tab 
                v-if="permissionGeneral"
                value="tab-general"
                :text="t('general')"></v-tab>
            <v-tab 
                v-if="permissionAddon"
                value="tab-addon"
                :text="t('addons')"></v-tab>
            <v-tab 
                v-if="permissionKanban"
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
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AddonSetting from './items/AddonSetting.vue';
import KanbanBoard from './items/KanbanBoard.vue';
import { useCheckPermission } from '@/compose/checkPermission';

const { t } = useI18n();

const tab = ref('tab-general');

const permissionGeneral = ref(false);

const permissionAddon = ref(false);

const permissionKanban = ref(false);

onMounted(() => {
    permissionGeneral.value = useCheckPermission('setting_general');
    permissionAddon.value = useCheckPermission('setting_addon');
    permissionKanban.value = useCheckPermission('setting_kanban');
});
</script>