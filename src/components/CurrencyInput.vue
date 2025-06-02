<script setup>
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
    modelValue: Number
});

const fieldTypeValue = ref('text');

const model = defineModel();

const textFieldClass = ref({
    'position-relative': fieldTypeValue.value == 'password',
    'new-border-form-control': props.isSolo,
});

const { inputRef, setValue } = useCurrencyInput(props.options);

watch(model, (values) => {
    setValue(values);
})

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
            :class="textFieldClass"
            :clearable="props.isClearable"
            @click:clear="$emit('clear-event')"
            :error-messages="props.errorMessage"
            ref="inputRef"></v-text-field>
    </div>
</template>