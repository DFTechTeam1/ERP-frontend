<script setup>
import { ref } from 'vue'
import EmbedChart from './EmbedChart.vue'
import facetData from '@/facet.json'

let dataChart = [
    {
        "Title": "The Land Girls",
        "US Gross": 146083,
        "Worldwide Gross": 146083,
        "US DVD Sales": null,
        "Production Budget": 8000000,
        "Release Date": "Jun 12 1998",
        "MPAA Rating": "R",
        "Running Time min": null,
        "Distributor": "Gramercy",
        "Source": null,
        "Major Genre": null,
        "Creative Type": null,
        "Director": null,
        "Rotten Tomatoes Rating": null,
        "IMDB Rating": 6.1,
        "IMDB Votes": 1071
    },
    {
        "Title": "First Love, Last Rites",
        "US Gross": 10876,
        "Worldwide Gross": 10876,
        "US DVD Sales": null,
        "Production Budget": 300000,
        "Release Date": "Aug 07 1998",
        "MPAA Rating": "R",
        "Running Time min": null,
        "Distributor": "Strand",
        "Source": null,
        "Major Genre": "Drama",
        "Creative Type": null,
        "Director": null,
        "Rotten Tomatoes Rating": null,
        "IMDB Rating": 6.9,
        "IMDB Votes": 207
    },
];

const chartSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  title: '3D Modeller',
  width: 'container',
  data: {
    values: [
        {
            name: "Riyadus",
            total_task: 14,
            progress: -5.0,
            avg: 1.1,
            month: 1
        },
        {
            name: "Riyadus",
            total_task: 12,
            progress: 42.3,
            avg: 2.0,
            month: 2
        },
        {
            name: "Riyadus",
            total_task: 7,
            progress: 34.2,
            avg: 2.5,
            month: 3
        },
        {
            name: "Riyadus",
            total_task: 9,
            progress: -90.0,
            avg: 3.6,
            month: 4
        },
        {
            name: "Riyadus",
            total_task: 5,
            progress: 44.6,
            avg: 1.0,
            month: 5
        },
        {
            name: "Vicky",
            total_task: 19,
            progress: -12.4,
            avg: 2.1,
            month: 1
        },
        {
            name: "Vicky",
            total_task: 18,
            progress: 47.1,
            avg: 1.0,
            month: 2
        },
        {
            name: "Vicky",
            total_task: 8,
            progress: 29.1,
            avg: 1.3,
            month: 3
        },
        {
            name: "Vicky",
            total_task: 16,
            progress: -93.7,
            avg: 3.7,
            month: 4
        },
        {
            name: "Vicky",
            total_task: 8,
            progress: 1.0,
            avg: 1.9,
            month: 5
        },
        {
            name: "Giantoro",
            total_task: 21,
            progress: -7.2,
            avg: 2.0,
            month: 1
        },
        {
            name: "Giantoro",
            total_task: 15,
            progress: 46.4,
            avg: 1.0,
            month: 2
        },
        {
            name: "Giantoro",
            total_task: 2,
            progress: 73.9,
            avg: 0.5,
            month: 3
        },
        {
            name: "Giantoro",
            total_task: 31,
            progress: 46.0,
            avg: 1.0,
            month: 4
        },
        {
            name: "Giantoro",
            total_task: 16,
            progress: 72.4,
            avg: 0.5,
            month: 5
        },
    ]
  },
  transform: [
    { filter: 'datum["name"] !== null' }
  ],
  facet: {
    row: {
      field: 'name',
      title: '3D Modeller',
      header: { labelAngle: 0, labelAlign: 'left' },
      sort: { field: 'count', order: 'descending' }
    }
  },
  width: 400,
  spec: {
    mark: { type: 'bar', cornerRadiusEnd: 2 },
    width: 400,
    encoding: {
      x: {
        field: 'month',
        axis: { 
          format: '.1f',
          title: null,
          ticks: false,
          domain: false
        }
      },
      y: {
        aggregate: 'average',
        title: 'Frequency',
        field: 'total_task',
        axis: { grid: true }
      },
      color: {
        aggregate: 'average',
        field: 'progress',
        type: 'quantitative',
        legend: { title: 'Frequency' },
        scale: {
          range: ['#b54a23', '#ef7826', '#ffffff', '#8dc1de', '#4f81ae']
        }
      },
      tooltip: [
        { field: 'total_task', bin: true, title: 'Rating Range: ' },
        { aggregate: 'count', title: 'Count' },
        {field: 'progress', bin: true, title: 'Progress: '}
      ]
    }
  },
  config: {
    view: { stroke: 'transparent' },
    facet: { spacing: 10 }
  }
}

const embedOptions = ref({
  mode: 'vega-lite',
  theme: 'quartz',
  renderer: 'canvas'
})
</script>

<template>
  <div class="trellis-container">
    <EmbedChart 
      :spec="chartSpec" 
      :options="embedOptions" 
    />
  </div>
</template>

<style scoped>
.trellis-container {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
}
</style>