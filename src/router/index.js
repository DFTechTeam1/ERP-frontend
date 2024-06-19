/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import DashboardView from "@/pages/admin/dashboard/DashboardView.vue";
import HomepageView from "@/pages/HomepageView.vue";
import Layout from "@/layouts/LayoutDefault.vue";
import LayoutAuth from "@/layouts/LayoutAuth.vue";
import LayoutPanel from '@/layouts/LayoutPanel.vue';
import LoginVue from "@/pages/admin/authentication/LoginVue.vue";
import ForgotPassword from "@/pages/admin/authentication/ForgotPassword.vue";
import UsersView from "@/pages/admin/hrd/user_management/users/UsersView.vue";
import RolesView from "@/pages/admin/hrd/user_management/roles/RolesView.vue";
import RoleForm from "@/pages/admin/hrd/user_management/roles/CreateRole.vue";
import DivisionView from "@/pages/admin/master/divisions/ListView.vue";
import PositionView from "@/pages/admin/master/positions/ListView.vue";
import SupplierView from "@/pages/admin/inventory/supplier/ListView.vue";
import BrandView from "@/pages/admin/inventory/brand/ListView.vue";
import UnitView from "@/pages/admin/inventory/unit/ListView.vue";
import InventoryTypeView from '@/pages/admin/inventory/inventoryType/ListView.vue';
import InventoriesView from '@/pages/admin/inventory/list/ListView.vue';
import RequestEquipmentView from '@/pages/admin/inventory/requestEquipment/RequestList.vue';
import DetailRequestEquipment from '@/pages/admin/inventory/requestEquipment/DetailRequestEquipment.vue';
import InventoryForm from '@/pages/admin/inventory/list/FormView.vue';
import InventoryDetail from '@/pages/admin/inventory/list/DetailView.vue';
import EmployeeView from '@/pages/admin/hrd/employee/ListView.vue';
import DetailEmployee from '@/pages/admin/hrd/employee/DetailEmployee.vue';
import EmployeeForm from '@/pages/admin/hrd/employee/FormView.vue';
import AddonsList from '@/pages/admin/addons/AddonsList.vue';
import SettingView from '@/pages/admin/setting/SettingView.vue';
import ProjectList from '@/pages/admin/production/ProjectList.vue';
import AddonList from '@/pages/panel/AddonList.vue';
import AddonForm from '@/pages/panel/AddonForm.vue';
import PanelSetting from '@/pages/panel/SettingView.vue';
import DetailProject from "@/pages/admin/production/DetailProject.vue";
import ProjectForm from "@/pages/admin/production/FormView.vue";
import ActivateAccount from "@/pages/admin/authentication/ActivateAccount.vue";
import RedirectingView from '@/pages/admin/RedirectingView.vue';
import LayoutEmpty from "@/layouts/LayoutEmpty.vue";
import { createRouter, createWebHistory } from "vue-router/auto";
import moment from "moment";
import { useEncrypt } from "@/compose/encrypt";
import LayoutDefault from "@/layouts/LayoutDefault.vue";
import i18n from '@/lang';

const { t } = i18n.global;

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/activate',
      name: "Activate Component",
      component: LayoutEmpty,
      children: [
        {
          path: ":encrypted",
          name: "Activate Account",
          component: ActivateAccount,
        },
      ]
    },
    {
      path: '/redirect',
      name: "Redirecting Account",
      component: LayoutEmpty,
      children: [
        {
          path: ":logout",
          name: "Redirect Logout",
          component: RedirectingView,
        },
      ]
    },
    {
      path: "/auth/a",
      name: "LayoutLogin",
      component: LayoutAuth,
      children: [
        {
          path: "login",
          name: "Login",
          component: LoginVue,
        },
        {
          path: "forgot-password",
          name: "ForgotPassword",
          component: ForgotPassword,
        },
      ],
    },
    // Ko edwin
    {
      path: "/auth/p",
      name: "LayoutLoginPanel",
      component: LayoutAuth,
      children: [
        {
          path: "login",
          name: "Login Addon",
          component: LoginVue,
        },
      ],
    },
    {
      path: "/addons",
      name: "Addons Page",
      component: AddonsList,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/panel",
      name: "Layout addons",
      component: LayoutDefault,
      children: [
        {
          path: "setting",
          name: "Panel Setting",
          component: PanelSetting,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "addons",
          name: "Addons List",
          component: AddonList,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "addons/create",
          name: "Addons Form",
          component: AddonForm,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "addons/edit/:id",
          name: "Addons Form Edit",
          component: AddonForm,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    // End ko edwin
    {
      path: "/admin",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "/admin/homepage",
          name: "Homepage",
          component: HomepageView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/admin/employees',
          name: 'Employees',
          children: [
            {
              path: 'list',
              component: EmployeeView,
              name: t('employees'),
              meta: {
                requiresAuth: true,
              }
            },
            {
              path: ':id',
              component: DetailEmployee,
              name: t('detailEmployee'),
              meta: {
                meta: { requiresAuth: true, permission: 'detail_employee' },
              }
            },
            {
              path: 'create',
              component: EmployeeForm,
              name: t('createEmployee'),
              meta: {
                requiresAuth: true,
              }
            },
            {
              path: 'edit/:id',
              component: EmployeeForm,
              name: t('editEmployee'),
              meta: {
                requiresAuth: true,
              }
            },
          ],
        },
        {
          path: "/admin/dashboard",
          name: "Dashboard",
          component: DashboardView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/admin/production/projects",
          name: t('projectList'),
          component: ProjectList,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/admin/setting",
          name: t('setting'),
          component: SettingView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/admin/master",
          name: "Master",
          children: [
            {
              path: "divisions",
              name: t('divisions'),
              component: DivisionView,
              meta: { parentData: "Master", requiresAuth: true, permission: 'list_division' },
            },
            {
              path: "positions",
              name: t('positions'),
              component: PositionView,
              meta: { parentData: "Master", requiresAuth: true, permission: 'list_position' },
            },
          ],
        },
        {
          path: "/admin/production",
          name: "Production",
          children: [
            {
              path: 'project/:id',
              name: t('detailProject'),
              component: DetailProject,
              meta: {
                parentData: "Production",
                requiresAuth: true,
              },
            },
            {
              path: 'project/create',
              name: t('createProject'),
              component: ProjectForm,
              meta: {
                parentData: "Production",
                requiresAuth: true,
              },
            },
          ],
        },
        {
          path: "/admin/user-management",
          name: "User Management",
          children: [
            {
              path: "users",
              name: t('users'),
              component: UsersView,
              meta: {
                parentData: "User Management",
                requiresAuth: true,
              },
            },
            {
              path: "roles",
              name: t('role'),
              component: RolesView,
              meta: {
                parentData: "User Management",
                requiresAuth: true,
              },
            },
            {
              path: "roles/create",
              name: t('createRole'),
              component: RoleForm,
              meta: {
                parentData: "User Management",
                requiresAuth: true,
              },
            },
            {
              path: "roles/edit/:id",
              name: t('editRole'),
              component: RoleForm,
              meta: {
                parentData: "User Management",
                requiresAuth: true,
              },
            },
          ],
        },
        {
          path: "/admin/inventories",
          name: "Inventories",
          children: [
            {
              path: "suppliers",
              name: t('supplier'),
              component: SupplierView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "request-equipment",
              name: t('requestEquipment'),
              component: RequestEquipmentView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "request-equipment/:projectId",
              name: t('detailRequestEquipment'),
              component: DetailRequestEquipment,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "brands",
              name: t('brands'),
              component: BrandView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "units",
              name: t('units'),
              component: UnitView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "inventory-types",
              name: t('inventoryTypes'),
              component: InventoryTypeView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "list",
              name: t('inventoryList'),
              component: InventoriesView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "create",
              name: t('createInventory'),
              component: InventoryForm,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: "edit/:uid",
              name: t('editInventory'),
              component: InventoryForm,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
            {
              path: ":uid",
              name: t('detailInventory'),
              component: InventoryDetail,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
              },
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach((to, from) => {
  // TODO: DELETED SOON
  if (to.path == '/') {
    return {
      path: '/auth/a/login'
    }
  }

  // validate token
  const saltKey = import.meta.env.VITE_SALT_KEY;
  var encodedText = localStorage.getItem("dfauth");

  if (encodedText != null) {
    const { decodedString } = useEncrypt(encodedText, saltKey);

    var exp = decodedString.exp;

    var startTime = moment(exp);
    var end = moment(new Date());
    var duration = moment.duration(startTime.diff(end));
    var hours = duration.asHours();

    if (hours < 0) {
      localStorage.removeItem("dfauth");
      return {
        path: "/auth/a/login",
      };
    }
  }

  // if query param have redirect items, redirect it
  // if (from.query && localStorage.getItem("dfauth")) {
  //   if (from.query.redirect) {
  //     console.log('path', from.query.redirect);
  //     return {
  //       path: '/admin/production/projects'
  //     }
  //   }
  // }

  if (to.name) {
    window.document.title = to.name;
  }

  if (to.path == "/auth/a/login" && localStorage.getItem("dfauth")) {
    return {
      path: "/admin/dashboard",
    };
  }

  /**
   * if user go to redirect page '/redirect/*'
   * and from.name property is undefined, then throw to dashboard page
   */
  if (!from.name && to.path == '/redirect/logout') {
    return {path: '/admin/dashboard'};
  }

  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !localStorage.getItem("dfauth")) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: "/auth/a/login",
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
