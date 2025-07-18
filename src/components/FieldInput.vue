<template>
    <div>
        <v-text-field
            :variant=" props.isSolo ? 'solo' : 'outlined'"
            :single-line="props.isSolo"
            v-model="model"
            autocomplete="off"
            :clearable="props.isClearable"
            @click:clear="$emit('clear-event')"
            :disabled="isDisabled"
            :readonly="isReadonly"
            @blur="$emit('changes-event')"
            :value="model"
            :type="props.fieldType"
            :density="props.density"
            :class="textFieldClass"
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
            autocomplete="off"
            :multiple="props.isMultiple"
            v-model="model"
            :return-object="props.isReturnObject"
            :error-messages="props.errorMessage"
            :clearable="props.isClearable"
            :item-value="props.itemValue"
            :item-title="props.itemTitle"
            :disabled="props.isDisabled"
            variant="outlined"
            :single-line="props.isSolo"
            :hint="props.hint"
            :density="props.density"
            :items="props.selectOptions"
            :class="selectFieldClass"
            @update:model-value="getChanges"
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

        <v-number-input
            v-model="model"
            :reverse="false"
            variant="outlined"
            control-variant="default"
            :label="props.label"
            :error-messages="props.errorMessage"
            v-if="props.inputType == 'number'"></v-number-input>

        <v-textarea
            v-if="props.inputType == 'textarea'"
            :label="props.label"
            variant="outlined"
            :single-line="props.isSolo"
            :rows="props.row"
            :error-messages="props.errorMessage"
            v-model="model"></v-textarea>

        <v-switch
            v-if="props.inputType == 'switch'"
            v-model="model"
            :label="props.label"
            color="primary"
            value="1"></v-switch>
    </div>
</template>

<script setup>
import { mdiAsterisk, mdiEyeCircle, mdiEyeClosed } from '@mdi/js';
import { onMounted, watch } from 'vue';
import { ref } from 'vue';

const model = defineModel()

const emit = defineEmits(['changes-event', 'clear-event']);

const fieldTypeValue = ref('password');

const showTogglePassword = ref(false);

const props = defineProps({
    itemValue: {
        type: String,
        default: 'value'
    },
    itemTitle: {
        type: String,
        default: 'title'
    },
    customClass: {
        type: String,
        default: ''
    },
    row: {
        type: Number,
        default: 5
    },
    isReturnObject: {
        type: Boolean,
        default: false
    },
    isClearable: {
      type: Boolean,
      default: true,
    },
    keyIndex: {
      default: ''
    },
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
    },
    isSolo: {
        type: Boolean,
        default: false,
    }
});

const textFieldClass = ref({
    'position-relative': fieldTypeValue == 'password',
    'new-border-form-control': props.isSolo,
});

const selectFieldClass = ref('');

onMounted(() => {
    if ((props) && (props.customClass != '')) {
        textFieldClass.value[props.customClass] = true;

        selectFieldClass.value = {};
        selectFieldClass.value[props.customClass] = true;
    }
});

watch(props, (values) => {
    fieldTypeValue.value = values.fieldType;

    if (values.fieldType == 'password') {
        showTogglePassword.value = true;
    }
})

function getChanges(payload) {
  emit('changes-event', {payload: payload, index: props.keyIndex});
}

function togglePassword() {
    if (fieldTypeValue.value == 'password') {
        fieldTypeValue.value = 'text';
    } else if (fieldTypeValue.value == 'text') {
        fieldTypeValue.value = 'password';
    }
}
</script>
