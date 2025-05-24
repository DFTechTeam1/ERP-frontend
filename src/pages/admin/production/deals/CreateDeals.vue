<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ProjectDetailForm from './ProjectDetailForm.vue';
import CalculationForm from './CalculationForm.vue';

const { t } = useI18n();

const detailFormRef = ref(null);

const calculationFormRef = ref(null);

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

function getDetailValue() {
    let values = detailFormRef.value.getValues();

    return values;
}

watch(step, (values) => {
    setTimeout(() => {
        if (values && step.value == 2) {
            calculationFormRef.value.setPreview(detailFormRef.value.getValues());
            calculationFormRef.value.checkHighSeason();
        }
    }, 500);
})
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
                    <ProjectDetailForm
                        ref="detailFormRef"
                        @next-event="nextEvent"
                        @back-event="backEvent" />
                </div>
            </template> 
            <template v-slot:item.2>
                <div class="pt-4">
                    <CalculationForm
                        ref="calculationFormRef"
                        @next-event="nextEvent"
                        @back-event="backEvent" />
                </div>
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