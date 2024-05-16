<template>
    <div>
        <div class="more-detail">
            <v-skeleton-loader
                type="list-item-three-line"
                width="100%"
                v-if="!props.detail"></v-skeleton-loader>

            <template v-if="props.detail">
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
                                    {{ props.detail.venue }}
                                </p>
                            </div>
    
                            <div class="field-item">
                                <p class="key">{{ $t('eventType') }}</p>
                                <p class="value">
                                    {{ props.detail.event_type }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('collaboration') }}</p>
                                <p class="value">
                                    {{ props.detail.collaboration }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('status') }}</p>
                                <p class="value">
                                    {{ props.detail.status }}
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
                                    {{ props.detail.note}}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('daysToGo') }}</p>
                                <p class="value">
                                    {{ props.detail.days_to_go}}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('clientPortal') }}</p>
                                <a class="value" href="#">
                                    {{ props.detail.client_portal_url}}
                                </a>
                            </div>

                        </v-col>
                    </v-row>
                </div>

                <div class="action">
                    <v-icon
                        :icon="mdiPencil"
                        size="22"
                        @click.prevent="openForm = true"
                        class="cursor-pointer"></v-icon>
                </div>
            </template>
        </div>

        <more-detail-form
            :data="props.detail"
            :is-open="openForm"
            @close-form="openForm = false"></more-detail-form>
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
import { ref } from 'vue';
import { mdiPencil } from '@mdi/js';
import MoreDetailForm from './MoreDetailForm.vue'

const openForm = ref(false);

const props = defineProps({
    detail: {
        default: null,
    },
})
</script>