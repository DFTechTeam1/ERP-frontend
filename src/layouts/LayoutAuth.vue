<template>
    <v-app
        style="overflow: hidden;">
        <v-row>
            <v-col
                class="auth-wrapper-left position-relative d-flex align-center justify-center"
                md="7"
                cols="12">
                <div class="auth-header pt-lg-6 pt-2 px-sm-6 px-3 pb-lg-6 pb-0">
                    <div class="position-relative">
                        <v-img
                            src="/dfactory.webp"
                            width="80"></v-img>
                    </div>
                </div>

                <div class="auth-hero">
                    <img src="/loginhero.svg" class="position-relative d-none d-lg-flex" alt="">
                </div>
            </v-col>

            <v-col
                class="d-flex align-center justify-center"
                md="5"
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