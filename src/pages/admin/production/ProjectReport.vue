<template>
    <v-col
        cols="12"
        class="pb-0">
        <template v-if="props.isLoading">
            <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
        </template>
        <template v-else>
            <v-expand-transition>
                <master-card>
                    <v-toolbar color="surface">
                        <v-toolbar-title>
                            {{ $t('projectStatistic') }}
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <template v-if="!detailProject">
                            <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
                        </template>
                        <template v-else>
                            <v-row>
                                <v-col
                                    cols="12"
                                    md="6">
                                    <div class="report-item mb-3">
                                        <v-label class="fw-bold" style="opacity: 1;">{{ $t('feedback') }}</v-label>
                                        <p class="report-value">{{ detailProject.feedback || '' }}</p>
                                    </div>
                                </v-col>
                                <v-col
                                    cols="12"
                                    md="6">
                                    <div class="report-item mb-3">
                                        <v-label class="fw-bold" style="opacity: 1;">{{ $t('recapPoint') }}</v-label>
                                        <v-list
                                            lines="three">
                                            <v-list-item
                                                v-for="(first, x) in detailProject.report.first_line"
                                                :key="x"
                                                prepend-avatar="/user.png"
                                                :title="first.name"
                                            >
                                                <template v-slot:subtitle>
                                                    <p class="report-subtitle">{{ first.nickname }} is work on <span class="fw-bold">{{ first.total_task }}</span> tasks in total</p>
                                                    <p class="report-subtitle">Additional point is {{ first.additional_point }}</p>
                                                    <p class="report-subtitle">Total point is <span class="fw-bold">{{ first.total_point }}</span></p>
                                                </template>

                                                <v-divider class="mt-3"></v-divider>
                                            </v-list-item>

                                        </v-list>

                                        <div class="text-center" v-if="!showMorePoint && detailProject.report.more_line">
                                            <p class="pointer show-more-text" @click.prevent="showMorePoint = true">Show more ...</p>
                                        </div>

                                        <v-expand-transition>
                                            <v-list
                                                v-if="showMorePoint && detailProject.report.more_line"
                                                lines="three">
                                                <v-list-item
                                                    class="pt-0"
                                                    v-for="(more, m) in detailProject.report.more_line"
                                                    :key="m"
                                                    prepend-avatar="/user.png"
                                                    :title="more.name"
                                                >
                                                    <template v-slot:subtitle>
                                                        <p class="report-subtitle">Ilham is work on <span class="fw-bold">{{ more.total_task }}</span> tasks in total</p>
                                                        <p class="report-subtitle">Additional point is {{ more.additional_point }}</p>
                                                        <p class="report-subtitle">Total point is <span class="fw-bold">{{ more.total_point }}</span></p>
                                                    </template>

                                                    <v-divider class="mt-3"></v-divider>
                                                </v-list-item>
                                            </v-list>
                                        </v-expand-transition>

                                        <div class="text-center" v-if="showMorePoint && detailProject.report.more_line">
                                            <p class="pointer show-more-text" @click.prevent="showMorePoint = false">Hide</p>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card-text>
                </master-card>
            </v-expand-transition>
        </template>
    </v-col>
</template>

<style lang="scss" scoped>
.report-subtitle {
    font-size: 12px;
}

.show-more-text {
    font-size: 13px;
}
</style>

<script setup>
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const store = useProjectStore()

const { detailProject } = storeToRefs(store)

const showMorePoint = ref(false)

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    }
})
</script>
