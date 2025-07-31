<script setup>
import reportingBridge from '@/plugins/reportingBridge';
import { onMounted, ref } from 'vue';

const optionPerTeamTimeline = ref({
    chart: {
        height: 350,
        type: 'line',
    },
    colors: ['#4284f5', '#eb4235', '#FFEB3B', '#66BB6A'],
    stroke: {
        width: [0, 0, 4, 4]
    },
    title: {
        text: 'Project Timeline Global (Month)'
    },
    dataLabels: {
        enabled: true,
        enabledOnSeries: [2,3]
    },
    legend: {
        show: true,
        position: 'top'
    },
    stroke: {
        curve: 'smooth',
        width: [1, 1, 4, 4]
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

const seriesPerTeamTimeline = ref([
    {
        name: 'Project Duration',
        type: 'column',
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    },
    {
        name: 'Project Duration New',
        type: 'column',
        data: [300, 290, 350, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    },
    {
        name: 'Total Task',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
    },
    {
        name: 'Total Task',
        type: 'line',
        data: [300, 242, 135, 227, 343, 422, 127, 231, 222, 22, 12, 16]
    }
]);

const getGlobalTimelineReport = async () => {
    loading.value = true;
    const resp = await reportingBridge.post('/report/project-timeline/team', {
        "start_month": null,
        "end_month": null,
        "start_quartal": 1,
        "end_quartal": 4,
        "start_year": 2025,
        "end_year": 2025,
        "range_type": "quartal",
        "project_class_id": 3,
        "pic_id": [3,5]
    });
    loading.value = false;

    if (resp.status < 300) {
        seriesPerTeamTimeline.value = resp.data.data.data.map((item) => {
            return {
                name: `Project Duration ${item.name}`,
                type: 'column',
                data: item.data
            };
        });

        let totalProjectFormat = resp.data.data.total_project.map((item) => {
            return {
                name: `Total Project ${item.name}`,
                type: "line",
                data: item.data
            }
        });

        seriesPerTeamTimeline.value = seriesPerTeamTimeline.value.concat(totalProjectFormat);
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
                <div id="chart-team-timeline">
                    <apexchart type="line" height="350" :options="optionPerTeamTimeline" :series="seriesPerTeamTimeline"></apexchart>
                </div>
            </template>
        </v-card-text>
    </master-card>
</template>