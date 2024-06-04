<template>
    <div class="kanban-wrapper">
        <div class="kanban-item">
            <template
                v-for="(board, keyBoard) in listOfPorjectBoards"
                :key="keyBoard">
                
                <draggable
                    class="list-group"
                    :list="board.tasks"
                    group="people"
                    @change="log"
                    @start="isDrag = true"
                    @end="isDrag = false"
                    itemKey="name"
                >
                
                    <template #item="{ element }">
                        <div 
                            class="list-group-item position-relative" 
                            style="min-height: 50px;"
                            @click="chooseCard(element, board)">
                            <p style="font-size: 16px;">{{ element.name }}</p>

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

const store = useProjectStore();

const { listOfPorjectBoards } = storeToRefs(store);

const isDrag = ref(false);

const selectedBoard = ref(null);

const showTaskForm = ref(false);

const showDetail = ref(false);

function log(event) {
    console.log('event', event);
}

function chooseCard(task, board) {
    console.log('oke', task);
    console.log('board', board);

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
</script>