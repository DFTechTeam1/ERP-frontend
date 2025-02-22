<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiArrowRight } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { onMounted } from 'vue';

const store = useProjectStore();

const {
    listProjectNeedToBeComplete
} = storeToRefs(store);




</script>

<template>
    <master-card>
        <v-card-item>
            <v-card-title class="d-flex align-center justify-lg-space-between">
                {{ $t("needToBeComplte") }}

                <span class="detail" @click.prevent="$router.push({path: '/admin/production/projects'})"
                :style="{
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: '#29B6F6'
                }">
                    {{ $t('seeDetail') }} 
                    <v-icon
                        :icon="mdiArrowRight"
                        size="10"></v-icon>
                </span>
            </v-card-title>
        </v-card-item>

        <v-card-text>
            <v-list
                height="300">
                <template v-for="(project, x) in listProjectNeedToBeComplete"
                :key="x">
                    <v-list-item
                        @click.prevent="$router.push(`/admin/production/project/${project.uid}`)"
                        lines="three"
                        rounded="shaped">
                        <template v-slot:title>
                            <span :style="{
                                fontWeight: 'bold',
                                fontSize: '15px'
                            }">
                                {{ project.name }}
                            </span>
                        </template>

                        <template v-slot:subtitle>
                            <p class="mb-2 mt-1" :style="{
                                fontSize: '13px'
                            }">{{ project.pics.join(',') }}</p>
                            <v-chip
                                size="small"
                                :color="project.status_color">
                                {{ project.status_text }}
                            </v-chip>
                        </template>

                        <template v-slot:append>
                            <span>
                                {{ project.project_date_format }}
                            </span>
                        </template>
                    </v-list-item>

                    <v-divider v-if="x != parseInt(listProjectNeedToBeComplete.length) - 1"></v-divider>
                </template>
            </v-list>
        </v-card-text>
    </master-card>
</template>