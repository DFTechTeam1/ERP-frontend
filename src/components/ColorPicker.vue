<template>
    <div>
        <v-text-field
            readonly
            v-model="model"
            :clearable="true"
            :density="props.density"
            :class="{
            'new-border-form-control': props.isSolo
            }"
            :variant=" props.isSolo ? 'solo' : 'outlined'"
            :hide-details="props.isSolo"
            :single-line="props.isSolo"
            :error-messages="props.errorMessage"
            @click:control="showColorPicker">

            <template v-slot:label>
                {{ props.label }}
                <v-icon 
                    :icon="mdiAsterisk" 
                    size="8" 
                    color="red"
                    v-if="props.isRequired"></v-icon>
            </template>
        </v-text-field>

        <v-dialog
            v-model="isShowColorPicker"
            width="auto">
                <v-card>
                    <v-card-text style="padding: 0 !important;">
                        <v-color-picker
                            v-model:mode="mode"
                            v-model="color"
                            @update:modelValue="handleColor"></v-color-picker>
                    </v-card-text>
                </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { mdiAsterisk } from '@mdi/js';
    import { ref, onMounted } from 'vue';

    const model = defineModel()

    const color = ref('#000000')

    const mode = ref('hexa')

    const props = defineProps({
        label: {
            type: String,
            required: true,
        },
        isRequired: {
            type: Boolean,
            default: true,
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
    })

    const isShowColorPicker = ref(false);

    function showColorPicker() {
        isShowColorPicker.value = true;
    }

    function handleColor(val) {
        model.value = color.value
        isShowColorPicker.value = false;
    }

    onMounted(() => {
        if (model.value) {
            color.value = model.value;
        }
    })
</script>