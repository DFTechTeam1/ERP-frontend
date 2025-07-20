<template>
    <v-card class="card-dashboard"
        variant="elevated">
        <v-card-item>
            <v-card-title class="fw-bold d-flex align-items-center justify-space-between">
              <span>{{ $t('yourEvent') }}</span>
            </v-card-title>
        </v-card-item>
        <v-card-text>
            <template v-if="loadingCalendar">
                <v-skeleton-loader
                    type="date-picker"></v-skeleton-loader>
            </template>
            <template v-else>
                <VCalendar expanded :attributes="listOfProjectCalendar"
                    @did-move="monthChanges"
                    borderless
                    @dayclick="chooseDate"></VCalendar>
            </template>

            <v-divider class="mb-5"></v-divider>

            <!-- Detail Calendar -->
            <div class="detail-calendar">
                <div class="detail-calendar__title">{{ $t('events') }}</div>

                <template v-if="loadingCalendar">
                    <v-skeleton-loader
                        type="list-item-three-line"></v-skeleton-loader>
                </template>
                <template v-else>
                    <template v-if="detailOfProjectCalendar.length">
                        <div class="detail-calendar__item"
                            v-for="(event, e) in detailOfProjectCalendar"
                            :key="e">
                            <v-avatar
                                color="blue">
                                <v-icon
                                    :icon="mdiCalendarAccount"></v-icon>
                            </v-avatar>

                            <div class="detail-calendar__item__event">
                                <p class="event">{{ event.customData.name }}</p>
                                <p class="date">{{ event.customData.project_date_text }}</p>

                                <div class="detail-event mt-4">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style="width: 55%; font-weight: bold;">Project Manager</td>
                                                <td style="width: 3%">:</td>
                                                <td style="width: 42%;">
                                                    {{ event.customData.pic }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 55%; font-weight: bold;">Venue</td>
                                                <td style="width: 3%">:</td>
                                                <td style="width: 42%;">{{ event.customData.venue }}</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 55%; font-weight: bold;">VJ</td>
                                                <td style="width: 3%">:</td>
                                                <td style="width: 42%;">{{ event.customData.vj }}</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 55%; font-weight: bold;">Equipment</td>
                                                <td style="width: 3%">:</td>
                                                <td style="width: 42%;">Laptop VJ 4</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <v-empty-state
                        :headline="t('noEvent')"
                        :title="t('youHaveNoEvent')"
                        :icon="mdiCalendarAlert"
                        ></v-empty-state>
                    </template>
                </template>

            </div>
            <!-- End Detail Calendar -->
        </v-card-text>
    </v-card>
</template>

<style lang="scss" scoped>
.detail-calendar {
    &__item:last-child {
        border: none !important;
    }

    &__item {
        margin-top: 5px;
        display: flex;
        gap: 10px;
        padding-bottom: 15px;
        padding-top: 15px;
        border-bottom: 1px solid #000;

        &__event {
            .event {
                color: #000;
                line-height: 1.5;
                font-size: 16px;
                font-weight: bolder;
            }

            .date {
                font-size: 13px;
                color: #636161;
                font-weight: 600;
            }

            .detail-event {
                table tr td {
                    padding: 4px 6px;
                }
            }
        }
    }

    &__title {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 18px;
    }
}
</style>

<script setup>
import { useDashboardStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { mdiCalendarAlert, mdiCalendarAccount } from '@mdi/js'
import { useI18n } from 'vue-i18n';
import { useCheckPermission } from '@/compose/checkPermission';

const store = useDashboardStore()

const { detailOfProjectCalendar, listOfProjectCalendar } = storeToRefs(store)

const loadingCalendar = ref(false)

const { t } = useI18n()

const calendar = ref(null)

async function initCalendarEvent(payload = null) {
    // loadingCalendar.value = true
    const resp = await store.getProjectCalendar(payload)
    // loadingCalendar.value = false

    // if (resp.status < 300) {
    //     moveCalendar(resp)
    // }
}

function chooseDate(event) {
    store.setProjectCalendarDetail(event.id)
}

function monthChanges(pages) {
    if (pages.length) {
        initCalendarEvent({
            month: pages[0].month,
            year: pages[0].year,
        })
    }
}

onMounted(() => {
    initCalendarEvent()
})
</script>
