<template>
    <v-empty-state icon="$success">
      <template v-slot:media>
        <v-icon color="surface-variant"></v-icon>
      </template>
  
      <template v-slot:headline>
        <div class="text-h4">
          {{ $t('redirecting') }}
        </div>
      </template>
  
      <template v-slot:title>
        <vue-countdown :time="5000" v-slot="{ seconds }" @end="endOfTime">
            Redirecting in: {{ seconds }}
        </vue-countdown>
      </template>
  
      <template v-slot:text>
        <div class="text-medium-emphasis text-caption">
          {{ $t('redirectLogoutAfterEditRole') }}
        </div>
      </template>
    </v-empty-state>
</template>

<script setup>
import { useAuthenticationStore } from '@/stores/authentication';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const store = useAuthenticationStore();

const router = useRouter();

async function logoutUser() {
    await store.logout();
    router.push({ path: "/auth/a/login" });
}

function endOfTime() {
    logoutUser();
}

onMounted(() => {
    console.log('route', router);
})
</script>