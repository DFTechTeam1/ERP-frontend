<template>
    <div class="preview-wrapper">
        <div class="preview-item"
            v-for="(item, x) in detailProject.progress"
            :key="x">
            <div class="preview-title">{{ item.text }}</div>
            <div class="progress-bar">
                <v-sheet
                    class="d-flex align-center ga-10"
                    width="100%"
                    rounded="lg"
                >
                    <v-progress-linear
                    bg-color="black"
                    color="yellow"
                    height="20"
                    :model-value="item.completed"
                    :max="item.total"
                    min="0"
                    rounded
                    ></v-progress-linear>

                    <div class="ms-4">
                        {{ item.completed }} of {{ item.total }} is completed
                    </div>
                </v-sheet>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.preview-wrapper {
    padding: 10px 20px;

    .preview-item {
        display: flex;
        align-items: center;
        gap: 20px;
        width: 100%;
        margin-bottom: 20px;

        .preview-title {
            width: 10%;
        }

        .progress-bar {
            width: 90%;
        }
    }
}
</style>

<script setup>
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const store = useProjectStore();

const { detailProject } = storeToRefs(store);

const progress = ref(20);
</script>