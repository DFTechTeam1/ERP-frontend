<template>
    <div class="d-flex flex-row w-100">
        <v-tabs
            v-model="tab"
            center-active
            :disabled="loading"
            bg-color="primary"
            direction="vertical">
            <v-tab 
                v-if="permissionGeneral"
                value="tab-company"
                :text="t('company')"></v-tab>
            <v-tab 
                v-if="permissionGeneral"
                value="tab-general"
                :text="t('general')"></v-tab>
            <v-tab 
                v-if="permissionGeneral"
                value="tab-email"
                :text="t('emailSetting')"></v-tab>
            <v-tab 
                v-if="permissionGeneral"
                value="tab-variables"
                :text="t('variables')"></v-tab>
            <!-- <v-tab 
                v-if="permissionAddon"
                value="tab-addon"
                :text="t('addons')"></v-tab> -->
            <v-tab 
                v-if="permissionKanban"
                value="tab-kanban-board"
                :text="t('kanbanBoard')"></v-tab>

            <v-tab 
                v-if="permissionKanban"
                value="tab-pricing-setting"
                :text="t('pricingSetting')"></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="w-100">
            <v-tabs-window-item value="tab-company">
                <company-setting />
            </v-tabs-window-item>
            <v-tabs-window-item value="tab-general">
                <general-view />
            </v-tabs-window-item>
            <v-tabs-window-item value="tab-variables">
                <variable-view />
            </v-tabs-window-item>
            <v-tabs-window-item value="tab-email">
                <email-setting />
            </v-tabs-window-item>
            <v-tabs-window-item value="tab-kanban-board">
                <kanban-board />
            </v-tabs-window-item>
            <v-tabs-window-item value="tab-pricing-setting">
                <pricing-setting />
            </v-tabs-window-item>
        </v-tabs-window>

        <!-- <v-window
            class="w-100 bg-white"
            v-model="tab">
            <v-window-item value="tab-addon">
                <addon-setting />
            </v-window-item>
            <v-window-item value="tab-kanban-board">
                <kanban-board />
            </v-window-item>
            <v-window-item value="tab-pricing-setting">
                <pricing-setting />
            </v-window-item>
        </v-window> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AddonSetting from './items/AddonSetting.vue';
import KanbanBoard from './items/KanbanBoard.vue';
import GeneralView from './items/general/GeneralView.vue';
import EmailSetting from './items/EmailSetting.vue';
import VariableView from './items/VariableView.vue'
import PricingSetting from './items/PricingSetting.vue';
import CompanySetting from './items/CompanySetting.vue';
import { useCheckPermission } from '@/compose/checkPermission';
import { useSettingStore } from '@/stores/setting';

const { t } = useI18n();

const store = useSettingStore();

const tab = ref('tab-company');

const permissionGeneral = ref(false);

const permissionAddon = ref(false);

const permissionKanban = ref(false);

const loading = ref(false);

const initAllSetting = async() => {
    loading.value = true;
    await store.initAllSetting();
    loading.value = false;
}

onMounted(() => {
    permissionGeneral.value = useCheckPermission('setting_general');
    permissionAddon.value = useCheckPermission('setting_addon');
    permissionKanban.value = useCheckPermission('setting_kanban');
    initAllSetting();
});
</script>