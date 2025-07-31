<script setup>
import reportingBridge from '@/plugins/reportingBridge';
import { onMounted, ref } from 'vue';

const loading = ref(false);

const optionPerEmployee = ref({
    chart: {
        height: 350,
        type: 'line',
    },
    colors: ['#4284f5', '#fbbc04', '#ef6e64', '#38aa56'],
    stroke: {
        width: [1]
    },
    title: {
        text: 'Gilang Rizky Al Mizan (Animator)'
    },
    dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
    },
    legend: {
        show: true,
        position: 'top'
    },
    fill: {
        opacity: [1,1,1,.2]
    },
    stroke: {
        curve: 'smooth',
        width: [1, 1, 4, 2]
    },
    labels: [],
    yaxis: [{
        title: {
            text: 'Duration',
        },
    
    }, {
        opposite: true,
        title: {
            text: 'Total Task'
        }
    }]
});

const seriesPerEmployee = ref([
    {
        name: 'Actual Task Qty',
        type: 'column',
        data: []
    },
    {
        name: 'Target Task Qty',
        type: 'column',
        data: []
    },
    {
        name: 'Duration',
        type: 'line',
        data: []
    },
    {
        name: "Target Duration",
        type: 'area',
        data: []
    }
]);

const getEmployeeReport = async () => {
    loading.value = true;
    const resp = await reportingBridge.post('/report/employee-performance', {
        "year": 2025,
        "project_class_id": 3,
        "position_backup": 8,
        "employee_id": 11
    });
    console.log('resp employee report', resp);
    loading.value = false;

    if (resp.status < 300) {
        optionPerEmployee.value.labels = resp.data.data.data[0].label;
        seriesPerEmployee.value[0].data = resp.data.data.data[2].actual_task_qty;
        seriesPerEmployee.value[1].data = resp.data.data.data[1].target_task_qty;
        seriesPerEmployee.value[2].data = resp.data.data.data[4].actual_dur;
        seriesPerEmployee.value[3].data = resp.data.data.data[3].target_dur;
    }
}

onMounted(() => {
    getEmployeeReport();
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
                    <apexchart type="line" height="350" :options="optionPerEmployee" :series="seriesPerEmployee"></apexchart>
                </div>
            </template>
        </v-card-text>
    </master-card>
</template>