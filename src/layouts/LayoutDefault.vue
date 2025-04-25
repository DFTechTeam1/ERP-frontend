<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <template v-if="!mobile">

      <v-navigation-drawer
        mobile-breakpoint="md"
        :rail="rail"
        rail-width="60"
        class="main-sidebar position-fixed"
      >
        <!-- logo -->
        <div
          class="logo-wrapper"
          :class="{
            'logo-collapsed': rail,
          }"
        >
          <img src="@/assets/dfactory.webp" class="logo" alt="" />
        </div>
        <!-- End Logo -->

        <!-- MENU ITEMS -->
        <v-list
          density="compact"
          class="v-list-scroll no-scroll">

          <template
            v-for="(menus, menuKey) in layoutItems"
            :key="menuKey">

            <!-- menu group -->
            <v-list-subheader v-if="!rail">{{ menus.name }}</v-list-subheader>
            <!-- end menu group -->

            <template
              v-for="(menu) in menus.childs"
              :key="menu.id">

              <template>
                <v-list-item
                  class="sub-menu pointer"
                  color="blue"
                  :class="{
                    'menu-active': menu.active_menu,
                    'menu-collapsed': rail,
                  }"
                  base-color="#000"
                  @click="navigate(menu)">
                  <template v-slot:prepend>
                    <v-img size="18"
                      :src="menu.icon"
                      width="15"
                      height="15"
                      class="mr-2"></v-img>
                  </template>
                  <template v-slot:title>
                    {{ menu.name }}
                  </template>
                </v-list-item>
              </template>

              <!-- <template v-else>

                <v-list>

                  <v-list-group
                    :value="menu.name"
                    color="blue"
                    :class="{
                      'menu-group-collapsed': rail
                    }">

                    <template v-slot:activator="{ props }">
                      <v-list-item
                        v-bind="props"
                        class="sub-menu pointer">

                        <template v-slot:prepend>
                          <v-img size="18"
                            :src="menu.icon"
                            width="15"
                            height="15"
                            class="mr-2"></v-img>
                        </template>
                        <template v-slot:title>
                          {{ menu.name }}
                        </template>

                      </v-list-item>
                    </template>

                    <v-list-item
                      v-for="(children, c) in menu.children"
                      :key="c"
                      class="sub-menu pointer"
                      :class="{
                        'menu-active': children.link == activeMenuGetters,
                        'menu-collapsed': rail,
                      }"
                      @click="navigate(children)"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          :icon="mdiCircleOutline"
                          size="15"></v-icon>
                      </template>
                      <template v-slot:title>
                        {{ children.name }}
                      </template>
                    </v-list-item>

                  </v-list-group>

                </v-list>

              </template> -->

            </template>

          </template>

        </v-list>
        <!-- <v-list
          density="compact"
          class="v-list-scroll no-scroll">

          <template
            v-for="(menus, menuKey) in layoutItems"
            :key="menuKey">

            <v-list-subheader v-if="!rail">{{ menuKey }}</v-list-subheader>

            <template
              v-for="(menu) in menus"
              :key="menu.id">

              <template v-if="!menu.children.length">
                <v-list-item
                  class="sub-menu pointer"
                  color="blue"
                  :class="{
                    'menu-active': menu.active_menu,
                    'menu-collapsed': rail,
                  }"
                  base-color="#000"
                  @click="navigate(menu)">
                  <template v-slot:prepend>
                    <v-img size="18"
                      :src="menu.icon"
                      width="15"
                      height="15"
                      class="mr-2"></v-img>
                  </template>
                  <template v-slot:title>
                    {{ menu.name }}
                  </template>
                </v-list-item>
              </template>

              <template v-else>

                <v-list>

                  <v-list-group
                    :value="menu.name"
                    color="blue"
                    :class="{
                      'menu-group-collapsed': rail
                    }">

                    <template v-slot:activator="{ props }">
                      <v-list-item
                        v-bind="props"
                        class="sub-menu pointer">

                        <template v-slot:prepend>
                          <v-img size="18"
                            :src="menu.icon"
                            width="15"
                            height="15"
                            class="mr-2"></v-img>
                        </template>
                        <template v-slot:title>
                          {{ menu.name }}
                        </template>

                      </v-list-item>
                    </template>

                    <v-list-item
                      v-for="(children, c) in menu.children"
                      :key="c"
                      class="sub-menu pointer"
                      :class="{
                        'menu-active': children.link == activeMenuGetters,
                        'menu-collapsed': rail,
                      }"
                      @click="navigate(children)"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          :icon="mdiCircleOutline"
                          size="15"></v-icon>
                      </template>
                      <template v-slot:title>
                        {{ children.name }}
                      </template>
                    </v-list-item>

                  </v-list-group>

                </v-list>

              </template>

            </template>

          </template>

        </v-list> -->
        <!-- END MENU ITEMS -->

        <!-- SHEETS -->
        <v-sheet
          v-if="!rail"
          position="absolute"
          location="bottom"
          class="bg-light-secondary v-sheet-main py-5 px-2"
          rounded
          width="80%"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-avatar image="/userprofile.jpg" size="40"></v-avatar>

              <div class="v-sheet-profile">
                <p class="name">{{ username ? username : email }}</p>
                <p class="position" v-if="position">{{ position }}</p>
              </div>
            </div>

            <v-icon
              :icon="mdiPower"
              class="pointer"
              @click="logout"
              size="25"
            ></v-icon>
          </div>
        </v-sheet>
        <!-- END SHEETS -->
      </v-navigation-drawer>
    </template>
    <template v-else>
      <v-navigation-drawer
        v-model="drawer"
        :temporary="true"
        class="main-sidebar position-fixed">
        <!-- logo -->
        <div
          class="logo-wrapper"
          :class="{
            'logo-collapsed': rail,
          }"
        >
          <img src="@/assets/dfactory.webp" class="logo" alt="" />
        </div>
        <!-- End Logo -->

        <!-- MENU ITEMS -->
        <v-list
          density="compact"
          class="v-list-scroll no-scroll">

          <template
            v-for="(menus, menuKey) in layoutItems"
            :key="menuKey">

            <v-list-subheader v-if="!rail">{{ menuKey }}</v-list-subheader>

            <template
              v-for="(menu) in menus"
              :key="menu.id">

              <template v-if="!menu.children.length">
                <v-list-item
                  class="sub-menu pointer"
                  color="blue"
                  :class="{
                    'menu-active': menu.active_menu,
                    'menu-collapsed': rail,
                  }"
                  base-color="#000"
                  @click="navigate(menu)">
                  <template v-slot:prepend>
                    <v-img size="18"
                      :src="menu.icon"
                      width="15"
                      height="15"
                      class="mr-2"></v-img>
                  </template>
                  <template v-slot:title>
                    {{ menu.name }}
                  </template>
                </v-list-item>
              </template>

              <template v-else>

                <v-list>

                  <v-list-group
                    :value="menu.name"
                    color="blue"
                    :class="{
                      'menu-group-collapsed': rail
                    }">

                    <template v-slot:activator="{ props }">
                      <v-list-item
                        v-bind="props"
                        class="sub-menu pointer">

                        <template v-slot:prepend>
                          <v-img size="18"
                            :src="menu.icon"
                            width="15"
                            height="15"
                            class="mr-2"></v-img>
                        </template>
                        <template v-slot:title>
                          {{ menu.name }}
                        </template>

                      </v-list-item>
                    </template>

                    <v-list-item
                      v-for="(children, c) in menu.children"
                      :key="c"
                      class="sub-menu pointer"
                      :class="{
                        'menu-active': children.link == activeMenuGetters,
                        'menu-collapsed': rail,
                      }"
                      @click="navigate(children)"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          :icon="mdiCircleOutline"
                          size="15"></v-icon>
                      </template>
                      <template v-slot:title>
                        {{ children.name }}
                      </template>
                    </v-list-item>

                  </v-list-group>

                </v-list>


              </template>

            </template>

          </template>

        </v-list>
        <!-- END MENU ITEMS -->
      </v-navigation-drawer>
    </template>

    <div class="header-wrapper">
      <v-app-bar :elevation="2" class="position-fixed bg-background main-app-bar"
        :class="{
          'on-rail': rail
        }">
        <template v-slot:prepend>
          <v-icon
            size="18"
            :icon="mdiMenu"
            class="pointer"
            @click.stop="drawer = !drawer"
            v-if="mobile"
          ></v-icon>
          <v-icon
            size="18"
            :icon="mdiMenu"
            class="pointer"
            @click.stop="rail = !rail"
            v-if="!mobile"
          ></v-icon>
        </template>

        <v-app-bar-title>
          {{ globalAppName }}
        </v-app-bar-title>

        <v-menu open-on-click>
          <template v-slot:activator="{props}">
            <v-avatar class="me-5">
              <v-img
                v-if="currentLang == 'en'"
                v-bind="props"
                src="/lang/britain.png"
                width="40"
                height="40"></v-img>
              <v-img
                v-if="currentLang == 'id'"
                v-bind="props"
                src="/lang/indo.png"
                width="40"
                height="40"></v-img>
            </v-avatar>
          </template>

          <v-list>
            <v-list-item class="d-flex align-center justify-center"
              @click.prevent="changeLocal('id')">
              <v-avatar class="me-5">
                <v-img
                  src="/lang/indo.png"
                  width="40"
                  height="40"></v-img>
              </v-avatar>
            </v-list-item>
            <v-list-item class="d-flex align-center justify-center"
              @click.prevent="changeLocal('en')">
              <v-avatar class="me-5">
                <v-img
                  src="/lang/britain.png"
                  width="40"
                  height="40"></v-img>
              </v-avatar>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu open-on-click
          :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              :icon="listOfNotification.length ? mdiBellBadgeOutline : mdiBellOutline"
              color="blue"
              class="header-bell"
            ></v-icon>
          </template>

          <BellNotification />
        </v-menu>

        <v-menu open-on-click>
          <template v-slot:activator="{ props }">
            <v-avatar
              class="header-account"
              size="46"
              image="/userprofile.jpg"
              v-bind="props"
            >
            </v-avatar>
          </template>

          <v-list>
            <v-list-item>
              <template v-slot:title>
                <div class="box-profile-floating">
                  <div class="profile-preview">
                    <p class="title">User Profile</p>
                    <div class="d-flex align-center" style="gap: 10px">
                      <v-avatar image="/userprofile.jpg" size="90"></v-avatar>

                      <div class="profile-detail">
                        <p class="name" v-if="username">{{ username }}</p>
                        <p class="position" v-if="position">{{ position }}</p>
                        <p class="email">{{ email }}</p>
                      </div>
                    </div>
                  </div>

                  <v-divider style="margin: 10px 0"></v-divider>
                </div>
              </template>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <div class="icon-profile">
                  <v-icon :icon="mdiAccount"></v-icon>
                </div>
              </template>

              <template v-slot:title>
                <div class="dropdown-profile-wrapper">
                  <p class="title no-decoration">Profile</p>
                  <p class="subtitle no-decoration">Account Setting</p>
                </div>
              </template>
            </v-list-item>

            <v-list-item
              @click.prevent="resetPasswordForm">
              <template v-slot:prepend>
                <div class="icon-profile">
                  <v-icon :icon="mdiKeyOutline"></v-icon>
                </div>
              </template>

              <template v-slot:title>
                <div class="dropdown-profile-wrapper">
                  <p class="title no-decoration">Reset Password</p>
                  <p class="subtitle no-decoration">Reset your app password</p>
                </div>
              </template>
            </v-list-item>

            <router-link to="/admin/production/tasks">
              <v-list-item>
                <template v-slot:prepend>
                  <div class="icon-profile">
                    <v-icon :icon="mdiTable"></v-icon>
                  </div>
                </template>

                <template v-slot:title>
                  <div class="dropdown-profile-wrapper no-decoration">
                    <p class="title no-decoration">My task</p>
                    <p class="subtitle no-decoration">To do and Daily task</p>
                  </div>
                </template>
              </v-list-item>
            </router-link>

            <v-list-item>
              <template v-slot:title>
                <v-btn
                  variant="outlined"
                  color="primary"
                  width="100%"
                  size="small"
                  type="button"
                  @click.prevent="logout"
                >
                  Logout
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>

    <ResetPassword :is-show="showResetPasswordForm"
      @close-event="closeFormResetPassword"></ResetPassword>

    <v-main style="min-height: 300px; background-color: transparent;">
      <div class="main-content-drawer"
        :class="{
          'maxWidth': !rail
        }">
        <RouterView />
        <AppFooter></AppFooter>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import AppFooter from "@/components/AppFooter.vue";
import BellNotification from './BellNotification.vue'
import { mdiBellOutline, mdiCircleOutline, mdiMenu, mdiPower, mdiKeyOutline } from "@mdi/js";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { ref, onMounted, watch } from "vue";
import { useMenusStore } from "@/stores/menus";
import { useAuthenticationStore } from "@/stores/authentication";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { mdiBellBadgeOutline, mdiAccount, mdiTable } from "@mdi/js";
import { useEncrypt } from '@/compose/encrypt';
import { useBreakToken } from '@/compose/breakToken';
import { useSettingStore } from "@/stores/setting";
import pusher from "@/plugins/pusher";
import { useNotificationStore } from "@/stores/notification";
import { useI18n } from "vue-i18n";
import ResetPassword from '@/components/ResetPassword.vue'

const i18n = useI18n()

const storeSetting = useSettingStore();

const storeNotification = useNotificationStore()

const { listOfNotification } = storeToRefs(storeNotification)

const { globalAppName } = storeToRefs(storeSetting);

var encodedText = localStorage.getItem('dfauth');
const saltKey = import.meta.env.VITE_SALT_KEY;
const permissions = ref([]);

if (encodedText) {
  var { decodedString } = useEncrypt(encodedText, saltKey);

  permissions.value = decodedString.permissions;
}

const router = useRouter();

const route = useRoute();

const rail = ref(false);

const showResetPasswordForm = ref(false)

const drawer = ref(null);

const { mobile } = useDisplay();

const store = useMenusStore();

const authStore = useAuthenticationStore();

const menusData = ref([]);

const openMenu = ref([])

const { activeMenuGetters, pathNameGetters } = storeToRefs(store);

const open = ref([]);

const username = ref(null);

const email = ref(null);

const position = ref(null);

const currentLang = ref('en')

const layoutItems = ref(useBreakToken('menus'));

const accountLists = ref([
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me 2" },
]);

function retrieveNotification() {
  var userId = useBreakToken("user");
  var channel = pusher.subscribe("my-channel-" + userId.id);

  channel.bind("notification-event", (notif) => {
    console.log("notif", notif);

    storeNotification.setNotif(notif)
  });
}

function initNotification() {
  storeNotification.setNotif(useBreakToken('notifications'))
}

function changeLocal(lang) {
  i18n.locale.value = lang

  localStorage.setItem('lang', lang)

  location.reload()
}

onMounted(() => {
  openMenu.value = []

  if (localStorage.getItem('lang')) {
    i18n.locale.value = localStorage.getItem('lang')
    currentLang.value = localStorage.getItem('lang')
  }

  var newLayout = useBreakToken('menus')
  for (let a in newLayout) {
    if (newLayout[a].length) {
      newLayout[a].map((elem) => {
        elem.active_menu = false

        if (currentLang.value == 'en') {
          elem.name = elem.lang_en
        } else if (currentLang.value == 'id') {
          elem.name = elem.lang_id
        }

        // set active menu
        if (route.meta.parentLink) {
          if (route.meta.parentLink == elem.link) {
            elem.active_menu = true
          }
        }

        if (elem.children.length) {
          elem.children.map((elemChild) => {
            if (currentLang.value == 'en') {
              elemChild.name = elemChild.lang_en
            } else if (currentLang.value == 'id') {
              elemChild.name = elemChild.lang_id
            }
          })
        }

        return elem;
      });

      // remove dashboard menu that intended for the new layout
      newLayout[a] = newLayout[a].filter((filter) => {
        return filter.new_icon != 'pi pi-chart-scatter';
      });
    }
  }

  layoutItems.value = newLayout

  initNotification()

  retrieveNotification()

  var check = store.getMenus();

  var elems = [];
  for (let a = 0; a < check.length; a++) {
    elems.push({
      title: check[a].title,
      is_subheader: check[a].is_subheader,
      menus: [],
    })
    // for (let b = 0; check[a].menus.length; b++) {

    // }
  }

  if (pathNameGetters.value) {
    open.value = [pathNameGetters.value];
  }
  store.navigateMenu(route.fullPath);

  // set app name
  storeSetting.setAppName();
  storeSetting.setBoardCalculated();

  // set user name on header and sidebar
  var user = useBreakToken('user');

  if (
    (user) && (user.employee)
  ) {
    username.value = user.employee.name;
    email.value = user.email_show;
    position.value = user.employee.position.name;
  } else if (
    (user) && (!user.employee)
  ) {
    username.value = null;
    email.value = user.email_show;
    position.value = null;
  }
});

function navigate(path) {
  store.navigateMenu(path.link);
  router.push(path.link);

  openMenu.value = [path.name]
}

async function logout() {
  await authStore.logout();
  router.push({ path: "/auth/a/login" });
}

function resetPasswordForm() {
  showResetPasswordForm.value = true
}

function closeFormResetPassword() {
  showResetPasswordForm.value = false
}

watch(route, (values) => {
  openMenu.value = []

  var newLayout = useBreakToken('menus')
  for (let a in newLayout) {
    if (newLayout[a].length) {
      newLayout[a].map((elem) => {
        elem.active_menu = false

        if (currentLang.value == 'en') {
          elem.name = elem.lang_en
        } else if (currentLang.value == 'id') {
          elem.name = elem.lang_id
        }

        // set active menu
        if (values.meta.parentLink) {
          if (values.meta.parentLink == elem.link) {
            elem.active_menu = true
          }
        }

        if (elem.children.length) {
          elem.children.map((elemChild) => {
            if (currentLang.value == 'en') {
              elemChild.name = elemChild.lang_en
            } else if (currentLang.value == 'id') {
              elemChild.name = elemChild.lang_id
            }
            return elemChild
          })
        }

        return elem
      })
    }
  }

  layoutItems.value = newLayout
})
</script>

<style scoped lang="scss">
@import "../styles/settings.scss";

.v-sheet-main {
  bottom: 30px !important;
}
.v-sheet-profile {
  .name {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 5px;
    line-height: 1;
  }

  .position {
    font-weight: normal;
    font-size: 10px;
    text-wrap: wrap;
  }
}
.v-list-scroll {
  max-height: calc(100% - 200px) !important;
  overflow: scroll !important;
}
@media screen and (max-width: 576px) {
  .v-list-scroll {
    max-height: calc(100% - 20px) !important;
    padding-bottom: 50px;
    overflow: scroll !important;
  }
}
.icon-profile {
  background: rgb(236, 242, 255);
  padding: 10px;
  color: #000;
  border-radius: 8px;
}

.dropdown-profile-wrapper {
  margin-left: 15px;
  cursor: pointer;

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .subtitle {
    font-size: 12px;
    font-weight: normal;
  }
}
.box-profile-floating {
  padding: 10px 14px;
  .profile-preview {
    .title {
      font-size: 16px;
      font-weight: normal;
      margin-bottom: 18px;
    }

    .profile-detail {
      .name {
        font-weight: bold;
        font-size: 18px;
      }

      .position {
        font-size: 12px;
        font-weight: 200;
        margin: 0;
      }

      .email {
        font-size: 14px;
        font-weight: normal;
        line-height: 1;
      }
    }
  }
}

.main-sidebar {
  color: $text-secondary;
  box-shadow: 0 2px 8px rgba(47, 43, 61, 0.12), 0 0 transparent, 0 0 transparent;
  border: none;
}
header {
  box-shadow: none !important;
}
.header-account {
  margin-right: 12px;
}
.header-bell {
  margin-right: 20px;
  cursor: pointer;
}
.pointer {
  cursor: pointer;
}
.v-list-group__items .v-list-item.sub-menu {
  padding-inline-start: 20px !important;
}
.logo-wrapper {
  padding: 8px 16px;
}
.logo {
  width: 40px;
  height: auto;
}
.v-navigation-drawer .v-list {
  padding: 0 8px;
}
.v-list-item {
  margin-bottom: 8px;
}
.v-list-item:not(.menu-active):hover {
  background: $base-primary-color-hover !important;
  border-radius: 8px !important;
}
.menu-collapsed,
.v-list-group__item .menu-collapsed {
  padding-left: 13px !important;
}
.logo-collapsed {
  padding-left: 10px;
}
.menu-group-collapsed .v-list-item {
  padding-left: 13px;
  padding-inline: 13px !important;
}

@media screen and (max-width: 800px) {
  .logo-wrapper {
    padding: 8px;
  }
}
</style>

<style lang="scss">
@import "../styles/settings.scss";

.sub-menu .v-list-item__prepend {
  display: block !important;
}
.menu-active {
  background-color: $base-light-primary !important;
  background: linear-gradient(270deg, rgba(115,103,240, .7), rgb(115,103,240)) !important;
  border-radius: 8px !important;

  .v-list-item-title {
    color: #fff !important;
  }
}
.v-list-item-title {
  font-weight: 300 !important;
  font-size: 0.875rem !important;
  color: rgb(47,43,61);
}
</style>
