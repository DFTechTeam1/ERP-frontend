<template>
    <div>
        <template v-if="!detailProject.allowed_upload_showreels">
            <v-empty-state
                title="Not allowed to upload showreels"
                text="You still have incomplete task in this project. To upload showreels, make sure to complete all task"
                image="/not-allowed.png"
            ></v-empty-state>
        </template>
        <template v-else>
            <div class="player-wrapper" v-if="detailProject.showreels">
                <video-player
                    :width="600"
                    :height="450"
                    :src="detailProject.showreels"
                    poster="/user.png"
                    controls
                    :loop="true"
                    :volume="0.6"
                />
            </div>
            <div v-else>
                <div class="empty pt-10">
                    <h3>{{ $t('emptyShowreels') }}</h3>
                    <v-btn
                        class="mt-3"
                        variant="flat"
                        color="primary"
                        v-if="useCheckPermission('add_showreels')"
                        @click.prevent="showShowreels = true">
                        {{ $t('uploadShowreels') }}
                    </v-btn>
                </div>
            </div>
        </template>

        <showreels-form
            :is-show="showShowreels"
            @close-event="showShowreels = false"></showreels-form>
    </div>
</template>

<style lang="scss" scoped>
.player-wrapper {
    width: 100%;
    max-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty {
    margin: 0 auto;
    max-width: 800px;
    text-align: center;
}
</style>

<script setup>
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import ShowreelsForm from './FormView.vue'
import { ref, watch } from 'vue';
import { useCheckPermission } from '@/compose/checkPermission';

const props = defineProps({
    openForm: {
        type: Boolean,
        default: false,
    }
})

const store = useProjectStore()

const { detailProject } = storeToRefs(store)

const showShowreels = ref(false)

watch(props, (values) => {
    if (values) {
        showShowreels.value = values.openForm
    }
})
</script>