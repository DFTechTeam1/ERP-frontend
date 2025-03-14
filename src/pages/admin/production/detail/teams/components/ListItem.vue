<template>
	<template v-if="list.length">
		<v-list-item
        v-for="(team, t) in list"
        :key="t"
        :lines="team.loan ? 'three' : 'two'"
        @click.prevent="detailEmployeeTask(team)"
        :border="t === list.length - 1 ? 'none' : 'bottom'">
          <template v-slot:title>
            <span>{{ team.name }}</span>
          </template>

	        <template v-slot:subtitle>
	            <v-chip class="team-position mt-1"
                  size="x-small"
	                color="primary">
	                {{ team.position.name }}
	            </v-chip>

	            <v-chip v-if="team.loan"
	                class="team-position mt-1"
	                color="red"
                  size="x-small">
	                {{ $t('loan') }}
	            </v-chip>

              <v-chip color="primary"
                size="x-small"
                class="mt-1 ms-1"
                v-if="team.is_lead_modeller">Lead Modeller</v-chip>
	        </template>

	        <template v-slot:append>
	            <div class="d-flex align-center ga-2 task"
	            	v-if="haveTaskInformation">
	                Total <b>{{ team.total_task }}</b> {{ $t('totalTaskInProject') }}
	            </div>
	        </template>
	    </v-list-item>


    <!-- show detail of task -->
    <v-dialog v-model="modelShowTaskList"
      persistent
      max-width="600">
      <v-card>
        <v-card-item>
          <v-card-title class="d-flex align-center justify-space-between">
            {{ $t("listOfTask") }}
            <v-icon
              :icon="mdiClose"
              size="14"
              color="red"
              @click.prevent="modelShowTaskList = false"
              class="pointer"></v-icon>
          </v-card-title>
        </v-card-item>

        <v-card-text>
          <v-skeleton-loader
            type="list-item-three-line"
            height="50px"
            v-if="loading"></v-skeleton-loader>
          <div class="work-result" v-else>
            <template v-if="detailListTask.length">
              <template
                v-for="(item,i) in detailListTask"
                :key="i">
                <div class="d-flex align-center justify-space-between mt-3">
                  <div class="info">
                    <p class="name">{{ item.name }}</p>
                    <v-chip density="compact"
                            :color="item.task_status_color"
                            class="task-status mt-1">
                      {{ item.status }}
                    </v-chip>
                  </div>

                  <div class="additional">
                    <span class="task-time">Created at: <span class="task-time__value">{{ item.created_at }}</span></span>
                  </div>
                </div>
                <div class="task-result-preview mt-2" style="border-bottom: 1px solid #585757; padding-bottom: 10px;">
                  <v-expansion-panels
                    class="task-expansion"
                    v-for="(work, w) in item.proof_of_works"
                    :key="w">
                    <v-expansion-panel
                      class="task-expansion-panel"
                      :title="work.nas_link"
                    >
                      <v-expansion-panel-text>
                        <div class="img-wrapper">
                          <v-row>
                            <v-col cols="12" md="4" lg="4"
                                   v-for="(image, im) in work.images"
                                   :key="im">
                              <div class="img-wrapper-item">
                                <v-img
                                  :src="image"
                                  width="150"
                                  height="auto"></v-img>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                  </v-expansion-panels>
                </div>
              </template>
            </template>

            <template v-else>
              <div class="d-flex align-center justify-center">
                <p>{{ $t("userHaveNoTask") }}</p>
              </div>
            </template>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
	</template>
</template>

<style lang="scss">
  .task-result-preview {
    padding-bottom: 10px;

    .v-expansion-panel__shadow {
      box-shadow: none !important;
    }

    .task-expansion-panel {
      border: 1px solid #e6e6e6 !important;

      .v-expansion-panel-title {
        padding: 8px !important;
        min-height: 36px !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
.img-wrapper {
  .img-wrapper-item {
    border: 1px solid #f1f1f1;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
  }
}

.work-result {
  padding: 8px 8px 14px 8px;
  margin-bottom: 8px;
}

.info {
  .name {
    font-size: 16px;
    font-weight: bold;
  }

  .task-status {
    font-size: 12px;
  }
}

.task-time {
  font-size: 12px;

  &__value {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>

<script setup>
import { useI18n } from 'vue-i18n'
import {mdiClose} from "@mdi/js";
import {ref} from "vue";
import {useProjectStore} from "@/stores/project";
import {storeToRefs} from "pinia";

const { t } = useI18n()

const modelShowTaskList = ref(false);

const loading = ref(false);

const store = useProjectStore();

const { detailProject } = storeToRefs(store);

const detailListTask = ref([]);

const props = defineProps({
	list: {
		default: [],
	},
	haveTaskInformation: {
		default: false,
			type: Boolean,
	}
})

const detailEmployeeTask = async (team) => {
  console.log('team', team);
  modelShowTaskList.value = true;
  loading.value = true;
  const resp = await store.getEmployeeListTask(detailProject.value.uid, team.id);
  loading.value = false;
  detailListTask.value = resp;
  console.log("resp", resp);
}
</script>
