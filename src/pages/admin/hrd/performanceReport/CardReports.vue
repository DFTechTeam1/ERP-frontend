<template>
    <div>
        <v-row>
            <!-- upper row -->
            <v-col
                cols="12"
                md="4">
                <GeneralReport></GeneralReport>
            </v-col>
            <v-col
                cols="12"
                md="4">
                <WorkloadChart></WorkloadChart>
            </v-col>
            <v-col
                cols="12"
                md="4">
                <TotalProject></TotalProject>
            </v-col>
            <!-- end upper row -->
        </v-row>

        <v-row>
            <!-- bottom row -->
            <v-col
                cols="12"
                md="6">
                <PointDetail></PointDetail>
            </v-col>
            <v-col
                cols="12"
                md="6">
                <TaskListPreview></TaskListPreview>
            </v-col>
            <!-- end bottom row -->
        </v-row>
    </div>
</template>

<script setup>
import GeneralReport from './GeneralReport.vue';
import WorkloadChart from './WorkloadChart.vue';
import TotalProject from './TotalProject.vue';
import TaskListPreview from './TaskListPreview.vue';
import PointDetail from './PointDetail.vue';
</script>