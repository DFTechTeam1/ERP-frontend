<template>
    <master-card>
        <v-card-item>
            <v-card-title>
                {{ $t('scanInventory') }}
            </v-card-title>
        </v-card-item>

        <v-card-text>
            <div class="scanner-camera d-flex align-center justify-center">
                <qrcode-stream @camera-on="onReady" @detect="detectQrcode"
                    @error="onError"
                    class="scanner-box"></qrcode-stream>
            </div>

            <div class="decode">
                {{ decodeData }}
            </div>
        </v-card-text>
    </master-card>
</template>

<style lang="scss" scoped>
.scanner-camera {
    width: 512px !important;
    height: auto;
    margin: auto;
}
</style>

<script setup>
import { ref } from 'vue';
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

const decodeData = ref(null)

function onReady(capabilities) {
    console.log('capabilities', capabilities);
}

function onError(error) {
    console.log('error',error);
    if (error.name === 'NotAllowedError') {
      // user denied camera access permission
    } else if (error.name === 'NotFoundError') {
      // no suitable camera device installed
    } else if (error.name === 'NotSupportedError') {
      // page is not served over HTTPS (or localhost)
    } else if (error.name === 'NotReadableError') {
      // maybe camera is already in use
    } else if (error.name === 'OverconstrainedError') {
      // did you request the front camera although there is none?
    } else if (error.name === 'StreamApiNotSupportedError') {
      // browser seems to be lacking features
    }
  }

async function detectQrcode(decode) {
    const resp = await decode

    console.log('decode', resp);

    decodeData.value = resp[0].rawValue
}
</script>