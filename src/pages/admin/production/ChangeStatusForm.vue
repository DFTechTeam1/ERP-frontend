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
                            @click.prevent="closeStatusForm(false)"></v-icon>
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

                <ConfirmationModal
                    :title="t('removePicConfirmation')"
                    :text="t('removePicText')"
                    :show-confirm="showConfirmation"
                    :close-emit="true"
                    @actionBulkSubmit="deletePic"
                    @cancelConfirm="doNotDeletePic"></ConfirmationModal>
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
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const { t } = useI18n()

const { defineField, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema: yup.object({
        status: yup.string().required(t('statusRequired')),
        remove_pic: yup.string().nullable(),
    }),
})

const [status] = defineField('status')
const [remove_pic] = defineField('remove_pic')

const store = useProjectStore()

const { listOfProjectStatusses } = storeToRefs(store)

const show = ref(false)

const showConfirmation = ref(false)

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
    project: {
        default: null,
    },
})

function getProjectStatus() {
    store.getProjectStatusses(props.uid)
}

const validateData = handleSubmit((values) => {
    values.base_status = props.baseStatus

    if (values.status == 8 && !props.project.no_pic) {
        showConfirmation.value = true
        return
    }

    processForm(values)
})

async function processForm(values) {
    loading.value = true
    const resp = await store.changeStatus(values, props.uid)
    loading.value = false
    
    if (resp.status < 300) {
        closeStatusForm(true)
    }
}

function doNotDeletePic() {
    setFieldValue('remove_pic', '0')

    showConfirmation.value = false
}

function deletePic() {
    setFieldValue('remove_pic', '1')

    showConfirmation.value = false

    cancelProject({
        status: status.value,
        remove_pic: remove_pic.value,
        pic_list: props.project.pic_eid,
    })
}

async function cancelProject(values) {
    const resp = await store.cancelProject(values, props.uid)

    if (resp.status < 300) {
        closeStatusForm(true)
    }
}

function closeStatusForm(isRefresh = false) {
    resetForm()
    emit('close-event', isRefresh)
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        if (values.isShow) {
            getProjectStatus()
        }
    }
})
</script>