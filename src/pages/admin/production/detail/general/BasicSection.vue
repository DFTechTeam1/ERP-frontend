<template>
    <div>
        <div class="basic-information">
            <v-skeleton-loader
                type="list-item-three-line"
                width="100%"
                v-if="!props.detail"></v-skeleton-loader>
    
            <template v-else>
                <div class="names">
                    <p class="name">{{ name }}</p>
                    <p class="date">
                        {{ projectDate }} (<span class="pm">{{ pic }}</span>)
                    </p>
                    <v-chip
                        color="primary"
                        >{{ eventType }}</v-chip>
                    <v-chip :color="eventClassColor">
                        {{ eventClass }}
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
import { ref, watch, onMounted } from 'vue'
import { useCheckPermission } from '@/compose/checkPermission';

const isOpenForm = ref(false);

const name = ref(null);
const projectDate = ref(null);
const eventClass = ref(null);
const eventClassColor = ref(null);
const eventType = ref(null);
const pic = ref(null);
const formDetailValue = ref(null);

const props = defineProps({
    detail: {
        default: null,
    },
})

const canEditProject = ref(false);

watch(props, (values) => {
    if (values.detail) {
        name.value = props.detail.name;
        projectDate.value = props.detail.project_date;
        eventClass.value = props.detail.event_class;
        eventClassColor.value = props.detail.event_class_color;
        eventType.value = props.detail.event_type;
        pic.value = props.detail.pic;
    }
})

onMounted(() => {
    canEditProject.value = useCheckPermission('edit_project');
});

function closeForm(payload = null) {
    isOpenForm.value = false;

    if (payload) {
        name.value = payload.name;
        projectDate.value = payload.project_date;
        eventClass.value = payload.event_class;
        eventClassColor.value = payload.event_class_color;
        eventType.value = payload.event_type;
        pic.value = payload.pic;
    }
}
</script>