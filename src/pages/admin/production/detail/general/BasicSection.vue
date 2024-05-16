<template>
    <div>
        <div class="basic-information">
            <v-skeleton-loader
                type="list-item-three-line"
                width="100%"
                v-if="!props.detail"></v-skeleton-loader>
    
            <template v-else>
                <div class="names">
                    <p class="name">{{ props.detail.name }}</p>
                    <p class="date">
                        7 Januari 2024 (<span class="pm">Thalia</span>)
                    </p>
                    <v-chip
                        color="primary"
                        >Wedding</v-chip>
                    <v-chip color="success">
                        B (Standart)
                    </v-chip>
                </div>
        
                <div class="action">
                    <v-icon
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
            @close-form="isOpenForm = false"></basic-form>
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
import { ref } from 'vue'

const isOpenForm = ref(false);

const props = defineProps({
    detail: {
        default: null,
    },
})
</script>