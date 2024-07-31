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
            :density="props.density"
            :class="{
                'position-relative': fieldTypeValue == 'password'
            }"
            :hint="props.hint"
            :error-messages="props.errorMessage"
            v-if="props.inputType == 'text'">

            <!-- <template
                v-slot:append-inner
                v-if="showTogglePassword">
                <template v-if="fieldTypeValue == 'password'">
                    <v-icon
                        class="pointer"
                        :icon="mdiEyeClosed"
                        @click.prevent="togglePassword"
                        size="20"></v-icon>
                </template>
                <template v-else>
                    <v-icon
                        class="pointer"
                        :icon="mdiEyeCircle"
                        @click.prevent="togglePassword"
                        size="20"></v-icon>
                </template>
            </template> -->

            <template v-slot:label>
                {{ props.label }}
                <v-icon 
                    :icon="mdiAsterisk" 
                    size="8" 
                    v-if="props.isRequired"
                    color="red"></v-icon>
            </template>

            <!-- <template 
                v-if="props.suffixText != ''"
                v-slot:append-inner>
                <span v-html="props.suffixText"></span>
            </template> -->

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
            :disabled="props.isDisabled"
            variant="outlined"
            :hint="props.hint"
            :density="props.density"
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

            <template v-slot:item="{ props, item }"
                v-if="props.customOptions">
                <slot :props="props" :item="item" name="selectOption"></slot>
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

        <v-switch
            v-if="props.inputType == 'switch'"
            v-model="model"
            :label="props.label"
            color="primary"
            :value="1"></v-switch>
    </div>
</template>

<script setup>
import { mdiAsterisk, mdiEyeCircle, mdiEyeClosed } from '@mdi/js';
import { watch } from 'vue';
import { ref } from 'vue';

const model = defineModel()

defineEmits(['changes-event']);

const fieldTypeValue = ref('password');

const showTogglePassword = ref(false);

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
    customOptions: {
        type: Boolean,
        default: false,
    },
    hint: {
        type: String,
        default: '',
    },
    density: {
        type: String,
        default: 'default'
    }
})

watch(props, (values) => {
    fieldTypeValue.value = values.fieldType;
    
    if (values.fieldType == 'password') {
        showTogglePassword.value = true;
    }
})

function togglePassword() {
    if (fieldTypeValue.value == 'password') {
        fieldTypeValue.value = 'text';
    } else if (fieldTypeValue.value == 'text') {
        fieldTypeValue.value = 'password';
    }
}
</script>