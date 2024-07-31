<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('filter') }}

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form>
                    <field-input
                        :label="t('employeeName')"
                        v-model="employee_name"
                        :is-required="false"></field-input>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js'
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const { t } = useI18n()

const { defineField } = useForm({
    validationSchema: yup.object({
        employee_name: yup.string().nullable(),
    }),
})

const [employee_name] = defineField('employee_name')

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const show = ref(false)

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})
</script>