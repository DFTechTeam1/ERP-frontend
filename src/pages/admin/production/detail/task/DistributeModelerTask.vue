<template>
    <v-dialog
        v-model="show"
        max-width="500"
        persistent>
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex justify-space-between">
                    Distribute Task

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        color="red"
                        class="pointer"
                        @click.prevent="closeModal"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <form @submit.prevent="validateData">
                    <!-- <field-input
                        label="Assign to Me"
                        v-model="assign_to_me"
                        input-type="switch"></field-input> -->

                  <v-text-field
							      density="compact"
                    v-if="assign_to_me == 0"
                    readonly
                    :clearable="true"
                    multiple
                    v-model="teams"
                    @click:clear="clearPic"
                    :error-messages="errors.teams"
                    variant="outlined"
                    :label="t('choosePic')">
                      <v-menu
                        max-height="350"
                        activator="parent">
                        <v-list
                          lines="three">
                                            <list-modeler
                                                :pics="teamList"
                            @select-item="selectPic"></list-modeler>
                        </v-list>
                      </v-menu>
                  </v-text-field>

                  <div class="d-flex justify-end">
                      <v-btn variant="flat"
                        :disabled="loading"
                        color="primary"
                        type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('needDistribute') }}</template>
                      </v-btn>
                  </div>
                </form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import * as yup from 'yup';
import ListModeler from './ListModeler.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { showNotification } from '@/compose/notification';

const store = useEmployeesStore();

const storeProject = useProjectStore();

const { t } = useI18n();

const emit = defineEmits(['close-event']);

const route = useRoute();

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    taskUid: {
        type: String
    }
});

const {defineField, handleSubmit, errors, setFieldValue, resetForm} = useForm({
    validationSchema: yup.object({
        assign_to_me: yup.boolean(),
        teams: yup.string().when('assign_to_me', {
            is: (value) => value == 0 ? true : false,
            then: function () {
                return yup.string().required();
            },
            otherwise: function () {
                return yup.string().nullable();
            }
        }),
    }),
    initialValues: {
        assign_to_me: 0
    }
});

const [assign_to_me] = defineField('assign_to_me');
const [teams] = defineField('teams');

const show = ref(false);

const loading = ref(false);

const teamList = ref([]);

const pics = ref([]);

const picNames = ref([]);

function selectPic(user) {
    console.log("user", user);
	var selected = teamList.value.filter((filter) => {
		return filter.value == user.value
	})

	pics.value.push(selected[0].value)
	pics.value = [...new Set(pics.value)]

	picNames.value.push(selected[0].title)
	picNames.value = [...new Set(picNames.value)]

	setFieldValue('teams', picNames.value.join(','))
}

function clearPic() {
	setFieldValue('teams', '');
	pics.value = [];
	picNames.value = [];
}

function closeModal() {
    picNames.value = [];
    pics.value = [];
    teamList.value = [];
    resetForm();
    emit('close-event');
}

async function getModellerTeam() {
    const resp = await store.get3DModeller({except_leader: 0}, route.params.id, props.taskUid);

    if (resp.status < 300) {
        teamList.value = resp.data.data;
    }
}

const validateData = handleSubmit(async(values) => {
    let payload = {
        assign_to_me: values.assign_to_me,
        teams: pics.value
    }

    loading.value  = true;
    const resp = await storeProject.distributeModeler(payload, route.params.id, props.taskUid);
    loading.value  = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        pics.value = [];
        picNames.value = [];
        teamList.value = [];
        resetForm();
        emit('close-event');
    } else {
        showNotification(resp.response.data.message, 'error');
    }
});

watch(assign_to_me, (values) => {
    if (values == 1) {
        setFieldValue('teams', '');
        pics.value = [];
        picNames.value = [];
    }
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        if (values.isShow) {
            getModellerTeam();
        }
    }
});
</script>
