<template>
    <div class="kanban-wrapper">
        <div class="loader" id="loader">
            {{ $t('processing') }}
        </div>

        <div class="kanban-item">
            <template
                v-for="(board, keyBoard) in listOfPorjectBoards"
                :key="keyBoard">
                
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
                            v-if="props.canAddTask"
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

function moving(evt) {
    var target = evt.to.id;
    var from = evt.from.id;

    if (!props.canMoveTask) {
        return false;
    } else if (target == 'On Progress' && !props.canMoveToProgress) {
        return false;
    } else if ((target == 'Review By Client' || from == 'Review By Client') && !props.canMoveToReviewClient) {
        return false;
    } else if ((target == 'Review By PM' || from == 'Review By PM') && !props.canMoveToReviewPm) {
        return false;
    } else if ((target == 'Completed' || from == 'Completed') && !props.canMoveToCompleted) {
        return false;
    }

    movingTask.value = evt.draggedContext.element.id;
}

async function endMoving(evt) {
    isDrag.value = false;
    console.log('evt end', evt);

    var target = evt.to.id;

    // targetBoard
    var targetBoard = document.getElementById(target).getAttribute('data-board');
    document.getElementById('loader').style.display = 'flex';

    const resp = await store.changeBoard({
        board_id: targetBoard,
        task_id: movingTask.value,
    }, route.params.id);

    document.getElementById('loader').style.display = 'none';

    if (resp.status > 300) {
        return false;
    }
}
</script>