<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('chooseTeamMember') }}

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="closeForm"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-skeleton-loader type="list-item-two-line" v-if="loadingPrepare"></v-skeleton-loader>
                <v-form v-else @submit="validateData">
                    <field-input
                        :label="t('selectProjectToBeWork')"
                        input-type="select"
                        :select-options="listOfAllProjects"
                        v-model="project_id"
                        class="mb-2"
                        v-if="!props.projectUid"
                        :error-message="errors.project_id"></field-input>

                    <field-input
                        :label="t('choosePic')"
                        v-model="pic_id"
                        class="mb-2"
                        input-type="select"
                        :select-options="picList"
                        :error-message="errors.pic_id"></field-input>

                    <field-input
                        :label="t('chooseTeam')"
                        v-model="teams"
                        class="mb-2"
                        :error-message="errors.teams"
                        :custom-options="true"
                        input-type="select"
                        :is-multiple="true"
                        :is-disabled="loadingGetTeams"
                        :select-options="teamList">
                        <template v-slot:selectOption="{ props, item }">
                            <v-list-item v-bind="props">

                                <template v-slot:title>
                                    {{ item.raw.title }}
                                </template>
                                <template v-slot:subtitle>
                                    {{ item.raw.task }}
                                </template>

                            </v-list-item>
                        </template>
                    </field-input>

                    <field-input
                        :label="t('reason')"
                        v-model="reason"
                        :error-message="errors.reason"></field-input>

                    <!-- <field-input
                        :label="t('selectTaskToWork')"
                        :is-required="false"
                        v-model="task_id"
                        :error-response="errors.task_id"
                        input-type="select"
                        :select-options="taskList"></field-input> -->

                    <v-btn
                        class="w-100 mt-2"
                        variant="flat"
                        color="primary"
                        :disabled="loading"
                        type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';

const { t } = useI18n()

const store = useProjectStore()

const { listOfAllProjects } = storeToRefs(store)

const { defineField, errors, setFieldValue, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        pic_id: yup.string().required(t('picRequired')),
        teams: yup.array().required(t('teamRequired')),
        reason: yup.string().required(t('reasonRequired')),
        task_id: yup.string().nullable(),
        project_id: yup.string().nullable(),
    }),
})

const [pic_id] = defineField('pic_id')
const [teams] = defineField('teams')
const [reason] = defineField('reason')
// const [task_id] = defineField('task_id')
const [project_id] = defineField('project_id')

const show = ref(false)

const loading = ref(false)

const loadingPrepare = ref(false)

const loadingGetTeams = ref(false)

const teamList = ref([])

const picList = ref([])

const taskList = ref([])

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    projectUid: {
        type: String,
        default: null,
    },
})

async function getPicTeams(picUid) {
    loadingGetTeams.value = true
    setFieldValue('teams', null)
    const resp = await store.getPicTeams(props.projectUid || project_id.value, picUid)
    loadingGetTeams.value = false

    if (resp.status < 300) {
        teamList.value = resp.data.data
    } else {
      teamList.value = []
    }
}

async function getTargetPicsAndTaskList() {
    loadingPrepare.value = true
    const resp = await store.getTargetPicsAndTaskList(props.projectUid || project_id.value)
    loadingPrepare.value = false

    if (resp.status < 300) {
        picList.value = resp.data.data.pics
        taskList.value = resp.data.data.tasks
    }
}

async function initAllProject() {
    await store.getAllProjects()
}

const validateData = handleSubmit(async (values) => {
    loading.value = true
    const resp = await store.loadTeamMember(values, props.projectUid || project_id.value)
    loading.value = false

    if (resp.status < 300) {
        resetForm()
        emit('close-event', true)
    }
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        if (values.isShow && props.projectUid) {
            getTargetPicsAndTaskList()
        }

        if (!props.projectUid) {
            initAllProject()
        }
    }
})

watch(project_id, (values) => {
    if (values) {
        getTargetPicsAndTaskList()
    }
})

watch(pic_id, (values) => {
    if (values) {
        getPicTeams(values)
    } else {
        setFieldValue('teams', [])
    }
})

function closeForm() {
    resetForm()
    emit('close-event')
}
</script>
