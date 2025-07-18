<script setup>
import { ref, watch, onMounted } from 'vue'
import vegaEmbed from 'vega-embed'

const props = defineProps({
  spec: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const chartRef = ref(null)

async function renderChart() {
  if (!chartRef.value || !props.spec) return
  
  try {
    await vegaEmbed(chartRef.value, props.spec, {
      actions: false,
      ...props.options
    })
  } catch (error) {
    console.error('Vega embedding error:', error)
  }
}

watch(
  () => [props.spec, props.options],
  () => renderChart(),
  { deep: true }
)

onMounted(renderChart)
</script>

<template>
  <div ref="chartRef"></div>
</template>