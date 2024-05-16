<template>
    <v-card flat>
        <v-card-text>
            <!-- basic information -->
            <div class="basic-information">
                <basic-section 
                    :detail="detailProject"/>

                <more-detail 
                    :detail="detailProject"/>
            </div>
            <!-- end basic information -->
        </v-card-text>
    </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BasicSection from './BasicSection'
import MoreDetail from './MoreDetail'
import { useProjectStore } from '@/stores/project'

const store = useProjectStore();

const detailProject = ref(null);

onMounted(() => {
    initProjectDetail();
});

function initProjectDetail() {
    detailProject.value = store.getDetail();
}
</script>