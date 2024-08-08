<template>
    <master-card style="border-radius: 6px;" min-height="220">
        <v-card-text>
            <div class="header-filter d-flex align-center ga-2">
                <div class="filter-item text-center active">
                    {{ $t('onGoing') }}
                </div>
                <div class="filter-item text-center">
                    {{ $t('complete') }}
                </div>
            </div>

            <div class="preview-box">
                <p class="text-center">No Task Yet</p>
            </div>
        </v-card-text>
    </master-card>
</template>

<style lang="scss" scoped>
.header-filter {
    .filter-item {
        background: #fff;
        border: 2px solid #ececec;
        color: rgb(181, 181, 181);
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 13px;
        cursor: pointer;
    }

    .filter-item.active {
        background-color: #7a7a7a;
        color: #fff;
        font-weight: bold;
    }
}

.preview-box {
    border-radius: 6px;
    background-color: #f7f7f7;
    padding: 10px 12px;
    min-height: 350px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<script setup></script>