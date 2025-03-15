<template>
    <div>
        <breadcrumb-data :title="$t('task')" :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item class="mb-2">
                <v-card-title>
                    <div class="d-flex align-center justify-space-between">
                        {{ $t('allTask') }}

                        <v-menu v-if="useCheckPermission('add_task') && useCheckPermission('create_project')">
                            <template v-slot:activator="{ props }">
                                <v-btn variant="outlined"
                                    color="primary"
                                    density="compact"
                                    v-bind="props">
                                    {{ $t('chooseAction') }}

                                    <v-icon :icon="mdiChevronDown"></v-icon>
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item class="pointer btn-action-item"
                                    @click.prevent="openProjectForm">
                                    {{ $t('createProject') }}
                                </v-list-item>
                                <v-list-item class="pointer btn-action-item"
                                    @click.prevent="openTaskForm">
                                    {{ $t('createTask') }}
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </v-card-title>
            </v-card-item>

            <v-divider></v-divider>

            <v-card-text>
                <v-overlay v-model="overlay" class="align-center justify-center" contained>
                    <v-btn variant="flat" color="primary" disabled>
                        {{ $t('processing') }}
                    </v-btn>
                </v-overlay>

                <v-row>
                    <v-col cols="12" md="3">
                        <!-- filter -->
                        <h3 class="mb-5">{{ $t('filter') }}</h3>

                        <field-input class="mb-3"
                            :label="t('project')"
                            density="compact"
                            :is-required="false"
                            input-type="select"
                            :select-options="listOfAllProjects"
                            :is-multiple="true"
                            v-model="project_id"></field-input>

                        <field-input class="mb-3"
                            :label="t('taskName')"
                            density="compact"
                            :is-required="false"
                            v-model="task_name"></field-input>

                        <field-input class="mb-3"
                            :label="t('status')"
                            density="compact"
                            :is-required="false"
                            input-type="select"
                            :select-options="taskStatus"
                            :is-multiple="true"
                            v-model="status"></field-input>

                        <v-btn variant="flat" color="primary" class="w-100" rounded @click.prevent="getTasks">
                            {{ $t('applyFilter') }}
                        </v-btn>
                    </v-col>

                    <v-col cols="12" md="9" style="border-left: 1px solid #e6e6e6;">
                        <!-- table -->
                        <template v-if="loading">
                            <v-skeleton-loader type="table" class="w-100"></v-skeleton-loader>
                        </template>
                        <template v-else>
                            <!-- <template v-if="!listOfAllTasks.length">
                                <v-empty-state
                                  title="No Task In Any Projects"
                                  text="There was not any task in all projects"
                                ></v-empty-state>
                            </template>
                            <template v-else>
                            </template> -->
                            <v-data-table-server
                                v-model:items-per-page="itemsPerPage"
                                :headers="headers"
                                :sort-by="sortBy"
                                :items="tasks"
                                :items-length="totalTasks"
                                :items-per-page="10"
                                :page="page"
                                :loading="loading"
                                item-value="name"
                                @update:sortBy="changeSort"
                                @update:itemsPerPage="updatePerPage"
                                @update:page="changePage"
                            >
                                <template v-slot:item="{item: value}">
                                    <tr>
                                        <td>
                                            <span>{{ value.task_name }}</span>
                                            <br>
                                            <v-chip class="mb-1 mt-1 chip-grey" v-if="value.attachments > 0"
                                                density="compact">
                                                <v-icon :icon="mdiAttachment" size="20" class="mr-2"></v-icon>
                                                {{ value.attachments }} Attachments
                                            </v-chip>
                                            <v-chip class="mb-1 chip-grey" v-if="value.comments > 0" density="compact">
                                                <v-icon :icon="mdiCommentMultipleOutline" size="20"
                                                    class="mr-2"></v-icon>
                                                {{ value.comments }} Comments
                                            </v-chip>
                                        </td>
                                        <td>
                                            <span>{{ value.project }}</span>
                                            <br>
                                            <v-chip color="success" density="compact">
                                                {{ value.project_date }}
                                            </v-chip>
                                        </td>
                                        <td>
                                            <template v-if="value.pics.length">
                                                <div class="d-flex align-center ga-2 mb-1" v-for="(pic, x) in value.pics"
                                                    :key="x">
                                                    <v-avatar>
                                                        <v-img src="/user.png"></v-img>
                                                    </v-avatar>
                                                    <span>{{ pic.name }}</span>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <span class="pl-3">-</span>
                                            </template>
                                        </td>
                                        <td>
                                            <v-chip :color="value.status_color" density="compact" label>
                                                {{ value.status_text }}
                                            </v-chip>
                                        </td>
                                        <td>
                                            <span>{{ value.due_date }}</span>
                                        </td>
                                        <td>
                                            <span>{{ value.days_to_go }}</span>
                                        </td>
                                        <td>
                                            <v-icon
                                                :icon="mdiEyeOutline"
                                                size="20"
                                                @click.prevent="chooseTask(value)"></v-icon>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table-server>
                            <!-- <table-list
                                :headers="headers"
                                :items="listOfAllTasks"
                                :totalItems="totalTasks"
                                :loading="loading"
                                :itemsPerPage="itemsPerPage"
                                :filterSearch="false"
                                :has-add-button="false"
                                :has-filter="false"
                                :has-checkbox="false"
                                :full-custom-body="true"
                            >

                                <template v-slot:bodytable="{ value }">
                                    <tr>
                                        <td>
                                            <span>{{ value.task_name }}</span>
                                            <br>
                                            <v-chip class="mb-1 mt-1 chip-grey" v-if="value.attachments > 0"
                                                density="compact">
                                                <v-icon :icon="mdiAttachment" size="20" class="mr-2"></v-icon>
                                                {{ value.attachments }} Attachments
                                            </v-chip>
                                            <v-chip class="mb-1 chip-grey" v-if="value.comments > 0" density="compact">
                                                <v-icon :icon="mdiCommentMultipleOutline" size="20"
                                                    class="mr-2"></v-icon>
                                                {{ value.comments }} Comments
                                            </v-chip>
                                        </td>
                                        <td>
                                            <span>{{ value.project }}</span>
                                            <br>
                                            <v-chip color="success" density="compact">
                                                {{ value.project_date }}
                                            </v-chip>
                                        </td>
                                        <td>
                                            <template v-if="value.pics.length">
                                                <div class="d-flex align-center ga-2 mb-1" v-for="(pic, x) in value.pics"
                                                    :key="x">
                                                    <v-avatar>
                                                        <v-img src="/user.png"></v-img>
                                                    </v-avatar>
                                                    <span>{{ pic.name }}</span>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <span class="pl-3">-</span>
                                            </template>
                                        </td>
                                        <td>
                                            <v-chip :color="value.status_color" density="compact" label>
                                                {{ value.status_text }}
                                            </v-chip>
                                        </td>
                                        <td>
                                            <span>{{ value.due_date }}</span>
                                        </td>
                                        <td>
                                            <span>{{ value.days_to_go }}</span>
                                        </td>
                                        <td>
                                            <v-icon
                                                :icon="mdiEyeOutline"
                                                size="20"
                                                @click.prevent="chooseTask(value)"></v-icon>
                                        </td>
                                    </tr>
                                </template>

                            </table-list> -->
                        </template>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <task-detail :is-show="showDetail" @close-event="closeDetail" :is-from-task-list="true"></task-detail>

        <task-form
            :board="selectedBoard"
            :is-show="showTaskForm"
            @close-event="closeTaskForm"></task-form>
    </div>
</template>

<style lang="scss">
.table-task table th {
    height: 30px !important;
    font-weight: bolder !important;
}

.table-task td {
    padding-top: 7px !important;
    padding-bottom: 7px !important;
}

.table-task tr {
    cursor: pointer;
}

.table-task tbody tr td:first-child:hover {
    span {
        border-bottom: 1px solid #000;
    }
}

.chip-grey {
    background-color: #FAFAFA;
}

.chip-grey:hover {
    background-color: #BDBDBD;
}

.btn-action-item:hover {
    background-color: #BBDEFB;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiAttachment, mdiCommentMultipleOutline, mdiChevronDown, mdiEyeOutline } from '@mdi/js'
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia'
import TaskDetail from './detail/task/TaskDetail';
import TaskForm from './detail/task/AddTaskForm.vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useCheckPermission } from '@/compose/checkPermission';

const { t } = useI18n()

const store = useProjectStore()

const router = useRouter()

const { listOfAllTasks, listOfAllProjects, totalOfAllTasks } = storeToRefs(store)

const { defineField } = useForm({
    validationSchema: yup.object({
        project_id: yup.array().nullable(),
        task_name: yup.string().nullable(),
        status: yup.string().nullable()
    }),
})

const [project_id] = defineField('project_id')
const [task_name] = defineField('task_name')
const [status] = defineField('status')

const loading = ref(false)

const showDetail = ref(false)

const tasks = ref([]);

const totalTasks = ref(0);

const itemsPerPage = ref(10);

const sortBy = ref([]);

const taskStatus = ref([]);

const page = ref(1);

const breadcrumbs = ref([
    {
        title: t('task'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
])

const headers = ref([
    { title: t('taskName'), align: 'start', key: 'task_name' },
    { title: t('project'), align: 'start', key: 'project', sortable: false },
    { title: t('pic'), align: 'start', key: 'pics', sortable: false },
    { title: t('status'), align: 'start', key: 'status', sortable: false },
    { title: t('dueDate'), align: 'start', key: 'due_date', sortable: false },
    { title: t('daysToGo'), align: 'start', key: 'days_to_go', sortable: false },
    { title: '' },
])

const overlay = ref(false)

const showTaskForm = ref(false)

const selectedBoard = ref(null)

async function chooseTask(task) {
    overlay.value = true
    await store.detailTaskFromList(task.uid)
    overlay.value = false
    showDetail.value = true
}

function closeDetail(isRefresh) {
    showDetail.value = false

    if (isRefresh) {
        getTasks()
    }
}

function closeTaskForm(refresh = false) {
    selectedBoard.value = null
    showTaskForm.value = false

    if (refresh) {
        getTasks()
    }
}

function openProjectForm() {
    router.push({path: '/admin/production/project/create'})
}

function openTaskForm() {
    showTaskForm.value = true
}

function updatePerPage(item) {
    itemsPerPage.value = item;

    getTasks({page: page.value, itemsPerPage: itemsPerPage.value});
}

function changeSort(item) {
    console.log("sort by", item);
    sortBy.value = item;
    
    getTasks({page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value});
}

function changePage(item) {
    page.value = item;

    getTasks({page: page.value, itemsPerPage: itemsPerPage.value});
}

async function getTasks(params) {
    loading.value = true

    var payload = {
        project_id: project_id.value || '',
        task_name: task_name.value || '',
        status: status.value || ''
    }

    const resp = await store.getAllTasks(payload, params)
    tasks.value = resp.data.data.paginated;
    loading.value = false
    totalTasks.value = totalOfAllTasks.value;
}

async function getProjectList() {
    await store.getAllProjects()
}

async function getTaskStatus() {
    const resp = await store.getAllTaskStatus();

    if (resp.status < 300) {
        taskStatus.value = resp.data.data;
    }
}

async function prepareData() {
    await Promise.all([
        getTasks(),
        getProjectList(),
        getTaskStatus()
    ])
}

onMounted(async () => {
    prepareData();
})
</script>
