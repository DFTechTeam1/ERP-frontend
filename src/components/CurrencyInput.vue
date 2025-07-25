<script setup>
import { mdiAsterisk } from '@mdi/js';
import { onMounted, ref, watch } from 'vue';
import { useCurrencyInput } from 'vue-currency-input';

const emit = defineEmits(['change', 'clear-event', 'update:modelValue']);

const props = defineProps({
    options: {
        type: Object,
        default: () => {
            return {
                currency: 'IDR'
            }
        }
    },
    isRequired: {
        type: Boolean,
        default: true
    },
    isReadonly: {
        type: Boolean,
        default: false
    },
    density: {
        type: String,
        default: 'default'
    },
    isSolo: {
        type: Boolean,
        default: false
    },
    isClearable: {
        type: Boolean,
        default: true
    },
    errorMessage: {
        type: String,
        default: '',
    },
    customClass: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    modelValue: Number
});

const fieldTypeValue = ref('text');

const model = defineModel();

const textFieldClass = ref({
    'position-relative': fieldTypeValue.value == 'password',
    'new-border-form-control': props.isSolo,
});

const { inputRef, setValue } = useCurrencyInput(props.options);

const valuePrice = ref(0);

watch(
    () => props.modelValue,
    (values) => {
        setValue(values);
        valuePrice.value = values;
    }
);

onMounted(() => {
    if ((props) && (props.customClass != '')) {
        textFieldClass.value[props.customClass] = true;
    }
});
</script>

<template>
    <div>
        <v-text-field
            :density="props.density"
            :variant=" props.isSolo ? 'solo' : 'outlined'"
            :single-line="props.isSolo"
            autocomplete="off"
            v-model="valuePrice"
            :readonly="props.isReadonly"
            :class="textFieldClass"
            :clearable="props.isClearable"
            :label="props.label"
            @click:clear="$emit('clear-event')"
            :error-messages="props.errorMessage"
            ref="inputRef">
            <template v-slot:label>
                {{ props.label }}
                <v-icon
                    :icon="mdiAsterisk"
                    size="8"
                    v-if="props.isRequired"
                    color="red"></v-icon>
            </template>
        </v-text-field>
        <!-- <input type="text" ref="inputRef" class="currecy-input-elem"> -->
    </div>
</template>