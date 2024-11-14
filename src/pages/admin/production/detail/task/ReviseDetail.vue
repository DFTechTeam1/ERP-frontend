<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <v-card>
            <v-card-item>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between">
                        <p>{{ $t('reviseDetail') }}</p>

                        <v-icon
                            :icon="mdiClose"
                            size="20"
                            @click.prevent="emit('close-event')"
                            color="red"></v-icon>
                    </div>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(item, x) in props.detail"
                        :key="x">
                        <v-expansion-panel-title>Revise {{ parseInt(x) + 1 }} <span style="font-weight: bold;"> ({{ item.revise_at }})</span></v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-label>{{ $t('revise') }}</v-label>
                            <br>
                            <p>{{ item.reason }}</p>
                            <br><br>
                            <v-label class="d-flex align-center ga-2">
                                {{ $t('images') }}

                                <v-icon
                                    :icon="mdiDownload"
                                    class="pointer"
                                    size="20"
                                    @click.prevent="downloadMedia(props.detail[x])"></v-icon>
                            </v-label>
                            <div class="image-wrap d-flex align-center w-100 ga-4 flex-wrap">
                                <div class="image-item"
                                    v-for="(image, i) in props.detail[x].images"
                                    :key="i">
                                    <v-img
                                        height="auto"
                                        width="150"
                                        :src="image"></v-img>
                                </div>
                            </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { mdiClose, mdiDownload } from '@mdi/js'
import { useProjectStore } from '@/stores/project'

const emit = defineEmits(['close-event'])

const store = useProjectStore()

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    detail: {
        default: [],
    },
    detailTask: {
        default: null,
    }
})

const show = ref(false)

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

function downloadMedia(item) {
    store.downloadReviseMedia(props.detailTask.project.uid, item.id)
}
</script>