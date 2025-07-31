<script setup>
import reportingBridge from '@/plugins/reportingBridge';
import { onMounted, ref } from 'vue';

const optionGlobalTimeline = ref({
    chart: {
        height: 350,
        type: 'line',
    },
    colors: ['#4284f5', '#eb4235'],
    stroke: {
        width: [0, 4]
    },
    title: {
        text: 'Project Timeline Global (Month)'
    },
    dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
    },
    legend: {
        show: true,
        position: 'top'
    },
    stroke: {
        curve: 'smooth',
        width: [1, 4]
    },
    labels: ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'August 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'],
    yaxis: [{
        title: {
            text: 'Project Duration',
        },
    
    }, {
        opposite: true,
        title: {
            text: 'Total Project'
        }
    }]
});

const seriesGlobalTimeline = ref([
    {
        name: 'Project Duration',
        type: 'column',
        data: []
    },
    {
        name: 'Total Task',
        type: 'line',
        data: []
    }
]);

const getGlobalTimelineReport = async () => {
    loading.value = true;
    const resp = await reportingBridge.post('/report/project-timeline/global', {
        "start_month": 1,
        "end_month": 12,
        "start_quartal": null,
        "end_quartal": null,
        "start_year":2025,
        "end_year": 2025,
        "range_type": "month",
        "project_class_id": 3
    });
    loading.value = false;

    if (resp.status < 300) {
        seriesGlobalTimeline.value[0].data = resp.data.data.data;
        seriesGlobalTimeline.value[1].data = resp.data.data.total_project.map(item => item.total);
        optionGlobalTimeline.value.labels = resp.data.data.total_project.map(item => item.label);
    }

    console.log('resp global report', resp);
};

const loading = ref(false);

onMounted(() => {
    getGlobalTimelineReport();
});
</script>

<template>
    <master-card>
        <v-card-text>
            <template v-if="loading">
                <div class="d-flex" :style="{
                    alignItems: 'baseline',
                    gap: '10px'
                }">
                    <v-skeleton-loader type="ossein" height="200" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="100" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="130" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="170" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="200" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="100" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="130" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="170" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="100" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="130" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="170" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="130" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="170" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="100" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="130" width="30"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" height="170" width="30"></v-skeleton-loader>
                </div>
            </template>
            <template v-else>
                <div id="chart-global-timeline">
                    <apexchart type="line" height="350" :options="optionGlobalTimeline" :series="seriesGlobalTimeline"></apexchart>
                </div>
            </template>
        </v-card-text>
    </master-card>
</template>