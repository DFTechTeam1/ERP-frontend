<template>
    <v-dialog
        max-width="400"
        v-model="isShowConfirm">
        <v-card
            :title="props.title">
            <v-card-text>
                {{ text }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    v-if="!props.closeEmit"
                    height="auto"
                    size="small"
                    class="btn-secondary pt-3 pb-3 mt-3"
                    @click.prevent="isShowConfirm = false">
                    {{ $t('close') }}
                </v-btn>
                <v-btn
                    v-else
                    height="auto"
                    size="small"
                    class="btn-secondary pt-3 pb-3 mt-3"
                    @click.prevent="$emit('cancelConfirm')">
                    {{ $t('close') }}
                </v-btn>

                <v-btn
                    height="auto"
                    size="small"
                    type="button"
                    @click.prevent="$emit('actionBulkSubmit', props.deleteIds)"
                    class="btn-primary pt-3 pb-3 mt-3">
                    {{ $t('yes') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { watch } from "vue";
import { ref } from "vue";

defineEmits(['actionBulkSubmit', 'cancelConfirm'])

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  showConfirm: {
    type: Boolean,
    default: false,
  },
  deleteIds: {
    type: Object,
  },
  closeEmit: {
    type: Boolean,
    default: false,
  },
});

const isShowConfirm = ref(false);

watch(props, (values) => {
    isShowConfirm.value = values.showConfirm
});
</script>
