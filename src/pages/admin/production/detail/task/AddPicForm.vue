<template>
    <v-dialog
        v-model="show"
        max-width="600">
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('assignPic') }}

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        @click.prevent="emit('close-event')"
                        color="red"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <template v-if="loadingGetTeams">
                    <v-skeleton-loader
                        class="mb-3"
                        type="list-item-avatar"></v-skeleton-loader>
                    <v-skeleton-loader
                        class="mb-3"
                        type="list-item-avatar"></v-skeleton-loader>
                    <v-skeleton-loader
                        class="mb-3"
                        type="list-item-avatar"></v-skeleton-loader>
                </template>
                <template v-else>
                    <v-list density="compact"
                        max-height="300px"
                        v-for="(member, i) in members"
                        :key="i">
                        <v-list-subheader :title="t(i)"></v-list-subheader>

                        <template v-if="!member.length">
                            <span class="text-center w-100 d-block">Empty List</span>
                        </template>

                        <v-list-item
                            v-for="(memberList, x) in member"
                            :key="x"
                            :value="memberList"
                            class="pointer mb-2"
                            :active="memberList.selected"
                            color="primary"
                            @click.prevent="chooseUser(memberList.selected ? null : memberList)">

                            <template v-slot:prepend>
                                <v-avatar>
                                    <v-img
                                        :src="memberList.image"></v-img>
                                </v-avatar>
                            </template>

                            <v-list-item-title>
                                <p style="font-size: 14px" class="m-0 fw-bold">
                                    {{ memberList.name }}

                                    <v-chip color="primary" size="x-small" v-if="memberList.is_lead_modeller">Lead Modeller</v-chip>
                                </p>
                                <p style="font-size: 12px;" class="m-0">{{ memberList.email }}</p>
                            </v-list-item-title>

                            <template v-slot:append
                                v-if="memberList.selected">
                                <v-list-item-action end>
                                    <v-icon
                                        :icon="mdiClose"
                                        class="pointer"
                                        @click.prevent="removeMember(memberList)"
                                        size="20"
                                        color="red"></v-icon>
                                </v-list-item-action>
                            </template>

                        </v-list-item>
                    </v-list>
                </template>

                <v-btn
                    class="w-100 mt-3"
                    variant="flat"
                    color="primary"
                    :disabled="loading"
                    @click.prevent="submitUser">
                    <template v-if="loading">{{ $t('processing') }}</template>
                    <template v-else>{{ $t('save') }}</template>
                </v-btn>

            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { showNotification } from '@/compose/notification';

const { t } = useI18n();

const store = useProjectStore();

const { detailOfTask } = storeToRefs(store);

const show = ref(false);

const loadingGetTeams = ref(false);

const loading = ref(false);

const selectedUser = ref([]);

const emit = defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const members = ref({});

const removedUser = ref([]);

async function getPicMember(payload) {
    loadingGetTeams.value = true;
    const resp = await store.getPMMembers(payload);
    loadingGetTeams.value = false;

    if (resp.status < 300) {
        members.value.selected = resp.data.data.selected;
        members.value.available = resp.data.data.available;
    }
}

function chooseUser(member) {
    if (member) {
        // validate pic
        if (members.value.selected.length) {
            let isHaveLeadModeller = members.value.selected.filter((filter) => {
                return filter.is_lead_modeller;
            });

            let isValid = true;
            let errorMsg = "Cannot add more member when you already have lead modeller in it";
            if (
                (isHaveLeadModeller.length) &&
                (isHaveLeadModeller[0].id != member.id)
            ) {
                isValid = false;
            }
            if (!isHaveLeadModeller.length && member.is_lead_modeller) {
                isValid = false;
                errorMsg = "Cannot combine members with lead modelers";
            }

            if (!isValid) {
                showNotification(errorMsg, 'error');
                return false;
            }
        }

        member.selected = true;

        members.value.selected.push(member);

        var available = members.value.available.filter((elem) => {
            return elem.uid != member.uid;
        });

        members.value.available = available;

        var filterRemoved = removedUser.value.filter((filter) => {
            return filter.uid != member.uid;
        });
        removedUser.value = filterRemoved;
    }
}

async function submitUser() {
    selectedUser.value = members.value.selected;

    var users = [];
    for (let a = 0; a < selectedUser.value.length; a++) {
        users.push(selectedUser.value[a].uid);
    }

    var removed = removedUser.value.map((elem) => {
        return elem.uid;
    });

    var payload = {
        users: users,
        removed: removed
    }

    loading.value = true;
    const resp = await store.assignMemberToTask(payload, detailOfTask.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        removedUser.value = [];
        emit('close-event');
    } else {
      showNotification(resp.response.data.message, 'error');
    }
}

function removeMember(member) {
    removedUser.value.push(member);

    member.selected = false;

    members.value.available.push(member);

    var selected = members.value.selected.filter((elem) => {
        return elem.uid != member.uid;
    });

    members.value.selected = selected;
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }

    if (values.isShow) {
        getPicMember({project_id: detailOfTask.value.project_id, task_id: detailOfTask.value.uid});
    }

})
</script>