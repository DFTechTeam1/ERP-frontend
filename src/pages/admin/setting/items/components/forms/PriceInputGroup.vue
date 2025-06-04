<script setup>
import { ref } from 'vue';

defineEmits(['on-blur', 'on-focus']);

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
    },
    typeOptions: {
        type: Array,
        default: []
    }
});

const modelOption = defineModel('option');

const modelValue = defineModel('value');

const formatPrice = () => {
    modelValue.value = parseFloat(modelValue.value).toLocaleString();
}

const normalizePrice = () => {
    modelValue.value = modelValue.value.toString().replaceAll(',', '');
}
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
                :items="typeOptions"></v-autocomplete>

            <v-text-field
                :label="props.valueLabel"
                :is-solo="props.isSolo"
                :single-line="true"
                :style="{
                    width: '65%'
                }"
                class="custom-input"
                variant="solo"
                v-model="modelValue"
                density="compact"
                @blur="formatPrice"
                @focus="normalizePrice">
                <template v-slot:append-inner v-if="props.showAppendInner">
                    <slot name="append-item"></slot>
                </template>
                <template v-slot:prepend-inner v-if="props.showPrependInner">
                    <slot name="prepend-item"></slot>
                </template>
            </v-text-field>
        </div>
    </div>
</template>