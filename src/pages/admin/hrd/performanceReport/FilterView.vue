<template>
    <master-card>
        <v-card-item>
            <v-card-title>
                {{ $t('filterData') }}
            </v-card-title>
        </v-card-item>

        <v-card-text>
            <template v-if="props.loading">
                <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
            </template>
            <template v-else>
                <date-picker :label="t('startDate')" v-model="filter_date"
                    :error-message="errors.filter_date" density="compact"></date-picker>
                <date-picker :label="t('endDate')" v-model="end_date"
                    :error-message="errors.end_date" density="compact"></date-picker>
    
                    
                <div class="box-team">
                    <v-label class="mt-5">{{ $t('chooseTeam') }}</v-label>

                    <field-input
                        :label="t('search')"
                        v-model="name"
                        @clear-event="clearSearch"
                        :is-required="false"
                        density="compact"
                        class="mt-1"></field-input>

                    <v-divider></v-divider>
                    
                    <v-list class="list-team">
                        <v-list-item
                            v-for="(team, t) in listOfMembers"
                            :key="t"
                            color="primary"
                            class="list-item"
                            :class="{
                                'bg-primary': team.active
                            }"
                            style="border-radius: 4px !important;"
                            @click.prevent="chooseTeam(team)">
                            <template v-slot:prepend>
                                <v-icon
                                    :icon="mdiOfficeBuilding"
                                    size="15"></v-icon>
                            </template>
        
                            <template v-slot:title>
                                <span :class="{
                                    'text-white': team.active
                                }">{{ team.title }}</span>
                            </template>
                        </v-list-item>
                    </v-list>
                
                </div>

                <v-btn class="w-100 mt-3" variant="flat" color="success" density="compact" @click.prevent="getReport">
                    {{ $t('getReport') }}
                </v-btn>
            </template>
        </v-card-text>
    </master-card>
</template>

<style lang="scss" scoped>
.box-team {
    height: 400px;
    
    .list-team {
        height: 70%;
        padding-bottom: 20px;
        overflow-x: hidden;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            background: #e6e6e6;
            border-radius: 8px;
        }
    }
    


    .list-item {
        padding-top: 5px;
        padding-bottom: 5px;
        min-height: 25px;
    }
}
</style>

<script setup>
import { showNotification } from '@/compose/notification';
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { mdiOfficeBuilding } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup'

const { t } = useI18n()

const store = usePerformanceReportStore()

const { listOfMembers, listOfSelectedTeam } = storeToRefs(store)

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
})

const { defineField, errors, values, setFieldValue } = useForm({
    validationSchema: yup.object({
        filter_date: yup.string().nullable(),
        end_date: yup.string().nullable(),
        name: yup.string().nullable(),
    })
})

const [filter_date] = defineField('filter_date')
const [end_date] = defineField('end_date')
const [name] = defineField('name')

function chooseTeam(team) {
    store.selectTeam(team)
}

async function getReport() {
    if (!listOfSelectedTeam.value) {
        return showNotification(t('pleaseChooseEmployee'), 'error')
    }
    
    console.log('values', values);
    var param = {
        startDate: values.filter_date ?? '',
        endDate: values.end_date ?? '',
    }
    await store.getReport(param)
}

function clearSearch() {
    setFieldValue('name', '')
}

watch(name, async (values) => {
    await store.getMembers(values)
})
</script>