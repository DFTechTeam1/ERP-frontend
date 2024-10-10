<template>
	<div>
		<div class="link-item" v-if="detailProject.references.link != undefined">
            <v-list>
                <v-list-item
                    border="bottom"
                    v-for="(link, l) in detailProject.references.link"
                    :key="l"
                    :prepend-icon="mdiAttachment">
                    <template v-slot:title>
                        <a :href="link.link" target="_blank">{{ link.media_path + ' ' + (parseInt(l) + 1) }}</a>
                    </template>
                    <template v-slot:append>
                        <v-icon
                            :icon="mdiClose"
                            class="pointer"
                            size="15"
                            @click.prevent="deleteLink(link)"
                            color="red"></v-icon>
                    </template>
                </v-list-item>
            </v-list>
        </div>

        <div class="link-item" v-else>
            <v-empty-state
                title="There is no reference link for this project"
                text="All references link will appear here"
                size="100"
                image="/paper.png"></v-empty-state>
        </div>
	</div>
</template>

<script setup>
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { mdiClose, mdiAttachment } from '@mdi/js'

const store = useProjectStore();

const { detailProject } = storeToRefs(store)

const emit = defineEmits(['delete-event'])

const { t } = useI18n()

function deleteLink(link) {
	emit('delete-event', link)
}

function linkRedirect(link) {
    link = 'file://192.168.100.101/Queue Job 9/09_SEPTEMBER/28 SEPT - JOVAN RIKA/+FINAL RENDERZ/BUMP MID';
    window.open(link, '_blank');
}
</script>