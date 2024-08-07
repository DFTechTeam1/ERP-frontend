<template>
  <v-list lines="three" max-width="600" max-height="600">
    <v-list-item v-if="!listOfNotification.length">
      <div class="text-center">
        No Notification
      </div>
    </v-list-item>
    <v-list-item prepend-avatar="/user.png" class="pt-2"
        v-else
        v-for="(item, a) in listOfNotification"
        :key="a"
        @click.prevent="detailNotification(item)">
      <v-list-item-title>
        {{ item.title }}
      </v-list-item-title>

      <v-list-item-subtitle>
        <div>
          {{ item.message }}
        </div>
      </v-list-item-subtitle>

      <v-divider class="mt-5"></v-divider>
    </v-list-item>

    <v-list-item class="text-center pt-0 pb-0 h-auto" style="min-height: auto;">
      <v-btn flat density="compact" class="w-100 bg-grey-lighten-1">
        Mark as Read
      </v-btn>
    </v-list-item>

  </v-list>
</template>

<script setup>
import { useNotificationStore } from "@/stores/notification";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const store = useNotificationStore()

const router = useRouter()

const { listOfNotification } = storeToRefs(store)

onMounted(() => {
  
});

function markAsRead(item) {
  store.read(item)  
}

async function detailNotification(notification) {
  if (notification.link) {

    await store.read(notification)

    router.push({path: notification.link})
  }
}
</script>
