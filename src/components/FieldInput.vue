<template>
    <div>
        <v-text-field 
            variant="outlined"
            v-model="model"
            :clearable="true"
            :disabled="isDisabled"
            :readonly="isReadonly"
            @blur="$emit('changes-event')"
            :value="model"
            :type="props.fieldType"
            :error-messages="props.errorMessage"
            v-if="props.inputType == 'text'">
            <template v-slot:label>
                {{ props.label }}
                <v-icon 
                    :icon="mdiAsterisk" 
                    size="8" 
                    v-if="props.isRequired"
                    color="red"></v-icon>
            </template>

            <template 
                v-if="props.suffixText != ''"
                v-slot:append-inner>
                {{ props.suffixText }}
            </template>

            <template 
                v-if="props.prefixText != ''"
                v-slot:prepend-inner>
                {{ props.prefixText }}
            </template>
        </v-text-field>

        <v-autocomplete
            :multiple="props.isMultiple"
            v-model="model"
            :error-messages="props.errorMessage"
            :clearable="true"
            variant="outlined"
            :items="props.selectOptions"
            v-if="props.inputType == 'select'">
            <!-- <template v-slot:prepend-item v-if="!inventoryTypesAll.length">
                <p class="px-4 cursor-pointer">Add More Data</p>
        
                <v-divider class="mt-2"></v-divider>
            </template> -->

            <template v-slot:label>
                {{ props.label }}
                <v-icon 
                    :icon="mdiAsterisk" 
                    size="8" 
                    color="red"
                    v-if="props.isRequired"></v-icon>
            </template>
        </v-autocomplete>

        <v-date-picker
            v-model="model"
            view-mode="year"
            v-if="props.inputType == 'year-picker'"></v-date-picker>

        <v-textarea
            v-if="props.inputType == 'textarea'"
            :label="props.label"
            :error-messages="props.errorMessage"
            v-model="model"></v-textarea>
    </div>
</template>

<script setup>
import { mdiAsterisk } from '@mdi/js';

const model = defineModel()

defineEmits(['changes-event']);

const props = defineProps({
    label: {
        type: String,
    },
    errorMessage: {
        type: String,
        default: '',
    },
    fieldType: {
        type: String,
        default: 'text',
    },
    inputType: {
        type: String,
        default: 'text',
    },
    selectOptions: {
        type: Array,
    },
    isRequired: {
        type: Boolean,
        default: true,
    },
    suffixText: {
        type: String,
        default: '',
    },
    prefixText: {
        type: String,
        default: '',
    },
    isDisabled: {
        type: Boolean,
        deafult: false,
    },
    isReadonly: {
        type: Boolean,
        default: false,
    },
    isMultiple: {
        type: Boolean,
        default: false,
    },
})
</script>