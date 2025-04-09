<template>
    <v-dialog v-model="show"
        persistent
        max-width="700">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <template v-if="!showPrecheckWarning">
                    {{ $t('feedbackForm') }}
                    </template>
                    <template v-else>{{ $t("youHaveUnfinishedTask") }}</template>
                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="closeForm"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <template v-if="showPrecheckWarning">
                  <pre-check-task
                    :production-tasks="unfinishedTasks"
                    :song-tasks="unfinishedSongs"
                    @close-event="closePrecheck"></pre-check-task>
                </template>
                <template v-else>
                  <v-form @submit="validateData">
                      <template v-if="loadingPrepare">
                          <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                          <p class="text-center">
                              <i>{{ $t('preparingData') }}</i>
                          </p>
                      </template>
                      <template v-if="loadingPrecheck">
                          <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                          <p class="text-center">
                              <i>Checking Tasks ...</i>
                          </p>
                      </template>
                      <template v-else>
                          <field-input
                              :label="t('feedback')"
                              v-model="feedback"
                              class="mb-3"
                              :error-message="errors.feedback"></field-input>

                          <v-label>{{ $t('recapPoint') }}</v-label>
                          <p class="helper">{{ $t('projectMaximalPoint', {point: maximalPoint}) }}</p>
                          <v-table>
                              <thead>
                                  <tr>
                                      <th>{{ $t('name') }}</th>
                                      <th>{{ $t('totalTask') }}</th>
                                      <th>{{ $t('point') }}</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="(team, x) in teams"
                                      :key="x">
                                      <td>
                                          <p class="m-0 p-0">{{ team.name }}</p>
                                      </td>
                                      <td>
                                          <span class="fw-bold">{{ team.total_task }}</span> {{ $t('numberTaskIsCompleted') }}
                                      </td>
                                      <td class="text-center">
                                          <div class="d-flex align-center">
                                              <div class="minus point-action"
                                                  :class="{
                                                      'disabled': !team.can_decrease_point
                                                  }"
                                                  @click.prevent="reducePoint(team)">
                                                  <v-icon
                                                      :icon="mdiMinus"
                                                      size="15"></v-icon>
                                              </div>
                                              <span class="fw-bold point-value">
                                                  {{ team.point }}
                                              </span>
                                              <div class="plus point-action"
                                                  :class="{
                                                      'disabled': !team.can_increase_point
                                                  }"
                                                  @click.prevent="addPoint(team)">
                                                  <v-icon
                                                      :icon="mdiPlus"
                                                      size="15"></v-icon>
                                              </div>
                                          </div>
                                      </td>
                                  </tr>
                              </tbody>
                          </v-table>

                          <v-btn class="mt-5 w-100"
                              variant="flat"
                              color="success"
                              type="submit"
                              :disabled="loading">
                              <template v-if="loading">{{ $t('processing') }}</template>
                              <template v-else>
                                  {{ $t('complete') }}
                              </template>
                          </v-btn>
                      </template>
                  </v-form>
                </template>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.list-grey {
  background-color: rgb(230,230,230,.5);
}

.point-action {
    background-color: rgb(228, 228, 228);
    padding: 4px 8px;
    text-align: center;
    border: 1px solid #e6e6e6;
    cursor: pointer;
}

.point-action.disabled {
    background-color: rgba(228, 228, 228, .5);
    cursor: not-allowed;
}

.minus {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.plus {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.point-value {
    padding: 4px 8px;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
}

.helper {
    font-size: 12px;
    margin: 5px 0;
    color: #FBC02D;
    font-weight: bold;
}
</style>

<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiClose, mdiMinus, mdiMusic, mdiNewspaper, mdiPlus } from '@mdi/js'
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import * as yup from 'yup'
import PreCheckTask from './PreCheckTask.vue';

const { t } = useI18n()

const store = useProjectStore()

const { detailProject } = storeToRefs(store)

const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        feedback: yup.string().required(t('feedbackRequired')),
    }),
})

const [feedback] = defineField('feedback')

const show = ref(false);

const showPrecheckWarning = ref(false);

const loadingPrepare = ref(false);

const loadingPrecheck = ref(true);

const loading = ref(false)

const maximalPoint = ref(0)

const teams = ref([])

const unfinishedTasks = ref([]);

const unfinishedSongs = ref([]);

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

function addPoint(team) {
    var newArr = teams.value.map((elem) => {
        if (maximalPoint.value > 0) {
            if (elem.uid == team.uid && elem.additional_point < parseInt(detailProject.value.project_maximal_point)) {
                elem.additional_point += 1
                elem.point += 1
                elem.can_decrease_point = true

                maximalPoint.value -= 1
            }

            if (elem.additional_point == parseInt(detailProject.value.project_maximal_point)) {
                elem.can_increase_point = false
            }
        }

        return elem
    })

    teams.value = newArr
}

function reducePoint(team) {
    var newArr = teams.value.map((elem) => {
        if (elem.uid == team.uid && elem.additional_point > 0) {
            elem.additional_point -= 1
            elem.point -= 1
            elem.can_increase_point = true

            maximalPoint.value += 1
        }

        if (elem.additional_point == 0) {
            elem.can_decrease_point = false
        }

        return elem
    })

    teams.value = newArr
}

function closePrecheck(isComplete = false) {
  if (isComplete) {
    showPrecheckWarning.value = false;
    unfinishedSongs.value = [];
    unfinishedTasks.value = [];

    // render pic task
    initTaskTeam();
  } else {
    closeForm();
  }
}

function closeForm() {
  emit('close-event')
  resetForm();
  showPrecheckWarning.value = false;
  unfinishedTasks.value = [];
  unfinishedSongs.value = [];
}

async function initTaskTeam() {
    loadingPrepare.value = true
    const resp = await store.getTaskTeamForReview(detailProject.value.uid)
    loadingPrepare.value = false

    if (resp.status < 300) {
        teams.value = resp.data.data
    }
}

/**
* Function to check all task status, show report as done form when all task is completed
*
* Otherwise show alert
*/
async function preChecking() {
  loadingPrecheck.value = true;
  const resp = await store.checkAllProjectTasks(detailProject.value.uid);
  loadingPrecheck.value = false;

  if (resp.status < 300) {
    if (resp.data.data.needToCompleteTask) {
      unfinishedTasks.value = resp.data.data.tasks;
      unfinishedSongs.value = resp.data.data.songs;
      showPrecheckWarning.value = true;
    } else {
      showPrecheckWarning.value = false;
      unfinishedTasks.value = [];

      // init team
      initTaskTeam();
    }
  }
}

const validateData = handleSubmit(async (values) => {
    values.points = teams.value.filter((filter) => {
        return filter.point > 0;
    }).map((mapping) => {
        return {
            uid: mapping.uid,
            point: mapping.point,
            additional_point: mapping.additional_point,
            tasks: mapping.tasks
        }
    });

    loading.value = true
    const resp = await store.completeProject(values, detailProject.value.uid)
    loading.value = false

    if (resp.status < 300) {
        resetForm();
        emit('close-event');
    }
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        if (values.isShow) {
            preChecking();

            if (detailProject.value) {
                maximalPoint.value = detailProject.value.project_maximal_point
            }
        }
    }
})
</script>
