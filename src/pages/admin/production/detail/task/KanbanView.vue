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
                    :data-bab="board.board_as_backlog"
                    :data-bsc="board.board_start_calculated"
                    :data-bcpm="board.board_to_check_by_pm"
                    :data-bccl="board.board_to_check_by_client"
                    :data-bcpt="board.board_completed"
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
                            @click="chooseCard(element, board)">
                            <p style="font-size: 16px;">{{ element.name }}</p>

                            <div class="task-type" v-if="element.task_type != ''">
                                <v-chip
                                    :color="element.task_type_color"
                                    size="15"
                                    style="font-size: 10px;"
                                    class="px-2 mt-2">
                                    {{ element.task_type_text }}
                                </v-chip>
                            </div>

                            <div v-if="element.pics.length" class="pic mt-1 mb-1">
                                <task-member
                                    :members="element.pics"
                                    :with-title="false"></task-member>
                            </div>

                            <div class="deadline" v-if="element.deadline">
                                <p class="time text-right mt-3">
                                    <v-icon
                                        :icon="mdiClockOutline"
                                        size="20"></v-icon>
                                    {{ element.deadline }}

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
                            v-if="props.canAddTask && !board.board_completed && !board.board_to_check_by_pm && !board.board_to_check_by_client"
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
            width: calc(100%/3);
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
                border: 1px solid #fff;
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
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
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
})

const store = useProjectStore();

const { listOfPorjectBoards } = storeToRefs(store);

const isDrag = ref(false);

const selectedBoard = ref(null);

const showTaskForm = ref(false);

const showDetail = ref(false);

const targetBoard = ref(null);

const sourceBoard = ref(null);

const showProofOfWork = ref(false);

const movingTask = ref(null);

function log(event) {
    console.log('event', event);
}

function chooseCard(task) {
    store.setDetailTask(task);

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
    var target = evt.to.id;
    var from = evt.from.id;
    var fromBoardAsBacklog = document.getElementById(from).getAttribute('data-bab');
    var targetBoardStartCalculated = document.getElementById(target).getAttribute('data-bsc');
    var targetBoardStartReviewByPm = document.getElementById(target).getAttribute('data-bcpm');
    var targetBoardStartReviewByClient = document.getElementById(target).getAttribute('data-bccl');
    var targetBoardCompleted = document.getElementById(target).getAttribute('data-bcpt');
    var fromBoardReviewByPm = document.getElementById(from).getAttribute('data-bcpm');
    var fromBoardStartCalculated = document.getElementById(from).getAttribute('data-bsc');

    console.log('targetBoardStartCalculated', targetBoardStartCalculated);
    if (!props.canMoveTask) {
        console.log('1');
        return false;
    } else if (targetBoardStartCalculated && !props.canMoveToProgress) {
        console.log('2');
        return false;
    } else if ((target == 'Review By Client' || from == 'Review By Client') && !props.canMoveToReviewClient) {
        console.log('3');
        return false;
    } else if ((targetBoardStartReviewByPm || from == 'Review By PM') && !props.canMoveToReviewPm) {
        console.log('4');
        return false;
    } else if ((targetBoardCompleted || from == 'Completed') && !props.canMoveToCompleted) {
        console.log('5');
        return false;
    } else if (targetBoardStartCalculated == 'true' && fromBoardReviewByPm == 'true') {
        console.log('6');
        return false;
    } else if (fromBoardStartCalculated == 'true' && targetBoardStartReviewByClient == 'true') {
        return false;
    } else if (fromBoardStartCalculated == 'true' && targetBoardCompleted == 'true') {
        return false;
    } else if (fromBoardAsBacklog == 'true' && targetBoardCompleted == 'true') {
        return false;
    }

    movingTask.value = evt.draggedContext.element.id;
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
        document.getElementById('loader').style.display = 'flex';
    
        var fromBoardProgress = document.getElementById(from).getAttribute('data-bsc');
        var toBoardReviewPm = document.getElementById(target).getAttribute('data-bcpm');
        
        if (fromBoardProgress == 'true' && toBoardReviewPm == 'true') {
            targetBoard.value = targetBoardId;
            sourceBoard.value = sourceBoardId;
            showProofOfWork.value = true;
        } else {
            targetBoard.value = null;
            sourceBoard.value = null;
            const resp = await store.changeBoard({
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