<template>
    <v-app
        style="overflow: hidden;">
        <v-row>
            <v-col
                class="d-flex align-center justify-center"
                cols="12">
                <router-view></router-view>
            </v-col>
        </v-row>
    </v-app>
</template>

<style scoped lang="scss">
.auth-wrapper-left::before {
    background: radial-gradient(#d2f1df, #d3d7fa, #bad8f4) 0% 0% / 400% 400%;
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: .3;
    left: 0;
    top: 0;
    bottom: 0;
}

.auth-header {
    position: absolute;
    top: 0;
    left: 0;
}
</style>