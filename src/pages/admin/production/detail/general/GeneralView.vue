<template>
    <!-- basic information -->
    <div>
        <v-alert
            v-if="(detailProject) && (detailProject.show_alert_coming_soon) && (detailProject.can_complete_project)"
            class="w-100 mb-3"
            :text="alertText"
            :title="t('alertProjectReminderTitle')"
            type="error"
            :closable="true"
        ></v-alert>
        <v-alert
            v-if="(detailProject) && (detailProject.show_alert_event_is_done && !detailProject.feedback_given) && (detailProject.can_complete_project)"
            class="w-100 mb-3"
            :text="t('projectIsNeedFeedback')"
            :title="t('projectIsDone')"
            type="warning"
            :closable="true"
        ></v-alert>

        <div class="basic-information">
            <basic-section
                :detail="detailProjectData"/>

            <more-detail
                :detail="detailProjectData"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BasicSection from './BasicSection'
import MoreDetail from './MoreDetail'
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';

const { t } = useI18n()

const store = useProjectStore()

const { detailProject } = storeToRefs(store)

const detailProjectData = ref(null);

const alertText = ref(t('alertProjectReminderText'))

const props = defineProps({
    detail: {
        default: null,
    },
});

watch(props, (values) => {
    detailProjectData.value = values.detail;

    if (detailProject.value) {
        console.log('detail', detailProject.value);

        alertText.value = t('alertProjectReminderText', {date: detailProject.value.project_date})
    }
})
</script>