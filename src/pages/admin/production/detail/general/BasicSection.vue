<template>
    <div>
        <div class="basic-information">
            <v-skeleton-loader
                type="list-item-three-line"
                width="100%"
                v-if="!detailProject"></v-skeleton-loader>
    
            <template v-else>
                <div class="names">
                    <p class="name">{{ detailProject.name }}</p>
                    <p class="date">
                        {{ detailProject.project_date }} (<span class="pm">{{ detailProject.pic }}</span>)
                    </p>
                    <v-chip
                        color="primary"
                        >{{ detailProject.event_type }}</v-chip>
                    <v-chip :color="detailProject.event_class_color">
                        {{ detailProject.event_class }}
                    </v-chip>
                </div>
        
                <div class="action">
                    <v-icon
                        v-if="canEditProject"
                        :icon="mdiPencil"
                        @click.prevent="isOpenForm = true"
                        size="22"
                        class="cursor-pointer"></v-icon>
                </div>
            </template>
        </div>

        <v-divider class="my-5"></v-divider>

        <basic-form 
            :is-open="isOpenForm"
            :basic-data="props.detail"
            v-if="canEditProject"
            @close-form="closeForm"></basic-form>
    </div>
</template>

<style scoped lang="scss">
    .basic-information {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .names {
            .name {
                font-weight: bold;
                font-size: 20px;
                margin-bottom: 10px;
                width: 350px;
                line-height: 1.5;
            }
            
            .date {
                font-size: 13px;
                font-weight: normal;
                margin-bottom: 10px;

                .pm {
                    font-weight: bold;
                }
            }
        }
    }
</style>

<script setup>
import { mdiPencil } from '@mdi/js';
import BasicForm from './BasicForm.vue'
import { ref, onMounted } from 'vue'
import { useCheckPermission } from '@/compose/checkPermission';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';

const store = useProjectStore();
const { detailProject } = storeToRefs(store);

const isOpenForm = ref(false);

const props = defineProps({
    detail: {
        default: null,
    },
})

const canEditProject = ref(false);

onMounted(() => {
    canEditProject.value = useCheckPermission('edit_project');
});

function closeForm() {
    isOpenForm.value = false;
}
</script>