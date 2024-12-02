<script setup>
import {mdiClose, mdiMonitorScreenshot} from "@mdi/js";
import {ref, onMounted} from "vue";
import LedForm from "@/pages/admin/production/LedForm.vue";

const emit = defineEmits(['update-led-event']);

const props = defineProps({
  data: {
    type: Array
  }
});

const ledSetting = ref([]);

const isShowLedForm = ref(false);

const total = ref(0);

function removeLed(key) {
  var newArr = ledSetting.value.filter((elem, keyData) => {
    return keyData != key
  })

  ledSetting.value = newArr

  if (ledSetting.value.length) {
    updateTotalLed();
  } else {
    total.value = 0;
  }

  // call emit to update parent component
  emit("update-led-event", total.value);
}

function showLedForm() {
  isShowLedForm.value = true
}

function updateTotalLed() {
  var totalSummary = []
  for (let a = 0; a < ledSetting.value.length; a++) {
    totalSummary.push(parseFloat(ledSetting.value[a].totalRaw))
  }

  total.value = totalSummary.reduce((a, b) => a + b);
}

function closeLedForm(payload = null) {
  isShowLedForm.value = false

  if (payload) {
    ledSetting.value.push(payload)

    updateTotalLed()

    emit("update-led-event", total.value);
  }
}

function getValue() {
  return ledSetting.value;
}

defineExpose({
  getValue
})

onMounted(() => {
  if (props.data) {
    ledSetting.value = props.data
  }

  console.log("ledSetting", props.data)
})
</script>

<template>
  <div>
    <LedForm :is-show="isShowLedForm" @close-event="closeLedForm" />

    <v-label>{{ $t('ledArea') }}</v-label>
    <v-list v-if="ledSetting.length">
      <v-list-item
        style="transition: all .3s"
        lines="three"
        class="mb-1 border-bottom pb-2 led-item"
        v-for="(led, l) in ledSetting"
        :key="l">
        <template v-slot:title>
          <p class="mb-1 title">{{ led.name }}</p>
        </template>
        <template v-slot:subtitle>
          <p class="fw-bold subtitle">
            {{ $t('total') }} <span v-html="led.total" style="font-weight: normal !important;"></span>
          </p>
          <p class="fw-bold subtitle">
            {{ $t('detail') }} <span v-html="led.textDetail" style="font-weight: normal !important;"></span>
          </p>
        </template>
        <template v-slot:prepend>
          <v-icon
            :icon="mdiMonitorScreenshot"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon
            :icon="mdiClose"
            @click.prevent="removeLed(l)"></v-icon>
        </template>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item class="text-center">
        <v-empty-state
          title="No LED for this project"
          text="LED area will be appear on this section"></v-empty-state>
      </v-list-item>
    </v-list>

    <v-btn
      class="w-100"
      variant="flat"
      color="grey-lighten-3"
      @click.prevent="showLedForm">
      {{ $t('addMore') }}
    </v-btn>
  </div>
</template>

<style scoped lang="scss">

</style>
