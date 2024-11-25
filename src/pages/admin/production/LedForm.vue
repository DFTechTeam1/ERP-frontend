<template>
    <v-dialog
        persistent
        max-width="500"
        v-model="show">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('addLedDetail') }}

                    <v-icon
                        :icon="mdiClose"
                        size="16"
                        @click.prevent="closeForm"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <field-input
                        :label="t('name')"
                        style="transition: all .3s;"
                        v-model="name"
                        :class="{
                            'mb-3': errors.name
                        }"
                        :error-message="errors.name"
                        density="compact"

                        ></field-input>

                    <div class="size-wrapper">
                        <div class="size-item d-flex ga-2"
                            style="transition: all .3s;"
                            v-for="(field, idx) in fields"
                            :key="field.key"
                            :id="'row-size-' + idx"
                            :class="{
                                'mb-3': errors[`led[${idx}].width`] || errors[`led[${idx}].height`]
                            }">
                            <field-input
                                class="w-100"
                                :label="t('width')"
                                v-model="field.value.width"
                                :error-message="errors[`led[${idx}].width`]"
                                density="compact" ></field-input>
                            <field-input
                                class="w-100"
                                :label="t('height')"
                                v-model="field.value.height"
                                :error-message="errors[`led[${idx}].height`]"
                                density="compact" ></field-input>
                            <v-btn
                                :icon="mdiPlus"
                                v-if="idx == 0"
                                color="primary"
                                class="mt-2"
                                variant="outlined"
                                density="compact"
                                @click.prevent="push({height: '1', width: '1'})"></v-btn>
                            <v-btn
                                :icon="mdiClose"
                                v-else
                                color="red"
                                class="mt-2"
                                variant="outlined"
                                density="compact"
                                @click.prevent="remove(idx)"></v-btn>
                        </div>
                    </div>

                    <v-btn class="w-100 mt-3"
                        variant="flat"
                        color="primary"
                        type="submit">
                        {{ $t('save') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose, mdiPlus } from '@mdi/js';
import { useFieldArray, useForm } from 'vee-validate';
import {onMounted, ref, watch} from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup'

const { t } = useI18n()

const show = ref(false)

const { defineField, handleSubmit, errors, resetForm, setFieldValue } = useForm({
    validationSchema: yup.object({
        led: yup.array().of(
            yup.object().shape({
                width: yup.string().required(t('ledWidthRequired')),
                height: yup.string().required(t('ledHeightRequired')),
            }),
        ),
        name: yup.string().required(t('nameRequired')),
    }),
})

const { push, fields, remove, replace } = useFieldArray('led');
const [name] = defineField('name')

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close-event'])

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        if (values.isShow) {
            initSize()
        }
    }
})

onMounted(() => {
  setFieldValue('name', 'main');
  setFieldValue('led', [{width: '1', height: '1'}]);

  validateData();
})

function initSize() {
    replace([
        {
            height: '1',
            width: '1',
        },
    ])
}

function closeForm() {
    emit('close-event')
}

function formatTotalLed(data) {
    return data + ' m<sup>2</sup>'
}

const validateData = handleSubmit(async (values) => {

    var areas = [];
    var textDetail = ''
    for (let a = 0; a < values.led.length; a++) {
        var width = values.led[a].width;
        var height = values.led[a].height;

        var total = parseFloat(width) * parseFloat(height);
        areas.push(parseFloat(total.toFixed(2)));

        textDetail += width + ' x ' + height + ' m'
        if (a == 0 && values.led.length > 1) {
            textDetail += " , "
        }
    }
    var sum = areas.reduce((a, b) => a + b);

    values.total = formatTotalLed(sum.toString())
    values.totalRaw = sum.toString()
    values.textDetail = textDetail

    resetForm()
    emit('close-event', values)
})
</script>
