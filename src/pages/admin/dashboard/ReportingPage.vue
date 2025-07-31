<script setup>
import GlobalTimelineReport from './report/GlobalTimelineReport.vue';
import PerTeamTimelineReport from './report/PerTeamTimelineReport.vue';
import PerEmployeeReport from './report/PerEmployeeReport.vue';
</script>

<template>
    <v-row>
        <v-col cols="12" md="6">
            <global-timeline-report />
        </v-col>
        <v-col cols="12" md="6">
            <per-team-timeline-report />
        </v-col>
        <v-col cols="12" md="6">
            <per-employee-report />
        </v-col>
    </v-row>
</template>