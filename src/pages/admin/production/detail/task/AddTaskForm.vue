<template>
    <v-dialog
        v-model="show"
        max-width="600"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('addTask') }} {{ additionalTitle ? '(' + additionalTitle + ')' : '' }}
                    <v-icon
                        :icon="mdiClose"
                        color="red"
                        size="20"
                        @click.prevent="closeForm"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <field-input
                        :label="t('selectProject')"
                        input-type="select"
                        v-if="!route.params.id"
                        v-model="project_id"
                        :select-options="listOfAllProjects"
                        :error="errors.project_id"></field-input>

                    <field-input
                        class="mt-3"
                        :label="t('selectTargetBoard')"
                        input-type="select"
                        v-if="!route.params.id"
                        v-model="board_id"
                        :select-options="boardList"
                        :error="errors.board_id"></field-input>

                    <field-input
                        :class="{
                            'mt-3': !route.params.id
                        }"
                        :label="t('detail')"
                        v-model="name"
                        :error-message="errors.name"></field-input>

                    <date-picker
                        class="mt-3"
                        :label="t('dueDate')"
                        :is-required="false"
                        v-model="due_date"
                        :error-message="errors.due_date"></date-picker>

                    <field-input
                        class="mt-3"
                        :label="t('pic')"
                        input-type="select"
                        :select-options="teamList"
                        v-model="pic"
                        :is-required="false"
                        :is-multiple="true"
                        :error-message="errors.pic"></field-input>

                    <v-label>{{ $t('attachments') }}</v-label>
                    <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            v-on:addfile="updateImages"
                            maxFileSize="35MB"
                            accepted-file-types="image/png, image/jpg, image/jpeg, image/webp, application/pdf"
                        ></file-pond-com>

                    <button-submit
                        :is-loading="loading"></button-submit>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useProjectStore } from '@/stores/project'
import { mdiClose } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const emit = defineEmits(['close-event'])

const store = useProjectStore()

const { detailProject, listOfAllProjects } = storeToRefs(store)

const { t } = useI18n()

const route = useRoute()

const { defineField, errors, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema: yup.object({
        task_type: yup.string().nullable(t('taskTypeRequired')),
        due_date: yup.string().nullable(),
        pic: yup.array().nullable(),
        project_id: yup.string().nullable(),
        board_id: yup.string().nullable(),
        name: yup.string().required(t('nameRequired'))
    }),
})

const [name] = defineField('name')
const [due_date] = defineField('due_date')
const [pic] = defineField('pic')
const [project_id] = defineField('project_id')
const [board_id] = defineField('board_id')

const pond = ref(null)

const loading = ref(false)

const show = ref(false)

const media = ref([])

const taskTypes = ref([])

const teamList = ref([])

const boardList = ref([])

const additionalTitle = ref(null)

const props = defineProps({
    board: {
        default: null,
    },
    isShow: {
        type: Boolean,
        default: false,
    }
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        initTaskTypes()

        if (detailProject.value) {
            teamList.value = detailProject.value.teams.map((team) => {
                return {
                    title: team.name,
                    value: team.uid,
                }
            })

            additionalTitle.value = detailProject.value.name
        } else {
            initProjectList()
            initBoardList()
        }
    }
})

watch(project_id, (values) => {
    if (values) {
        getProjectBoard(values)
        getProjectTeams(values)
    } else {
        boardList.value = []
        setFieldValue('board_id', null)
    }
})

async function getProjectTeams(values) {
    const resp = await store.getProjectTeams(values)

    teamList.value = resp
}

async function getProjectBoard(values) {
    setFieldValue('board_id', null)
    const resp = await store.getProjectBoards(values)

    boardList.value = resp
}

async function initProjectList() {
    await store.getAllProjects()
}

function initBoardList() {

}

function closeForm() {
    resetForm()
    emit('close-event')
}

async function initTaskTypes() {
    const resp = await store.getTaskTypes()

    if (resp.status < 300) {
        taskTypes.value = resp.data.data
    }
}

const validateData = handleSubmit(async(values) => {
    loading.value = true

    var formData = new FormData()
    formData.append('name', values.name)

    if (values.due_date) {
        formData.append('end_date', values.due_date)
    }

    if (values.pic) {
        for (let a = 0; a < values.pic.length; a++) {
            formData.append(`pic[${a}]`, values.pic[a])
        }
    }

    if (media.value.length) {
        for (let i = 0; i < media.value.length; i++) {
            formData.append(`media[${i}]`, media.value[i])
        }
    }

    var boardId = props.board ? props.board.id : board_id.value

    const resp = await store.addTask(formData, boardId)
    loading.value = false
    if (resp.status < 300) {
        media.value = []
        resetForm()

        if (props.board) {
            emit('close-event')
        } else {
            emit('close-event', true)
        }
    }
})

function updateImages() {
    if (pond.value) {
        media.value = pond.value.getFiles().map((e) => {
            return e.file
        })
    } else {
        media.value = []
    }
}
</script>
