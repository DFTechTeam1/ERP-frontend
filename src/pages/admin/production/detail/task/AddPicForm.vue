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
                        max-height="300px">
                        <v-list-item
                            v-for="(member, i) in members"
                            :key="i"
                            :value="member"
                            class="pointer mb-2"
                            :active="member.select"
                            color="primary"
                            @click.prevent="chooseUser(member)">
                        
                            <template v-slot:prepend>
                                <v-avatar
                                    size="30">
                                    <v-img
                                        :src="member.image"></v-img>
                                </v-avatar>
                            </template>
                    
                            <v-list-item-title>
                                <p style="font-size: 14px" class="m-0 fw-bold">{{ member.name }}</p>
                                <p style="font-size: 12px;" class="m-0">{{ member.email }}</p>
                            </v-list-item-title>
    
                        </v-list-item>
                    </v-list>
                </template>

                <v-btn
                    class="w-100 mt-3"
                    variant="flat"
                    color="primary"
                    @click.prevent="submitUser">
                    {{ $t('save') }}
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { watch, onMounted, ref } from 'vue';

const store = useProjectStore();

const { detailOfTask } = storeToRefs(store);

const show = ref(true);

const loadingGetTeams = ref(false);

const selectedUser = ref([]);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const members = ref([
    {id: 1, name: 'Ilham Meru', email: 'gumilang.dev@gmail.com', 'image': '/user.png', select: false},
    {id: 2, name: 'Rocky', email: 'rocky@gmail.com', 'image': '/user.png', select: false},
    {id: 3, name: 'Lebe', email: 'lebe@gmail.com', 'image': '/user.png', select: false},
    {id: 4, name: 'John Wick', email: 'johnwick224@gmail.com', 'image': '/user.png', select: false},
    {id: 5, name: 'John cena', email: 'cena7738@gmail.com', 'image': '/user.png', select: false},
]);

async function getPicMember(payload) {
    loadingGetTeams.value = true;
    const resp = await store.getPMMembers(payload);
    loadingGetTeams.value = false;

    if (resp.status < 300) {
        members.value = resp.data.data;
    }
}

function chooseUser(member) {
    var newMember = members.value.map((elem) => {
        if (elem.id == member.id) {
            if (elem.select) {
                elem.select = false;
            } else {
                elem.select = true;
            }
        }

        return elem;
    })

    members.value = newMember;
}

function submitUser() {
    selectedUser.value = members.value.filter((elem) => {
        return elem.select;
    }).map((item) => {
        return item.uid;
    })

    console.log('selected', selectedUser.value);
}

onMounted(() => {
    getPicMember({project_id: detailOfTask.value.board.project_id});
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
    
    getPicMember({project_id: detailOfTask.value.board.project_id});
})
</script>