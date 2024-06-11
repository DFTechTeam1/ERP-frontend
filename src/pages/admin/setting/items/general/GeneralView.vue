<template>
    <div>
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
                    :text="t('emailSetting')"
                    value="tab-email"></v-tab>

            </v-tabs>

            <v-window
                class="w-100"
                v-model="tab">
                <v-window-item value="tab-email">
                    <email-setting/>
                </v-window-item>
                <v-window-item value="tab-general">
                    <general-setting/>
                </v-window-item>
            </v-window>
        </div>
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
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import EmailSetting from './EmailSetting.vue';
import GeneralSetting from './GeneralSetting.vue';

const { t } = useI18n();

const { mobile } = useDisplay();

const tabDirection = ref('vertical');

const tab = ref('tab-general')

onMounted(() => {
    if (mobile.value) {
        tabDirection.value = 'horizontal';
    } else {
        tabDirection.value = 'vertical';
    }
});
</script>