<template>
    <v-app>

        <v-main style="min-height: 300px; background-color: #fbfbfb45;">
            <div class="main-content-drawer maxWidth">
                <!-- header -->
                <v-app-bar :elevation="2" class="header-addons">
                    <v-app-bar-title>
                        <v-img
                            src="/dfactory.webp"
                            width="50"
                            height="50"></v-img>
                    </v-app-bar-title>

                    <template v-slot:append>
                        <v-btn 
                            variant="outlined" 
                            class="btn-ask" 
                            rounded
                            @click="isShowAsk = true">ask developer</v-btn>
                    </template>
                </v-app-bar>
                <!-- end header -->


                <!-- upper -->
                <div class="upper-section">
                    <div class="upper-item">
                        <div class="image"></div>
                    </div>
                    <div class="upper-item">
                        <!-- updated addon -->
                        <div class="updated-header">
                            <p>updated addon</p>
                        </div>
                        <div class="updated-body position-relative">
                            <template v-if="loadingUpdateData">
                                <v-skeleton-loader
                                    :loading="loading"
                                    type="list-item"
                                    ></v-skeleton-loader>
                            </template>

                            <template v-else>
                                <template v-if="updated.length">
                                    <div 
                                        v-for="(list, i) in updated"
                                        :key="i"
                                        class="list d-flex align-center justify-space-between pointer"
                                        :id="'updated-list-' + i"
                                        @click.prevent="activatedUpdate(i)">
                                        <p>{{ list.addon.name }}</p>
                
                                        <div class="action d-flex align-center ga-1">
                                            <v-icon
                                                class="pointer"
                                                :icon="mdiReceiptTextOutline"
                                                @click.prevent="downloadAddon(list, 'tutorial', true)"
                                                size="20"></v-icon>
                                            <v-icon
                                                class="pointer"
                                                :icon="mdiDownload"
                                                @click.prevent="downloadAddon(list, 'main', true)"
                                                size="20"></v-icon>
                                        </div>
                                    </div>
                                </template>

                                <template v-else>
                                    <div class="d-flex align-center justify-center position-absolute my-auto w-100 h-100">
                                        <h4>No Update Yet</h4>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- end upper -->

                <!-- list -->
                <v-card class="mt-10">
                    <v-card-title>
                        <div class="box-list">
                            <div class="box-header d-flex align-center justify-space-between">
                                <p class="title">essentials</p>

                                <!-- <a href="#" style="font-size: 12px;">Newest first</a> -->
                            </div>
                        </div>
                    </v-card-title>

                    <v-card-text>
                        <template v-if="loading">
                            <v-row>
                                <v-col cols="12"
                                    lg="4"
                                    md="4">
                                    <v-skeleton-loader
                                        type="image, article"
                                        ></v-skeleton-loader>
                                </v-col>
                                <v-col cols="12"
                                    lg="4"
                                    md="4">
                                    <v-skeleton-loader
                                        type="image, article"
                                        ></v-skeleton-loader>
                                </v-col>
                                <v-col cols="12"
                                    lg="4"
                                    md="4">
                                    <v-skeleton-loader
                                        type="image, article"
                                        ></v-skeleton-loader>
                                </v-col>
                            </v-row>
                        </template>
                        <template v-else>
                            <v-row v-if="lists.length">
                                <v-col
                                    cols="12"
                                    lg="4"
                                    md="4"
                                    v-for="(list, x) in lists"
                                    :key="x">
                                    <v-card class="card-item" height="430">
                                        <v-img
                                            :src="list.preview_img"></v-img>
    
                                        <v-card-text>
                                            <div class="d-flex align-center justify-space-between">
                                                <p class="name">{{ list.name }}</p>
    
                                                <div class="action d-flex align-center ga-1">
                                                    <v-icon
                                                        class="pointer"
                                                        :icon="mdiReceiptTextOutline"
                                                        @click.prevent="detailList(list)"
                                                        size="20"></v-icon>
                                                    <v-icon
                                                        class="pointer"
                                                        :icon="mdiDownload"
                                                        @click.prevent="downloadAddon(list, 'main')"
                                                        size="20"></v-icon>
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-row v-else>
                                <v-col>
                                    <div class="text-center">
                                        <h3>No addons yet</h3>
                                    </div>
                                </v-col>
                            </v-row>
    
                            <v-row v-if="lists.length">
                                <v-col
                                    cols="12"
                                    lg="4"
                                    md="4">
                                    <v-pagination
                                        size="small"
                                        v-model="page"
                                        :length="pageLength"
                                        rounded="circle"
                                        @update:model-value="updatePagination"
                                        ></v-pagination>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card-text>
                </v-card>
                <!-- end list -->

                <detail-addon
                    :detail="detailListItem"
                    :is-show="isShowDetailList"
                    @close-desc="closeDetailList"></detail-addon>

                <ask-developer
                    :is-show="isShowAsk"
                    @close-ask="isShowAsk = false"></ask-developer>
            </div>
        </v-main>
    </v-app>
</template>

<style lang="scss">
.header-addons .v-toolbar__content {
    max-width: 1200px;
    margin: 0 auto;
}
</style>

<style scoped lang="scss">
.maxWidth {
    max-width: 1200px;
    margin: 0 auto;
}
.main-content-drawer {
    padding: 15px;
}

.btn-ask {
    background-color: #000;
    color: #fff;
    text-transform: uppercase;
}

.box-list {
    padding: 14px;

    .box-header {
        .title {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 18px;
        }
    }
}

.card-item {
    .name {
        font-weight: bolder;
    }
}

.upper-section {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 400px;

    .upper-item:first-child {
        width: 75%;

        .image {
            background-image: url('/public/bgaddons.jpg');
            background-size: cover;
            background-repeat: no-repeat;
            height: 100%;
        }
    }

    .upper-item:last-child {
        width: 25%;
        height: 100%;
        background-color: #e6e6e6;

        .updated-header {
            background-color: #fff;
            padding: 8px 12px;
            border: 1px solid #e6e6e6;

            p {
                margin: 0;
                color: #000;
                font-weight: bold;
                text-transform: uppercase;
            }
        }

        .updated-body {
            height: 85%;
            overflow-x: scroll;

            .list {
                padding: 8px 12px;
                margin-bottom: 6px;
            }

            .list.active {
                background-color: #42A5F5;
                color: #fff;
            }

            .list:hover {
                border: 1px solid #42A5F5;
            }
        }
    }
}
</style>

<script setup>
import { mdiReceiptTextOutline, mdiDownload } from '@mdi/js'
import { ref, onMounted } from 'vue'
import DetailAddon from './DetailAddon.vue'
import AskDeveloper from './AskDeveloper.vue'
import { useAddonStore } from '@/stores/addon'

const store = useAddonStore();

const updated = ref([])

const lists = ref([])

const page = ref(1)

const pageLength = ref(1);

const detailListItem = ref(null)

const isShowDetailList = ref(false)

const loading = ref(false);

const loadingUpdateData = ref(false);

const isShowAsk = ref(false)

function activatedUpdate(index) {
    document.querySelectorAll('.list').forEach(element => {
        element.classList.remove('active')
    });

    document.getElementById('updated-list-' + index).classList.add('active')
}

function detailList(listData) {
    detailListItem.value = listData
    isShowDetailList.value = true
}

function closeDetailList() {
    isShowDetailList.value = false
}

async function initList(payload = null) {
    loading.value = true;
    const response = await store.initFrontendAddons(payload);
    loading.value = false;

    if (response.status < 300) {
        lists.value = response.data.data.paginated;

        pageLength.value = Math.ceil(parseInt(response.data.data.totalData)/10);
    }
}   

function updatePagination(content) {
    const payload = {
        page: content,
        itemsPerPage: 10,
    }

    initList(payload);
}

async function downloadAddon(payload, type, fromUpdate = false) {
    console.log('payload', payload);
    var payloadres = {id: payload.uid, type: type};

    if (fromUpdate) {
        payloadres.id = payload.addon_id;
    }
    const res = await store.downloadData(payloadres);

    if (res.status < 300) {
        // window.open(res.data.data.url, '_blank');
        window.location.href = res.data.data.url;
    }
}

async function initUpdatedAddons() {
    loadingUpdateData.value = true;
    const resp = await store.initUpdatedAddons();
    loadingUpdateData.value = false;

    if (resp.status < 300) {
        updated.value = resp.data.data;
    }
}

onMounted(() => {
    initList();
    initUpdatedAddons();
});
</script>