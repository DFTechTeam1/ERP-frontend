<template>
	<v-dialog persistent
		v-model="show">
		<v-expand-x-transition>
			<master-card>
				<v-card-item>
					<v-card-title class="d-flex align-center justify-space-between">
						{{ $t('assignPic') }}

						<v-icon
							:icon="mdiClose"
							size="15"
							@click.prevent="closeFinderManager(false)"
							class="cursor"></v-icon>
					</v-card-title>
				</v-card-item>
				<v-card-text>
					<!-- filter -->
					<div class="header-action d-flex align-center justify-space-between">
						<div class="filter-wrapper">
							<div class="d-flex ga-4 align-center">
								<div class="d-flex ga-2 pointer align-center filter-item"
									:class="{
										'active': filterModel == 'column'
									}"
									style="font-size: 12px;">
									<v-icon
										:icon="mdiViewColumnOutline"
										size="15"></v-icon>
									{{ $t('columns') }}

									<v-menu activator="parent"
										@update:modelValue="updateColumnFilter"
										:close-on-content-click="false">
										<v-list>
											<v-list-item class="filter-column-dropdown">
										        <v-checkbox
										        	v-for="(checkColumn, cc) in columns"
										        	:key="cc"
										        	:readonly="!checkColumn.active"
										        	class="input-no-detail"
										        	:label="checkColumn.text"
										        	v-model="columnsModel"
										        	:value="checkColumn.name"></v-checkbox>
											</v-list-item>
										</v-list>
							      </v-menu>
								</div>
								<div class="d-flex ga-2 pointer align-center filter-item"
									:class="{
										'active': filterModel == 'group'
									}"
									style="font-size: 12px;">
									<v-icon
										:icon="mdiFormatListGroup"
										size="15"></v-icon>
									{{ $t('group') }}

									<v-menu activator="parent"
										@update:modelValue="updateGroupFilter"
										:close-on-content-click="false">
										<v-list>
											<v-list-item class="filter-column-dropdown">
												<v-radio-group v-model="groupModel">
											        <v-radio
											        	class="input-no-detail"
											        	label="Name"
											        	value="name"></v-radio>

											        <v-radio
											        	class="input-no-detail"
											        	label="Event Class"
											        	value="class"></v-radio>
												</v-radio-group>
											</v-list-item>
										</v-list>
							      </v-menu>
								</div>
								<div class="d-flex ga-2 pointer align-center filter-item"
									style="font-size: 12px;"
									:class="{
										'active': filterModel == 'filter'
									}">
									<v-icon
										:icon="mdiFilterOutline"
										size="15"></v-icon>
									{{ $t('filter') }}

									<v-menu activator="parent"
										max-width="500"
										v-model="showFilterMenu"
										@update:modelValue="updateFilterFilter"
										persistent
										width="300"
										:close-on-content-click="false">
										<v-form @submit="validateFilterDate">

											<v-list>
												<v-list-item>
										            <button-group-nav
										            	:buttons="filterButtonDates"
										            	v-model="dateGroupModel"></button-group-nav>

										            <div class="filter-month" v-if="dateGroupModel == 'month'">
										            	<VueDatePicker month-picker
										            		v-model="filter_month"
										            		:teleport="true"></VueDatePicker>
										            </div>

										            <div class="filter-date" v-if="dateGroupModel == 'custom'">
										            	<div class="form-group mb-1">
											            	<v-label>{{ $t('startDate') }}</v-label>
											            	<date-picker
											            		v-model="start_date"
											            		:label="t('startDate')"
											            		:is-solo="true"
											            		:is-required="true"
											            		density="compact"></date-picker>
										            	</div>
										            	<div class="form-group">
											            	<v-label>{{ $t('endDate') }}</v-label>
											            	<date-picker
											            		v-model="end_date"
											            		:label="t('endDate')"
											            		:is-solo="true"
											            		:is-required="true"
											            		density="compact"></date-picker>
										            	</div>
										            </div>
												</v-list-item>

												<v-list-item class="filter-column-dropdown">
													<v-switch
											        	v-model="filterByVenue"
										                color="primary"
										                label="By Venue"
										                value="filter_venue"
										                hide-details
										            ></v-switch>

										            <v-alert v-if="filterByVenue"
											            :text="t('filterByVenueText')">
										            </v-alert>
												</v-list-item>

												<v-list-item>
													<v-btn color="success"
														type="submit"
														class="w-100 mb-2">
														{{ $t('filter') }}
													</v-btn>
													<v-btn color="secondary" @click.prevent="closeFilterMenu"
														class="w-100">
														{{ $t('cancel') }}
													</v-btn>
												</v-list-item>
											</v-list>
										</v-form>
							      </v-menu>
								</div>
								<!-- <div class="d-flex ga-2 pointer align-center filter-item" style="font-size: 12px;">
									<v-icon
										:icon="mdiSort"
										size="15"></v-icon>
									{{ $t('sort') }}
								</div> -->
							</div>

							<!-- result filter -->
							<div class="filter-result mt-2">
								<v-chip color="primary" density="compact" class="chip-filter-group" v-if="resultFilterGroup">
									<v-icon :icon="mdiClose"
										size="20"
										class="pointer"
										@click.prevent="clearGroupFilter"
										start></v-icon>
									<p class="filter-group-value">
										{{ filterGroupValue }}
									</p>
								</v-chip>
								<v-chip color="primary" density="compact" class="chip-filter-group" v-if="resultFilterDate"
								>
									<p class="filter-group-value">
										{{ filterDateValue }}
									</p>
								</v-chip>
								<v-chip color="primary" density="compact" class="chip-filter-group" v-if="filterByVenue != ''"
								>
									<v-icon :icon="mdiClose"
										size="20"
										class="pointer"
										@click.prevent="clearFilterVenue(true)"
										start></v-icon>
									<p class="filter-group-value">
										{{ $t('byVenue') }}
									</p>
								</v-chip>
							</div>
						</div>

						<div>
							<v-btn
								variant="outlined"
								color="success"
								density="compact"
								@click.prevent="openPicDialog">
								{{ $t('choosePic') }}
							</v-btn>

							<ChoosePicDialog :is-show="showPicDialog" 
								:project-uid="projectUid"
								@close-event="closePicDialog"
								@on-init="initPicDialog"
								:options="picDialog" />
						</div>
					</div>
					<!-- end filter -->
					<!-- pic results -->
					<div class="card-result mt-3">
						<v-table>
							<thead>
								<tr>
									<th
										v-for="(column, c) in columns"
										:key="c"
										:class="`column-${column.name}`">
										{{ column.text }}
									</th>
								</tr>
							</thead>
							<tbody>
								<template v-if="loadingProcess">
									<tr>
										<td colspan="9" class="text-center">
											<v-skeleton-loader
												width="100%"
								                type="table"></v-skeleton-loader>
										</td>
									</tr>
								</template>
								<template v-else>
									<template v-if="showFilterResult && resultFilterGroup">
										<template v-for="(events, key) in itemGroups">
								         	<template v-for="(event, index) in events" :key="event.id">
									            <!-- Only render rowspan for the first row of each group -->
									            <tr v-if="groupModel == 'name' && (index === 0 || events[index].name !== events[index - 1].name)"
									            	:class="{
														'bg-primary': event.selected_project
													}">
													<td class="column-name"
														:rowspan="getRowSpan(events, 'name', index)"
														v-if="groupModel == 'name'">
														{{ event.name }}
													</td>
													<td class="column-class"
														:rowspan="getRowSpan(events, 'name', index)"
														v-if="groupModel == 'class'">
														{{ event.event_class }}
													</td>
													<td class="column-project">{{ event.project }}</td>
													<td class="column-date">{{ event.date }}</td>
													<td v-if="groupModel == 'name'" class="column-class">
														<v-chip :style="{ backgroundColor: event.event_class_color }">
															{{ event.event_class }}
														</v-chip>
													</td>
													<td v-if="groupModel == 'class'" class="column-name">{{ event.name }}</td>
													<td class="column-venue">{{ event.venue }}</td>
													<td class="column-eventType">{{ event.event_type }}</td>
													<td class="column-collaboration">{{ event.collaboration }}</td>
													<td class="column-status">
														<v-chip :color="event.status_color">
															{{ event.status }}
														</v-chip>
													</td>
													<td class="column-led">
														<p v-html="event.led_area"></p>
													</td>
									            </tr>
									            <tr v-else-if="groupModel == 'class' && (index === 0 || events[index].class !== events[index - 1].class)"
									            	:class="{
														'bg-primary': event.selected_project
													}">
													<td class="column-name"
														:rowspan="getRowSpan(events, 'name', index)"
														v-if="groupModel == 'name'">
														{{ event.name }}
													</td>
													<td class="column-class"
														:rowspan="getRowSpan(events, 'name', index)"
														v-if="groupModel == 'class'">
														<v-chip :style="{ backgroundColor: event.event_class_color }">
															{{ event.event_class }}
														</v-chip>
													</td>
													<td class="column-project">{{ event.project }}</td>
													<td class="column-date">{{ event.date }}</td>
													<td v-if="groupModel == 'name'" class="column-class">
														<v-chip :style="{ backgroundColor: event.event_class_color }">
															{{ event.event_class }}
														</v-chip>
													</td>
													<td v-if="groupModel == 'class'" class="column-name">{{ event.name }}</td>
													<td class="column-venue">{{ event.venue }}</td>
													<td class="column-eventType">{{ event.event_type }}</td>
													<td class="column-collaboration">{{ event.collaboration }}</td>
													<td class="column-status">
														<v-chip :color="event.status_color">
															{{ event.status }}
														</v-chip>
													</td>
													<td class="column-led">
														<p v-html="event.led_area"></p>
													</td>
									            </tr>
									            <tr v-else
									            	:class="{
														'bg-primary': event.selected_project
													}">
													<td class="column-project">{{ event.project }}</td>
													<td class="column-date">{{ event.date }}</td>
													<td v-if="groupModel == 'name'" class="column-class">
														<v-chip :style="{ backgroundColor: event.event_class_color }">
															{{ event.event_class }}
														</v-chip>
													</td>
													<td v-if="groupModel == 'class'" class="column-name">{{ event.name }}</td>
													<td class="column-venue">{{ event.venue }}</td>
													<td class="column-eventType">{{ event.event_type }}</td>
													<td class="column-collaboration">{{ event.collaboration }}</td>
													<td class="column-status">
														<v-chip :color="event.status_color">
															{{ event.status }}
														</v-chip>
													</td>
													<td class="column-led">
														<p v-html="event.led_area"></p>
													</td>
									            </tr>
								         	</template>
								        </template>
									</template>
									<template v-else>
										<tr v-for="(event, e) in itemGroups"
											:key="e"
											:class="{
												'bg-primary': event.selected_project
											}">
											<td class="column-name">{{ event.name }}</td>
											<td class="column-project">{{ event.project }}</td>
											<td class="column-date">{{ event.date }}</td>
											<td class="column-class">
												<v-chip :style="{ backgroundColor: event.event_class_color }">
													{{ event.event_class }}
												</v-chip>
											</td>
											<td class="column-venue">{{ event.venue }}</td>
											<td class="column-eventType">{{ event.event_type }}</td>
											<td class="column-collaboration">{{ event.collaboration }}</td>
											<td class="column-status">
												<v-chip :color="event.status_color">
													{{ event.status }}
												</v-chip>
											</td>
											<td class="column-led">
												<p v-html="event.led_area"></p>
											</td>

											<v-tooltip v-if="event.selected_project"
												activator="parent"
												location="top">
												Selected project
											</v-tooltip>
							            </tr>
									</template>
								</template>
							</tbody>
						</v-table>
					</div> <!-- end pic results -->
				</v-card-text>
			</master-card>
		</v-expand-x-transition>
	</v-dialog>
</template>

<style lang="scss" scoped>
	.card-result {
		background: #e6e6e6;
	}

	.filter-section {
		padding: 8px;
		background-color: #f6f6f6;
		border-radius: 4px;
	}

	.filter-item {
		border-radius: 4px;
		transition: all .5s;
	}

	.filter-item.active {
		background-color: #f6f6f6;
		padding: 4px 12px;
	}

	.filter-column-dropdown label {
		font-size: 12px !important;
	}
</style>

<style lang="scss">
	.filter-column-dropdown label {
		font-size: 12px !important;
	}
</style>

<script setup>
import moment from "moment";
import { ref, watch, onMounted } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import {
	mdiClose,
	mdiViewColumnOutline,
	mdiFormatListGroup,
	mdiFilterOutline,
	mdiSort,
} from '@mdi/js'
import ChoosePicDialog from './ChoosePicDialog.vue'

const { t } = useI18n()

const showPicDialog = ref(false)

const { defineField, errors, handleSubmit, setFieldValue, resetForm } = useForm({
	validationSchema: yup.object({
		start_date: yup.string().nullable(),
		end_date: yup.string().nullable(),
	})
})

const [start_date] = defineField('start_date')
const [end_date] = defineField('end_date')

const emit = defineEmits(['close-event'])

const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
	projectUid: {
		type: String,
		default: '',
	}
})

const store = useProjectStore()

const filterByVenue = ref('')

const loadingProcess = ref(false)

const masterFilter = ref({})

const showFilterMenu = ref(false)

const dateGroupModel = ref('month')

const filter_month = ref({
	month: new Date().getMonth(),
	year: new Date().getFullYear()
})

const show = ref(false)

const filterButtonDates = ref([
	// {
	// 	href: 'month',
	// 	text: 'Month',
	// },
	{
		href: 'custom',
		text: 'Custom',
	},
])

const itemGroups = ref([]);

const picDialog = ref([]);

const loadingPrepareDialog = ref(false);

const showFilterResult = ref(false)

const resultFilterGroup = ref(false)
const resultFilterDate = ref(false)

const items = ref([])

const columnsModel = ref([
	'name', 'project', 'date',
	'class', 'venue', 'eventType',
	'status', 'collaboration', 'led'
])

const groupModel = ref('')

const filterGroupValue = ref(null)
const filterDateValue = ref(null)

const columns = ref([
	{
		name: 'name',
		status: 1,
		active: 1,
		sort: 0,
		text: t('name'),
	},
	{
		name: 'project',
		status: 1,
		active: 1,
		sort: 1,
		text: t('project'),
	},
	{
		name: 'date',
		status: 1,
		active: 1,
		sort: 2,
		text: t('date'),
	},
	{
		name: 'class',
		status: 1,
		active: 1,
		sort: 3,
		text: t('eventClass'),
	},
	{
		name: 'venue',
		status: 1,
		active: 1,
		sort: 4,
		text: t('venue'),
	},
	{
		name: 'eventType',
		status: 1,
		active: 1,
		sort: 5,
		text: t('eventType'),
	},
	{
		name: 'status',
		status: 1,
		active: 1,
		sort: 7,
		text: t('status'),
	},
	{
		name: 'collaboration',
		status: 1,
		active: 1,
		sort: 6,
		text: t('collaboration'),
	},
	{
		name: 'led',
		status: 1,
		active: 1,
		sort: 8,
		text: t('ledArea'),
	},
])

const tab = ref('date')

const filterModel = ref(null)

watch(props, (values) => {
	if (values) {
		show.value = values.isShow

		if (values.projectUid && values.isShow) {
			getScheduler()
		}
	}
})

onMounted(() => {
	sortColumns(columns.value)
})

function setDefaultFilter() {
	var now = moment()
	setFieldValue('end_date', now.add(7, 'days').format('YYYY, MMMM DD'))
	setFieldValue('start_date', now.subtract(7, 'days').format('YYYY, MMMM DD'))

	masterFilter.value.start_date = start_date.value
	masterFilter.value.end_date = end_date.value
}

async function getScheduler(isDefault = false) {
	loadingProcess.value = true

	// set default filter
	if (isDefault) {
		setDefaultFilter()
	}

  if (masterFilter.value.end_date) {
    masterFilter.value.end_date = moment(masterFilter.value.end_date, "YYYY, MMMM DD").format("YYYY-MM-DD");
  }
  if (masterFilter.value.start_date) {
    masterFilter.value.start_date = moment(masterFilter.value.start_date, "YYYY, MMMM DD").format("YYYY-MM-DD");
  }

	const resp = await store.getScheduler(props.projectUid, masterFilter.value)

	loadingProcess.value = false

	if (resp.status < 300) {
		items.value = resp.data.data.projects

		// if group filter is active, then manipulate the results
		if (groupModel.value == 'class' || groupModel.value == 'name') {
			updateGroupFilter(false)
		} else {
			itemGroups.value = resp.data.data.projects
		}

		if ((resp.data.data.filter.date != undefined) && (resp.data.data.filter.date.enable)) {
			dateGroupModel.value = 'custom'
			showFilterResult.value = true
			resultFilterDate.value = true
			filterDateValue.value = t('filterDateValue', {
				startDate: resp.data.data.filter.date.start_date,
				endDate: resp.data.data.filter.date.end_date,
			})
			start_date.value = resp.data.data.filter.date.start_date
			end_date.value = resp.data.data.filter.date.end_date
		}
	}
}

function updateFilterFilter(value) {
	if (value) {
		filterModel.value = 'filter'
	} else {
		filterModel.value = null
	}
}

function updateGroupFilter(value) {
	if (!value) {
		filterModel.value = null
		if (groupModel.value) {
			itemGroups.value = groupedBy(items.value, groupModel.value == 'class' ? 'event_class' : groupModel.value)

			// change columns sort
			var currentColumns = columns.value

			if (groupModel.value == 'class') {
				currentColumns.forEach((elem, i) => {
					if (elem.name == 'class') {
						elem.sort = 0
						elem.active = 0
					}

					if (elem.name == 'name') {
						elem.sort = 3
						elem.active = 0
					}
				})
			} else {
				currentColumns.forEach((elem, i) => {
					if (elem.name == 'name') {
						elem.sort = 0
						elem.active = 0
					}

					if (elem.name == 'class') {
						elem.sort = 3
						elem.active = 0
					}
				})
			}

			columns.value = currentColumns

			sortColumns(columns.value)

			filterGroupValue.value = t('groupByValue', {value: groupModel.value})

			showFilterResult.value = true
			resultFilterGroup.value = true
		}
	} else {
		filterModel.value = 'group'
	}
}

function updateColumnFilter(value) {
	if (!value) { // update on close
		var removedColumn = []
		var filterColumns = columns.value.map((mapping) => {
			mapping.status = 1
			if (columnsModel.value.indexOf(mapping.name) < 0) {
				mapping.status = 0

				removedColumn.push(mapping.name)
			}

			return mapping
		})

		// fresh format current element
		for (let b = 0; b < filterColumns.length; b++) {
			document.querySelectorAll(`.column-${filterColumns[b].name}`).forEach((currentCol) => {
				if (filterColumns[b].status) {
					currentCol.classList.remove('d-none')
				} else {
					currentCol.classList.add('d-none')
				}
			})
		}

		filterModel.value = null
	} else {
		filterModel.value = 'column'
	}
}

function groupedBy(arr, key) {
  	return arr.reduce((result, currentValue) => {
	    // Get the value of the key to group by
	    const groupKey = currentValue[key];

	    // Initialize the array for this key if it doesn't exist
	    if (!result[groupKey]) {
	      result[groupKey] = [];
	    }

	    // Add the current object to the appropriate array
	    result[groupKey].push(currentValue);

    	return result;
  	}, {});
}

function getRowSpan(events, key, index) {
	key = groupModel.value
	const value = events[index][key];
	let count = 0;
	for (let i = index; i < events.length; i++) {
		if (events[i][key] === value) {
			count++;
		} else {
			break;
		}
	}
	return count;
}

function sortColumns(arr) {
	return arr.sort((a, b) => a.sort - b.sort)
}

function sortGroupsByDate(dataArray) {
	return dataArray.sort((a, b) => {
		// Parse the date strings into Date objects
		const dateA = new Date(a.date.split(' ')[0] + ' ' + a.date.split(' ')[1] + ', ' + a.date.split(' ')[2]);
		const dateB = new Date(b.date.split(' ')[0] + ' ' + b.date.split(' ')[1] + ', ' + b.date.split(' ')[2]);

		// Return the comparison for ascending order
		return dateA - dateB;
	})
}

function clearGroupFilter() {
	// reset columns
	var currentColumns = columns.value

	currentColumns.forEach((elem, i) => {
		if (elem.name == 'name') {
			elem.sort = 0
			elem.active = 1
		}

		if (elem.name == 'class') {
			elem.sort = 3
			elem.active = 1
		}
	})
	sortColumns(currentColumns)
	columns.value = currentColumns

	// reset variable
	groupModel.value = ''
	itemGroups.value = items.value
	resultFilterGroup.value = false
	showFilterResult.value = false
}

const validateFilterDate = handleSubmit((values) => {
	if (values.start_date) {
		masterFilter.value.start_date = values.start_date
	}
	if (values.end_date) {
		masterFilter.value.end_date = values.end_date
	}
	if (filterByVenue.value != '') {
		masterFilter.value.filter_venue = 1
	} else {
		masterFilter.value.filter_venue = 0
	}

	if (dateGroupModel.value == 'month') {
		masterFilter.value.filter_month = filter_month.value.month
		masterFilter.value.filter_year = filter_month.value.year
	} else {
		masterFilter.value.filter_month = null
		masterFilter.value.filter_year = null
	}

	getScheduler()

	closeFilterMenu()
})

function closeFilterMenu() {
	showFilterMenu.value = false
	filterModel.value = null
}

function openPicDialog() {
	showPicDialog.value = true
}

async function initPicDialog() {
	loadingPrepareDialog.value = true
	const resp = await store.getPicScheduler(props.projectUid)
	loadingPrepareDialog.value = false

	if (resp.status < 300) {
		picDialog.value = resp.data.data
	}
}

function closePicDialog(isCloseForm = false) {
	showPicDialog.value = false

  closeFinderManager(isCloseForm)
}

function clearFilterVenue(isRefresh = false) {
	filterByVenue.value = ''
	masterFilter.value.filter_venue = 0

	if (isRefresh) {
		getScheduler()
	}
}

function closeFinderManager(isRefresh = false) {
	showPicDialog.value = false
	clearGroupFilter()
	closeFilterMenu()
	clearFilterVenue(false)
	resetForm()
	masterFilter.value.start_date = null
	masterFilter.value.end_date = null
	emit('close-event', isRefresh)
}
</script>
