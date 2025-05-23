<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProjectDetailForm from './ProjectDetailForm.vue';
import { mdiCheck } from '@mdi/js';

const { t } = useI18n();

const items = ref([
    'Detail Event',
    'Calculation',
    'Summary'
]);

const step = ref(1);

function nextEvent() {
    step.value += 1;
}

function backEvent() {
    step.value -= 1;

    console.log('step', step.value);
}
</script>

<template>
    <div>
        <v-stepper
            non-linear
            v-model="step"
            alt-labels
            :items="items"
            hide-actions
            class="deals-stepper">

            <template v-slot:item.1>
                <div class="pt-4">
                    <ProjectDetailForm @next-event="nextEvent" @back-event="backEvent" />
                </div>
            </template> 
            <template v-slot:item.2>
            </template> 
        </v-stepper>
    </div>
</template>

<style lang="scss">
.deals-stepper .v-window {
    box-shadow: none;
}

.custom-input .v-input__details {
    display: none;
    transition: all 1s;
}

.custom-input.v-input--error .v-input__details {
    display: flex !important;
}
</style>

<style lang="scss" scoped></style>