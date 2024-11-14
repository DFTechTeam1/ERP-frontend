<template>
    <div class="box-wrapper d-flex align-center ga-5 flex-wrap">
        <div class="box-item pointer"
            v-for="(item, i) in items"
            :key="i"
            @click.prevent="$router.push({path: item.link})">
            <div class="box-content text-center">
                <v-img
                    :src="item.icon"
                    width="150"
                    height="100"></v-img>
                <p class="title">{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .box-wrapper {
        width: 100%;
        padding: 20px 100px;
    }

    .box-item {
        transition: .5s all;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        width: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        height: 200px;

        .title {
            font-size: 16px;
            font-weight: bold;
        }

        &:hover {
            transform: scale(1.1);
        }
    }
</style>

<script setup>
import { ref } from 'vue'
import { mdiEmailFastOutline } from '@mdi/js'

const items = ref([
    {
        icon: '/setting/company.svg',
        name: 'General',
        id: 1,
        link: '/admin/setting/company',
    },
    {
        icon: '/setting/notification.svg',
        name: 'Notification',
        id: 2,
        link: '/admin/setting/notification',
    },
    {
        icon: '/setting/finance_backup_database.svg',
        name: 'Production Variables',
        id: 3,
        link: '/admin/setting/variables',
    },
    {
        icon: '/setting/account_mappings.svg',
        name: 'Account',
        id: 3,
        link: '/admin/setting/account-mappings',
    },
    {
        icon: '/setting/email_template.svg',
        name: 'Email Configuration',
        id: 3,
        link: '/admin/setting/email-template',
    },
])
</script>