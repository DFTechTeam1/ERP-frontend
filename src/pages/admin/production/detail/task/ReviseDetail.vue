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
                            <v-label>{{ $t('images') }}</v-label>
                            <div class="image-wrap d-flex align-center w-100 ga-4">
                                <div class="image-item">
                                    <v-img
                                        height="100"
                                        width="100"
                                        :src="item.full_path"></v-img>
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
import { mdiClose } from '@mdi/js'

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    detail: {
        default: [],
    },
})

const show = ref(false)

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})
</script>