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
import { ref } from 'vue';
import BasicSection from './BasicSection'
import MoreDetail from './MoreDetail'
import { watch } from 'vue';

const detailProject = ref(null);

const props = defineProps({
    detail: {
        default: null,
    },
});

watch(props, (values) => {
    detailProject.value = values.detail;
})
</script>