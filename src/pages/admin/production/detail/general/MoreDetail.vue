<template>
    <div>
        <div class="more-detail">
            <v-skeleton-loader
                type="list-item-three-line"
                width="100%"
                v-if="!detailProject"></v-skeleton-loader>

            <template v-if="detailProject">
                <div class="fields w-100">
                    <v-row>
                        <v-col
                            cols="12"
                            lg="4"
                            md="4">
    
                            <div class="field-item">
                                <p class="key">
                                    {{ $t('venue') }}
                                </p>
                                <p class="value">
                                    {{ detailProject.venue }}
                                </p>
                            </div>
    
                            <div class="field-item">
                                <p class="key">{{ $t('eventType') }}</p>
                                <p class="value">
                                    {{ detailProject.event_type }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('collaboration') }}</p>
                                <p class="value">
                                    {{ detailProject.collaboration }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('status') }}</p>
                                <p class="value">
                                    {{ detailProject.status }}
                                </p>
                            </div>
    
                        </v-col>
                        
                        <v-col
                            cols="12"
                            lg="4"
                            md="4">

                            <div class="field-item">
                                <p class="key">{{ $t('note') }}</p>
                                <p class="value">
                                    {{ detailProject.note }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('daysToGo') }}</p>
                                <p class="value">
                                    {{ detailProject.days_to_go }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('clientPortal') }}</p>
                                <a class="value" href="#">
                                    {{ detailProject.client_portal }}
                                </a>
                            </div>
                            <div class="field-item">
                                <p class="key">{{ $t('ledArea') }}</p>
                                <p class="value">
                                    {{ detailProject.led_area }} m<sup>2</sup>
                                </p>

                                <div class="led-detail">
                                    <table style="width: 300px; border-collapse: collapse;">
                                        <thead>
                                            <tr>
                                                <th class="text-left" style="padding: 4px 8px; border: 1px solid #e4e4e4; background-color: #f6f6f6;">Width</th>
                                                <th class="text-left" style="padding: 4px 8px; border: 1px solid #e4e4e4; background-color: #f6f6f6;">Height</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                
                                                v-for="(led, x) in detailProject.led_detail"
                                                :key="x">
                                                <td style="padding: 4px 8px; border: 1px solid #e4e4e4;">{{ led.width }} m</td>
                                                <td style="padding: 4px 8px; border: 1px solid #e4e4e4;">{{ led.height }} m</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </v-col>
                    </v-row>
                </div>

                <div class="action">
                    <v-icon
                        v-if="canEditProject"
                        :icon="mdiPencil"
                        size="22"
                        @click.prevent="openForm = true"
                        class="cursor-pointer"></v-icon>
                </div>
            </template>
        </div>

        <more-detail-form
            :is-open="openForm"
            v-if="canEditProject"
            @close-form="closeForm"></more-detail-form>
    </div>
</template>

<style scoped lang="scss">
.more-detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .fields {
        .field-item {
            margin-bottom: 10px;

            .key {
                font-weight: bold;
                margin-bottom: 2px;
                font-size: 14px;
            }

            .value {
                font-size: 13px;
            }
        }
    }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { mdiPencil } from '@mdi/js';
import MoreDetailForm from './MoreDetailForm.vue'
import { useCheckPermission } from '@/compose/checkPermission';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';

const store = useProjectStore();
const { detailProject } = storeToRefs(store);

const openForm = ref(false);

const canEditProject = ref(false);

onMounted(() => {
    canEditProject.value = useCheckPermission('edit_project');
});

function closeForm() {
    openForm.value = false;
}
</script>