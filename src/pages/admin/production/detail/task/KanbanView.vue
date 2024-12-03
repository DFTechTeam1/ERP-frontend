<template>
    <div class="kanban-wrapper">
        <div class="loader" id="loader">
            {{ $t('processing') }}
        </div>

        <div class="kanban-item">
            <template
                v-for="(board, keyBoard) in listOfPorjectBoards"
                :key="keyBoard">

                <!--
                * data-bab = data board_as_backlog
                * data-bsc = data board_start_calculated
                * data-bcpm = data board_to_check_by_pm
                * data-bcpt = data board_completed
                -->
                <draggable
                    class="list-group"
                    :id="board.name"
                    :data-board="board.id"
                    :list="board.tasks"
                    group="people"
                    @change="log"
                    :move="moving"
                    @start="isDrag = true"
                    @end="endMoving"
                    itemKey="name"
                >
                    <template #item="{ element }">
                        <div
                            class="list-group-item position-relative"
                            :data-id="element.uid"
                            :id="'d' + element.id + 'o'"
                            style="min-height: 50px;"
                            @click.prevent="chooseCard(element, board)">

                            <p style="font-size: 14px;">{{ element.name }}</p>

                            <div v-if="element.pics.length" class="pic mt-1 mb-1">
                                <task-member
                                    :members="element.pics"
                                    :with-title="false"></task-member>
                            </div>

                            <div class="deadline d-flex align-center justify-space-between mt-2">
                                <v-chip
                                    v-if="element.pics.length"
                                    density="compact"
                                    class="status-preview"
                                    :color="element.task_status_color">
                                    {{ element.task_status }}
                                </v-chip>
                                <p class="time text-right" v-if="element.end_date">
                                    <v-icon
                                        :icon="mdiClockOutline"
                                        size="14"></v-icon>
                                    {{ element.end_date_text }}

                                    <v-tooltip
                                        activator="parent"
                                        location="end"
                                    >Tooltip</v-tooltip>
                                </p>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <template v-if="!board.tasks.length">
                            <p class="text-center">No Task</p>
                        </template>
                        <v-btn
                            v-if="props.canAddTask && ((detailProject) && (!detailProject.project_is_complete) && (detailProject.status_raw))"
                            variant="outlined"
                            color="primary"
                            class="w-100 mt-3"
                            @click.prevent="addTask(board)">
                            {{ $t('addTask') }}
                        </v-btn>
                    </template>

                    <template #header>
                        <p class="title">{{ board.name }}</p>
                    </template>
                </draggable>
            </template>

            <task-detail
                :is-show="showDetail"
                :can-delete-task="props.canDeleteTask"
                @close-event="showDetail = false"></task-detail>

            <task-form
                :board="selectedBoard"
                :is-show="showTaskForm"
                @close-event="closeTaskForm"></task-form>

            <proof-of-work
                :is-show="showProofOfWork"
                :target-board="targetBoard"
                :source-board="sourceBoard"
                @event-close="closeProofWork"
                :task-id="movingTask"></proof-of-work>
        </div>
    </div>
</template>

<style scoped lang="scss">
.status-preview {
  font-size: 10px;
}

.kanban-wrapper {
    background-color: #f6f6f6;
    height: 500px;
    padding: 12px 0;
    position: relative;

    .loader {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(122, 122, 123, .5);
        z-index: 100000;
        display: none;
        align-items: center;
        justify-content: center;
    }

    .kanban-item {
        display: flex;
        width: 100%;
        height: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        gap: 20px;
        flex-wrap: nowrap;

        &::-webkit-scrollbar {
            height: 5px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #787878 !important;
        }

        .list-group {
            width: calc((100%/4) - 20px);
            height: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            flex: 0 0 auto;
            background-color: #e6e6e6;
            border-radius: 4px;
            padding: 8px 12px;

            &::-webkit-scrollbar {
                width: 5px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #787878 !important;
                border-radius: 8px;
            }

            .list-group-item {
                padding: 4px 8px;
                margin-bottom: 12px;
                background-color: #fff;
                cursor: grab;
            }
        }
    }
}

@media all and (max-width: 580px) {
    .list-group {
        width: 80% !important;
    }
}

.title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
}

.time {
  font-size: 12px;
}
</style>

<script setup>
import draggable from "vuedraggable";
import { ref } from 'vue'
import { mdiClockOutline } from "@mdi/js";
import TaskDetail from './TaskDetail';
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/stores/project";
import TaskForm from './AddTaskForm.vue';
import TaskMember from "./TaskMember.vue";
import ProofOfWork from "./ProofOfWork";
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps({
    canMoveToProgress: {
        type: Boolean,
        default: false,
    },
    canMoveToReviewClient: {
        type: Boolean,
        default: false,
    },
    canMoveToReviewPm: {
        type: Boolean,
        default: false,
    },
    canMoveToRevise: {
        type: Boolean,
        default: false,
    },
    canMoveToCompleted: {
        type: Boolean,
        default: false,
    },
    canMoveTask: {
        type: Boolean,
        default: false,
    },
    canAddTask: {
        type: Boolean,
        default: false,
    },
    canDeleteTask: {
        type: Boolean,
        default: false,
    },
})

const store = useProjectStore();

const { listOfPorjectBoards, detailProject } = storeToRefs(store);

const isDrag = ref(false);

const selectedBoard = ref(null);

const showTaskForm = ref(false);

const showDetail = ref(false);

const targetBoard = ref(null);

const sourceBoard = ref(null);

const showProofOfWork = ref(false);

const movingTask = ref(null);

const movingTaskDetail = ref(null)

function log(event) {
    console.log('event', event);
}

function chooseCard(task, board) {
    task.board = board;
    task.permission = {
        canMoveToProgress: props.canMoveToProgress,
        canMoveToReviewPm: props.canMoveToReviewPm,
        canMoveToReviewClient: props.canMoveToReviewClient,
        canMoveTask: props.canMoveTask,
        canMoveToCompleted: props.canMoveToCompleted,
        canMoveToRevise: props.canMoveToRevise
    }
    var payload = task;

    store.setDetailTask(payload);

    showDetail.value = true;
}

function addTask(board) {
    selectedBoard.value = board;
    showTaskForm.value = true;
}

function closeTaskForm() {
    selectedBoard.value = null;
    showTaskForm.value = false;
}

/**
 * Every board will have this property:
 * data-bab = data board_as_backlog
 * data-bsc = data board_start_calculated
 * data-bcpm = data board_to_check_by_pm
 * data-bcpt = data board_completed
 */
function moving(evt) {
    console.log('evt', evt.draggedContext.element)
    // user cannot move task that is not belongs to him
    if (!evt.draggedContext.element.have_permission_to_move_board || (detailProject.value && detailProject.value.project_is_complete)) {
        return false
    }

    movingTask.value = evt.draggedContext.element.id
    movingTaskDetail.value = evt.draggedContext.element
}

/**
 * Moving task
 * Every board will have this property:
 * data-bab = data board_as_backlog
 * data-bsc = data board_start_calculated
 * data-bcpm = data board_to_check_by_pm
 * data-bcpt = data board_completed
 */
async function endMoving(evt) {
    isDrag.value = false;

    var taskUid = document.getElementById(evt.item.id).getAttribute('data-id');
    movingTask.value = taskUid;

    var target = evt.to.id;
    var from = evt.from.id;

    if (target != from) {
        // targetBoard
        var targetBoardId = document.getElementById(target).getAttribute('data-board');
        var sourceBoardId = document.getElementById(from).getAttribute('data-board');

        targetBoard.value = targetBoardId;
        sourceBoard.value = sourceBoardId;

        if (!movingTaskDetail.value.is_project_pic) {
            showProofOfWork.value = true
        } else {
            targetBoard.value = null;
            sourceBoard.value = null;
            const resp = await store.manualMoveBoard({
                board_id: targetBoardId,
                task_id: movingTask.value,
                board_source_id: sourceBoardId,
            }, route.params.id);

            document.getElementById('loader').style.display = 'none';

            if (resp.status > 300) {
                return false;
            }
        }

    }

}

function closeProofWork() {
    showProofOfWork.value = false;
    movingTask.value = null;
    targetBoard.value = null;
    sourceBoard.value = null;
    document.getElementById('loader').style.display = 'none';
}
</script>
