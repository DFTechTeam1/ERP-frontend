<script setup>
import { T } from 'unplugin-vue-router/options-ChnxZdan';
import { ref } from 'vue';

const props = defineProps({
    optionLabel: String,
    valueLabel: String,
    isSolo: {
        type: Boolean,
        default: false
    },
    showAppendInner: {
        type: Boolean,
        default: false
    },
    showPrependInner: {
        type: Boolean,
        default: false
    }
});

const modelOption = ref();

const modelValue = ref();

const getValue = () => {
    return {
        option: modelOption.value,
        value: modelValue.value
    };
};

defineExpose({
    getValue
})
</script>

<template>
    <div class="d-flex w-100 mb-5">
        <label for="company-name" class="w-100 align-content-center">{{ props.optionLabel }}</label>

        <div class="d-flex align-center w-100">
            <v-autocomplete
                label="Type"
                :is-solo="props.isSolo"
                class="custom-input"
                v-model="modelOption"
                :style="{
                    width: '35%'
                }"
                :single-line="true"
                variant="solo-filled"
                density="compact"
                :items="types"></v-autocomplete>

            <v-text-field
                :label="t('valueLabel')"
                :is-solo="props.isSolo"
                :single-line="true"
                :style="{
                    width: '65%'
                }"
                class="custom-input"
                variant="solo"
                v-model="modelValue"
                density="compact ">
                <template v-slot:append-inner v-if="props.showAppendInner">
                    <slot name="appendItem"></slot>
                </template>
                <template v-slot:prepend-inner v-if="props.showPrependInner">
                    <slot name="prependItem"></slot>
                </template>
            </v-text-field>
        </div>
    </div>
</template>