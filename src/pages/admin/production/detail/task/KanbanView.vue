<template>
    <div class="kanban-wrapper">
        <div class="kanban-item">
            <template
                v-for="(board, keyBoard) in boards"
                :key="keyBoard">
                
                <draggable
                    class="list-group"
                    :list="board.items"
                    group="people"
                    @change="log"
                    @start="isDrag = true"
                    @end="isDrag = false"
                    itemKey="name"
                >
                    <template #item="{ element }">
                        <div 
                            class="list-group-item position-relative" 
                            @click="chooseCard(element, board)">
                            {{ element.name }}

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
                        <template v-if="!board.items.length">
                            <p class="text-center">No Task</p>
                        </template>
                        <v-btn
                            variant="outlined"
                            color="primary"
                            class="w-100 mt-3">
                            Add Task
                        </v-btn>
                    </template>

                    <template #header>
                        <p class="title">{{ board.title }}</p>
                    </template>
                </draggable>
            </template>

            <task-detail
                :is-show="showDetail"
                @close-event="showDetail = false"></task-detail>
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

const isDrag = ref(false);

const boards = ref([
    {
        title: 'Backlog',
        items: [
            { name: "Create modelling", id: 1, deadline: '4 Apr' },
            { name: "Animating", id: 2, deadline: '10 Apr' },
            { name: "Create frontend", id: 3, deadline: '15 Apr' },
            { name: "Integrate between backend and frontend", id: 4, deadline: '15 Apr' },
            { name: "Authentication", id: 4, deadline: '15 Apr' },
        ],
    },
    {
        title: 'To Do',
        items: [
            { name: "Create Authorization page", id: 1, deadline: '15 Apr' },
            { name: "Create dummy employee", id: 2, deadline: '15 Apr' },
            { name: "Integrate with Google Sheet", id: 3, deadline: '15 Apr' }
        ],
    },
    {
        title: 'On Progress',
        items: [],
    },
    {
        title: 'Review by PM',
        items: [],
    },
    {
        title: 'Review by Client',
        items: [],
    },
    {
        title: 'Revise',
        items: [],
    },
    {
        title: 'Completed',
        items: [],
    },
])

const showDetail = ref(false);

function log(event) {
    console.log('event', event);
}

function chooseCard(task, board) {
    console.log('oke', task);
    console.log('board', board);

    showDetail.value = true;
}
</script>