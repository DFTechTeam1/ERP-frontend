<template>
    <v-dialog
        v-model="show"
        max-width="700"
        persistent>
        <v-card class="bg-grey-lighten-2">
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <div class="task-name d-flex align-center ga-4">
                        <v-icon
                            :icon="mdiLaptop"
                            size="20"></v-icon>
                        <p>{{ detail.name }}</p>
                    </div>

                    <v-icon
                        :icon="mdiClose"
                        size="25"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-row>
                    <!-- LEFT CONTENT -->
                    <v-col
                        cols="12"
                        lg="8"
                        md="8">
                        <!-- members, deadline -->
                        <template v-if="detail.members.length">
                            <div class="generic d-flex ga-5">
                                <task-member
                                    :members="detail.members"></task-member>

                                <task-deadline
                                    v-if="detail.start_date.length && detail.end_date.length"
                                    :start-date="detail.start_date"
                                    :end-date="detail.end_date"></task-deadline>
                            </div>
                        </template>
                        <!-- end members, deadline -->

                        <!-- description -->
                        <div class="description mt-10">
                            <div class="title-desc d-flex align-center justify-space-between">
                                <div class="d-flex align-center ga-5">
                                    <v-icon
                                        :icon="mdiMenu"
                                        size="20"></v-icon>
                                    <h3>{{ $t('description') }}</h3>
                                </div>

                                <v-btn
                                    v-if="!isAddDescription && detail.description.length"
                                    variant="flat"
                                    size="small"
                                    color="white"
                                    @click.prevent="editDescription">
                                    {{ $t('edit') }}
                                </v-btn>
                            </div>

                            <div class="value-desc">
                                <template v-if="!detail.description.length && !isAddDescription">
                                    <div class="desc-empty"
                                        @click.prevent="isAddDescription = true">
                                        {{ $t('addMoreDetail') }}
                                    </div>
                                </template>

                                <template v-if="detail.description.length && !isAddDescription">
                                    <p v-html="detail.description" class="mt-4"></p>
                                </template>

                                <template v-if="isAddDescription">
                                    <div class="editor bg-white mt-4">
                                        <QuillEditor 
                                            theme="snow" 
                                            ref="description_quill"
                                            @update:content="updateDescription" />
                                    </div>

                                    <div class="editor-action mt-4">
                                        <v-btn
                                            variant="flat"
                                            color="black"
                                            @click.prevent="saveDescription">
                                            {{ $t('save') }}
                                        </v-btn>
                                        <v-btn
                                            variant="flat"
                                            color="white"
                                            @click.prevent="closeEditor">
                                            {{ $t('cancel') }}
                                        </v-btn>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <!-- end description -->

                        <deadline-form
                            :is-show="showDeadlineForm"
                            @close-event="showDeadlineForm = false"
                            @save-event="saveDate"></deadline-form>
                    </v-col> <!-- END LEFT CONTENT -->

                    <!-- RIGHT CONTENT -->
                    <v-col
                        cols="12"
                        lg="4"
                        md="4">
                        <div class="action-wrapper">
                            <div class="action-box mb-4">
                                <p class="title-action">{{ $t('addToCard') }}</p>

                                <div class="action-list">
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1"
                                        @click.prevent="showDeadlineForm = true">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiClockOutline"
                                            size="20"></v-icon>
                                        {{ $t('dates') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiAccountSupervisor"
                                            size="20"></v-icon>
                                        {{ $t('members') }}
                                    </v-btn>
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiAttachment"
                                            size="20"></v-icon>
                                        {{ $t('attachments') }}
                                    </v-btn>
                                </div>
                            </div>

                            <div class="action-box mb-4">
                                <p class="title-action">{{ $t('action') }}</p>

                                <div class="action-list">
                                    <v-btn
                                        variant="flat"
                                        class="w-100 text-left mb-3"
                                        color="grey-darken-1">
                                        <v-icon
                                            class="mr-1"
                                            :icon="mdiArrowRight"
                                            size="20"></v-icon>
                                        {{ $t('move') }}
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </v-col> <!-- END RIGHT CONTENT -->
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
.desc-empty {
    background-color: #fff;
    padding: 8px 12px;
    border: 1px solid #000;
    width: 100%;
    border-radius: 4px;
    margin-top: 10px;
}

.title-action {
    font-size: 13px;
    margin-bottom: 10px;
    color: rgb(101, 99, 99);
}
</style>

<script setup>
import { ref, watch } from 'vue';
import { 
    mdiLaptop, 
    mdiClose, 
    mdiMenu, 
    mdiClockOutline,
    mdiAccountSupervisor,
    mdiAttachment,
    mdiArrowRight
 } from '@mdi/js';
import TaskMember from './TaskMember.vue';
import TaskDeadline from './TaskDeadline.vue';
import DeadlineForm from './DeadlineForm.vue';

const show = ref(false);

const isAddDescription = ref(false);

const showDeadlineForm = ref(false);

const description_quill = ref(null);

const description = ref(null);

defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const detail = ref({
    name: 'Search image references for Events',
    description: '',
    members: [
        {id: 1, name: 'Ilham Meru', color: 'warning', initial: 'IM'},
        {id: 1, name: 'Ricky', color: 'primary', initial: 'R'},
        {id: 1, name: 'Rony', color: 'brown', initial: 'RO'},
    ],
    start_date: '',
    end_date: '',
    attachments: [],
    comments: [],
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

function saveDate(payload) {
    detail.value.start_date = payload.startDate;
    detail.value.end_date = payload.endDate;
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        description.value = description_quill.value.getHTML();
    } else {                                                                                                                                                                                                                                                                                                                                                                              
        description.value = null;
    }

}

function closeEditor() {
    isAddDescription.value = false;
}

function saveDescription() {
    detail.value.description = description.value == null ? '' : description.value

    closeEditor();
}

function editDescription() {
    isAddDescription.value = true;
    
    setTimeout(() => {
        description_quill.value.setHTML(description.value);
    }, 200);
}
</script>