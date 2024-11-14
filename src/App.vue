<template>
  <v-app class="forbid">
    <v-main>
      <!-- Snackbar -->
      <notifications position="top right" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { i18n } from '@/lang'
import { onMounted } from 'vue';
import { useLocale } from 'vuetify';

const { current } = useLocale();

// set local
onMounted(() => {
  i18n.global.locale = current.value;
});
</script>
