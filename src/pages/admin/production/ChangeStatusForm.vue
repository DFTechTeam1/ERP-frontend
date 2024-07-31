<template>
    <v-dialog v-model="show"
        persistent
        max-width="400">
        <v-card>
            <v-card-item>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between">
                        {{ $t('changeStatusTo') }}
                        <v-icon
                            :icon="mdiClose"
                            class="cursor-pointer"
                            @click.prevent="$emit('close-event')"></v-icon>
                    </div>
                </v-card-title>
            </v-card-item>
            <v-card-text>
                <v-form @submit="validateData">
                    <field-input :label="t('status')"
                        input-type="select"
                        v-model="status"
                        :select-options="listOfProjectStatusses"></field-input>

                    <v-btn flat color="primary" type="submit" :disabled="loading">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('submit') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { mdiClose } from '@mdi/js'

const { t } = useI18n()

const { defineField, handleSubmit } = useForm({
    validationSchema: yup.object({
        status: yup.string().required(t('statusRequired')),
    }),
})

const [status] = defineField('status')

const store = useProjectStore()

const { listOfProjectStatusses } = storeToRefs(store)

const show = ref(false)

const loading = ref(false)

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    uid: {
        type: String,
        default: '',
    },
    baseStatus: {
        default: null,
    },
})

function getProjectStatus() {
    store.getProjectStatusses()
}

const validateData = handleSubmit(async (values) => {
    values.base_status = props.baseStatus

    loading.value = true
    const resp = await store.changeStatus(values, props.uid)
    loading.value = false

    if (resp.status < 300) {
        emit('close-event', true)
    }
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        getProjectStatus()
    }
})
</script>