<template>
    <div class="mt-5">
        <div class="title-desc d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-5">
                <v-icon
                    :icon="mdiTimeline"
                    size="20"></v-icon>
                <h3>{{ $t('timeTracker') }}</h3>
            </div>
        </div>

        <div>
            <template
                v-for="(tracker, x) in props.times"
                :key="x">
                <v-stepper class="main-stepper" alt-labels :model-value="tracker.length">
                    <v-stepper-header>
        
                        <template 
                            v-for="(log, i) in tracker"
                            :key="i">
                            <v-divider v-if="i"></v-divider>
                            <v-stepper-item v-bind="log" :value="(parseInt(i)+1)" complete>
                                <template v-slot:title>
                                    {{ log.status_text }}
                                </template>
            
                                <template v-slot:subtitle>
                                    {{ log.time_added }}
                                </template>
                            </v-stepper-item>
        
                        </template>
        
                    </v-stepper-header>
                </v-stepper>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
.main-stepper {
    background-color: transparent !important;
    box-shadow: none !important;

    button {
        font-size: 12px;
    }

    .v-stepper-item__title {
        margin-bottom: 5px;
    }
}

</style>

<script setup>
import { mdiTimeline } from '@mdi/js';

const props = defineProps({
    times: {
        default: [],
    }
})
</script>