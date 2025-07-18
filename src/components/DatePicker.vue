<template>
    <div>
        <v-text-field
            readonly
            v-model="model"
            :clearable="true"
            :density="props.density"
            :class="pickerClass"
            :variant=" props.isSolo ? 'solo' : 'outlined'"
            :hide-details="props.isSolo"
            :single-line="props.isSolo"
            :disabled="props.isDisabled"
            :error-messages="props.errorMessage"
            @click:control="showDatePicker">

            <template v-slot:label>
                {{ props.label }}
                <v-icon 
                    :icon="mdiAsterisk" 
                    size="8" 
                    color="red"
                    v-if="props.isRequired"></v-icon>
            </template>
        </v-text-field>

        <dialog-date-time-picker
            :is-show="isShowDatePicker"
            :with-time-picker="props.withTimePicker"
            @submit-event="handleDate"></dialog-date-time-picker>
    </div>
</template>

<script setup>
import { mdiAsterisk } from '@mdi/js';
import { ref, onMounted } from 'vue';

const model = defineModel()

const date = ref(new Date());

const pickerClass = ref('');

const props = defineProps({
    customClass: {
        type: String,
        default: ''
    },
    withTimePicker: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        required: true,
    },
    isRequired: {
        type: Boolean,
        default: true,
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    isSolo: {
        type: Boolean,
        default: false,
    },
    density: {
        type: String,
        default: 'default',
    },
    errorMessage: {
        type: String,
    },
    minDate: {
        type: String,
    },
    maxDate: {
        type: String,
    },
    formatOutput: {
        type: String,
        default: 'default'
    }
})

const isShowDatePicker = ref(false);

function showDatePicker() {
    isShowDatePicker.value = true;
}

function handleDate(val) {
    if (val) {
        model.value = val;
    }
    
    isShowDatePicker.value = false;
}

onMounted(() => {
    if (model.value) {
        console.log('mounte');
        date.value = new Date(model.value);
    }

    if ((props) && (props.customClass)) {
        pickerClass.value = {
            'new-border-form-control': props.isSolo
        };

        pickerClass.value[props.customClass] = true;
    }
});
</script>
