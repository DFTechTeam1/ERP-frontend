<template>
  <div>
    <p class="title-waring" :style="{
      fontSize: '14px',
      fontWeight: 'bold'
    }">{{ $t("hereListOfUnfinishedTask") }}:</p>

    <v-list lines="two">
      <v-list-subheader inset>Production Tasks</v-list-subheader>
      <template v-if="props.productionTasks.length">
        <v-list-item
          v-for="(task, t) in props.productionTasks"
          :key="t"
          :class="{
            'list-grey': t % 2 !== 0
          }">
          <template v-slot:prepend>
            <v-icon
              size="22"
              :icon="mdiNewspaper"></v-icon>
          </template>

          <template v-slot:title>
            <span>{{ task.name }} (<span :style="{
              fontWeight: 'bold'
            }">{{ task.pic }}</span>)</span>
          </template>

          <template v-slot:subtitle>
            <v-chip variant="flat"
              :color="task.task_status_color"
              size="x-small">{{ task.task_status }}</v-chip>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item
          title="There is no task to be completed"></v-list-item>
      </template>

      <v-list-subheader inset class="mt-5">Songs</v-list-subheader>
      <template v-if="props.songTasks.length">
        <v-list-item
          v-for="(song, s) in props.songTasks"
          :key="s"
          :class="{
            'list-grey': s % 2 !== 0
          }">
          <template v-slot:prepend>
            <v-icon
              size="22"
              :icon="mdiMusic"></v-icon>
          </template>

          <template v-slot:title>
            <span>{{ song.name }} (<span :style="{
              fontWeight: 'bold'
            }">{{ song.task.employee.nickname }}</span>)</span>
          </template>

          <template v-slot:subtitle>
            <v-chip variant="flat"
              :color="song.task.status_text"
              size="x-small">{{ song.task.status_color }}</v-chip>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item
          title="There is no list of music to be completed"></v-list-item>
      </template>
    </v-list>

    <v-alert
      border="bottom"
      border-color="warning"
      elevation="3"
      density="compact"
      class="mt-3 mb-2"
      v-if="loading"
    >
      This will take the next few minutes. Do not close or refresh
    </v-alert>

    <div :style="{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end'
    }">
      <v-btn variant="flat"
        class="mt-3 me-3 bg-grey-lighten-1"
        :disabled="loading"
        @click.prevent="$emit('close-event', false)">
        {{ $t("cancel") }}
      </v-btn>

      <v-btn variant="flat"
        color="primary"
        type="button"
        :disabled="loading"
        @click.prevent="completeAll"
        class="mt-3 text-end">
        <template v-if="!loading">
          {{ $t("completeAndContinue") }}
        </template>
        <template v-else>
          {{ $t("completingTask") }}
        </template>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { showNotification } from '@/compose/notification';
import { useProjectStore } from '@/stores/project';
import { mdiMusic, mdiNewspaper } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const props = defineProps(['productionTasks', 'songTasks']);
const emit = defineEmits(['close-event']);

const store = useProjectStore();

const { detailProject } = storeToRefs(store);

const loading = ref(false);

async function completeAll() {
  loading.value = true;
  const resp = await store.completeAllUnfinishedTasks(detailProject.value.uid);
  loading.value = false;

  if (resp.status < 300) {
    showNotification(resp.data.message);
    emit('close-event', true);
  } else {
    showNotification(resp.response.data.message, 'error');
  }
}
</script>