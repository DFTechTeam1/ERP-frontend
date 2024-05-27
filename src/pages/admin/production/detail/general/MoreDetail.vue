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
                                    {{ venue }}
                                </p>
                            </div>
    
                            <div class="field-item">
                                <p class="key">{{ $t('eventType') }}</p>
                                <p class="value">
                                    {{ eventType }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('collaboration') }}</p>
                                <p class="value">
                                    {{ collaboration }}
                                </p>
                            </div>

                            <div class="field-item">
                                <p class="key">{{ $t('status') }}</p>
                                <p class="value">
                                    {{ status }}
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
                                    {{ note }}
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
                                    {{ clientPortal }}
                                </a>
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
            :data="payloadForm"
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
import { ref, onMounted, watch } from 'vue';
import { mdiPencil } from '@mdi/js';
import MoreDetailForm from './MoreDetailForm.vue'
import { useCheckPermission } from '@/compose/checkPermission';

const openForm = ref(false);

const props = defineProps({
    detail: {
        default: null,
    },
})

const venue = ref(null);
const collaboration = ref(null);
const eventType = ref(null);
const status = ref(null);
const note = ref(null);
const clientPortal = ref(null);

const canEditProject = ref(false);

const payloadForm = ref(null);

onMounted(() => {
    canEditProject.value = useCheckPermission('edit_project');
});

watch(props, (values) => {
    initDisplayData(values.detail);
})

function initDisplayData(values) {
    venue.value = values.venue;
    collaboration.value = values.collaboration;
    eventType.value = values.event_type;
    status.value = values.status;
    note.value = values.note;
    clientPortal.value = values.client_portal;

    payloadForm.value = {
        venue: values.venue,
        event_type_raw: values.event_type_raw,
        collaboration: values.collaboration,
        status_raw: values.status_raw,
        note: values.note,
        client_portal: values.client_portal,
        uid: props.detail.uid,
    };
}

function closeForm(payload = null) {
    openForm.value = false;

    if (payload) {
        initDisplayData(payload);
    }
}
</script>