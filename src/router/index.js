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
import DashboardFile from '@/pages/admin/fileManager/DashboardFile.vue'
import FolderDetail from '@/pages/admin/fileManager/FolderDetail.vue'
import ProjectFolder from '@/pages/admin/fileManager/ProjectFolder.vue'
import ProjectFolderTask from '@/pages/admin/fileManager/ProjectFolderTask.vue'
import ProjectFolderImages from '@/pages/admin/fileManager/ProjectFolderImages.vue'
import ProjectFolderUsers from '@/pages/admin/fileManager/ProjectFolderUsers.vue'
import LayoutPanel from '@/layouts/LayoutPanel.vue';
import LoginVue from "@/pages/admin/authentication/LoginVue.vue";
import ForgotPassword from "@/pages/admin/authentication/ForgotPassword.vue";
import ResetPassword from "@/pages/admin/authentication/ResetPassword.vue";
import UsersView from "@/pages/admin/hrd/user_management/users/UsersView.vue";
import RolesView from "@/pages/admin/hrd/user_management/roles/RolesView.vue";
import RoleForm from "@/pages/admin/hrd/user_management/roles/CreateRole.vue";
import DivisionView from "@/pages/admin/master/divisions/ListView.vue";
import ProjectClass from '@/pages/admin/master/projectClass/ListView.vue'
import PositionView from "@/pages/admin/master/positions/ListView.vue";
import SupplierView from "@/pages/admin/inventory/supplier/ListView.vue";
import BrandView from "@/pages/admin/inventory/brand/ListView.vue";
import UnitView from "@/pages/admin/inventory/unit/ListView.vue";
import InventoryTypeView from '@/pages/admin/inventory/inventoryType/ListView.vue';
import InventoriesView from '@/pages/admin/inventory/list/ListView.vue';
import CustomInventories from '@/pages/admin/inventory/custom/CustomInventory.vue';
import DetailCustomInventory from '@/pages/admin/inventory/custom/DetailCustomInventory.vue'
import BuildInventory from '@/pages/admin/inventory/custom/BuildInventory.vue';
import RequestEquipmentView from '@/pages/admin/inventory/requestEquipment/RequestList.vue';
import DetailRequestEquipment from '@/pages/admin/inventory/requestEquipment/DetailRequestEquipment.vue';
import InventoryScanner from '@/pages/admin/inventory/requestEquipment/ScannerView.vue'
import InventoryForm from '@/pages/admin/inventory/list/FormView.vue';
import InventoryDetail from '@/pages/admin/inventory/list/DetailView.vue';
import EmployeeView from '@/pages/admin/hrd/employee/ListView.vue';
import PerformanceReport from "@/pages/admin/hrd/performanceReport/PerformanceReport.vue";
import DetailEmployee from '@/pages/admin/hrd/employee/DetailEmployee.vue';
import DetailEmployeeGeneralView from '@/pages/admin/hrd/employee/detail/general/GeneralView.vue';
import DetailEmployeeEmployment from '@/pages/admin/hrd/employee/detail/general/employment/EmploymentView.vue'
import DetailEmployeeAccountInformation from '@/pages/admin/hrd/employee/detail/general/account/AccountInformation.vue'
import DetailEmployeeEducation from '@/pages/admin/hrd/employee/detail/general/education/EducationView.vue'
import EmployeeForm from '@/pages/admin/hrd/employee/FormView.vue';
import AddonsList from '@/pages/admin/addons/AddonsList.vue';
import SettingView from '@/pages/admin/setting/SettingView.vue';
import GeneralSetting from '@/pages/admin/setting/types/GeneralView.vue';
import ProjectList from '@/pages/admin/production/ProjectList.vue';
import AddonList from '@/pages/panel/AddonList.vue';
import AddonForm from '@/pages/panel/AddonForm.vue';
import PanelSetting from '@/pages/panel/SettingView.vue';
import DetailProject from "@/pages/admin/production/DetailProject.vue";
import TaskList from "@/pages/admin/production/TaskList.vue";
import TeamTransfer from '@/pages/admin/production/TeamTransfer.vue'
import ProjectForm from "@/pages/admin/production/FormView.vue";
import ActivateAccount from "@/pages/admin/authentication/ActivateAccount.vue";
import RedirectingView from '@/pages/admin/RedirectingView.vue';
import LayoutEmpty from "@/layouts/LayoutEmpty.vue";
import NotAllowed from "@/components/NotAllowed.vue";
import UnderDevelopment from "@/components/UnderDevelopment.vue";
import CreateDeals from "@/pages/admin/production/deals/CreateDeals.vue";
import ListOfDeals from "@/pages/admin/production/deals/ListOfDeals.vue";
import DetailDeals from "@/pages/admin/production/deals/DetailDeals.vue";
import ListQuotationItem from "@/pages/admin/production/quotationItems/ListQuotationItem.vue";
import { createRouter, createWebHistory } from "vue-router/auto";
import moment from "moment";
import { useEncrypt } from "@/compose/encrypt";
import LayoutDefault from "@/layouts/LayoutDefault.vue";
import { i18n } from '@/lang';
import { useBreakToken } from "@/compose/breakToken";
import { useCheckPermission } from "@/compose/checkPermission";
import {useProjectStore} from "@/stores/project";
import DeadlineChangeReason from "@/pages/admin/production/deadlineChangeReason/DeadlineChangeReason.vue";

const { t } = i18n.global;

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/not-allowed',
      name: 'Not Allowed',
      component: NotAllowed,
    },
    {
      path: '/underdevelopment',
      name: 'Under Development',
      component: UnderDevelopment,
    },
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
        {
          path: "reset-password",
          name: "Reset Password",
          component: ResetPassword,
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
          path: 'quotation-items',
          name: "List Quotation Item",
          component: ListQuotationItem,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/quotation-items'
          }
        },
        {
          path: 'deadline-change-reason',
          name: "List Deadline Change Reason",
          component: DeadlineChangeReason,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/deadline-change-reason'
          }
        },
        {
          path: '/admin/deals/create',
          name: "Create Deals",
          component: CreateDeals,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/deals'
          }
        },
        {
          path: '/admin/deals',
          name: "List of Deals",
          component: ListOfDeals,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/deals'
          }
        },
        {
          path: '/admin/deals/:id/edit',
          name: "Edit Deal",
          component: CreateDeals,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/deals'
          }
        },
        {
          path: '/admin/deals/:id/edit/:type',
          name: "Add More Quotation",
          component: CreateDeals,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/deals'
          }
        },
        {
          path: '/admin/deals/:id',
          name: "Detail Deals",
          component: DetailDeals,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/deals'
          }
        },
        {
          path: '/admin/employees',
          name: 'Employees Master',
          children: [
            {
              path: 'list',
              component: EmployeeView,
              name: t('employees'),
              meta: {
                requiresAuth: true,
                parentLink: '/admin/employees/list',
                permissions: [
                  "list_employee"
                ],
              }
            },
            {
              path: 'performanceReport',
              component: PerformanceReport,
              name: t('performanceReport'),
              meta: {
                requiresAuth: true,
                parentLink: '/admin/employees/performanceReport',
                permissions: [
                  "list_performance_report"
                ],
              }
            },
            {
              path: ':id',
              component: DetailEmployee,
              name: t('detailEmployee'),
              meta: {
                meta: {
                  requiresAuth: true,
                  permission: 'detail_employee',
                  parentLink: '/admin/employees/list',
                  permissions: [
                    "detail_employee"
                  ],
                },
              },
              children: [
                {
                  path: 'general',
                  component: DetailEmployeeGeneralView,
                  name: 'Detail Employee General View',
                  meta: {
                    authView: ['hrd', 'director', 'root'],
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'employment',
                  component: DetailEmployeeEmployment,
                  name: 'Employment',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'account',
                  component: DetailEmployeeAccountInformation,
                  name: 'Account Information',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'education',
                  component: UnderDevelopment,
                  name: 'Education',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'attendance',
                  component: UnderDevelopment,
                  name: 'Detail Employee Attendance',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'timeoff',
                  component: UnderDevelopment,
                  name: 'Detail Employee timeoff',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'overtime',
                  component: UnderDevelopment,
                  name: 'Detail Employee Overtime',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'payrollinfo',
                  component: UnderDevelopment,
                  name: 'Detail Employee Payroll Info',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'reimbursement',
                  component: UnderDevelopment,
                  name: 'Detail Employee Reimbursement',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'asset',
                  component: UnderDevelopment,
                  name: 'Detail Employee Asset',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
                {
                  path: 'projects',
                  component: UnderDevelopment,
                  name: 'Detail Employee Projects',
                  meta: {
                    permissions: [
                      "detail_employee"
                    ],
                    parentLink: '/admin/employees/list'
                  }
                },
              ]
            },
            {
              path: 'create',
              component: EmployeeForm,
              name: t('createEmployee'),
              meta: {
                requiresAuth: true,
                parentLink: '/admin/employees/list',
                permissions: [
                  "create_employee"
                ],
              }
            },
            {
              path: 'edit/:id',
              component: EmployeeForm,
              name: t('editEmployee'),
              meta: {
                requiresAuth: true,
                parentLink: '/admin/employees/list',
                permissions: [
                  "edit_employee"
                ],
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
            parentLink: '/admin/dashboard',
            permissions: [
              "dashboard_access"
            ],
          },
        },
        {
          path: "/admin/production/files",
          name: t('folders'),
          component: DashboardFile,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/production/files',
            permissions: [
              "list_file_manager"
            ],
          },
          children: [
            {
              path: ':year',
              name: 'Folder Detail',
              component: FolderDetail,
            },
            {
              path: ':year/:project',
              name: 'Folder Detail - Deeper',
              component: ProjectFolder,
              children: [
                {
                  path: 'task',
                  name: 'Folder Detail - Task',
                  component: ProjectFolderTask,
                },
                {
                  path: 'images',
                  name: 'Folder Detail - Images',
                  component: ProjectFolderImages,
                },
                {
                  path: 'user',
                  name: 'Folder Detail - Users',
                  component: ProjectFolderUsers,
                },
                {
                  path: 'images/:task',
                  name: 'Folder Detail - Images Task',
                  component: ProjectFolderImages,
                },
                {
                  path: 'images/user/:user',
                  name: 'Folder Detail - Images Users',
                  component: ProjectFolderImages,
                },
              ],
            },
          ],
        },
        {
          path: "/admin/production/projects",
          name: t('projectList'),
          component: ProjectList,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/production/projects',
            permissions: [
              "list_project"
            ],
          },
        },
        {
          path: "/admin/setting",
          name: t('setting'),
          component: SettingView,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/setting',
            permissions: [
              "list_setting"
            ],
          },
        },
        {
          path: "/admin/setting/company",
          name: t('generalSetting'),
          component: GeneralSetting,
          meta: {
            requiresAuth: true,
            parentLink: '/admin/setting',
            permissions: [
              "list_setting"
            ],
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
              meta: {
                parentData: "Master",
                requiresAuth: true,
                permission: 'list_division',
                permissions: [
                  "list_division"
                ],
              },
            },
            {
              path: "projectClass",
              name: t('projectClass'),
              component: ProjectClass,
              meta: {
                parentData: "Master",
                requiresAuth: true,
                permission: 'list_division',
                permissions: [
                  "list_division"
                ],
              },
            },
            {
              path: "positions",
              name: t('positions'),
              component: PositionView,
              meta: {
                parentData: "Master",
                requiresAuth: true,
                permission: 'list_position',
                permissions: [
                  "list_position"
                ],
              },
            },
          ],
        },
        {
          path: "/admin/production",
          name: "Production",
          children: [
            {
              path: 'tasks',
              name: t('tasks'),
              component: TaskList,
              meta: {
                parentData: "Production",
                requiresAuth: true,
                parentLink: '/admin/production/tasks',
                permissions: [
                  "list_task"
                ],
              },
            },
            {
              path: 'team-transfer',
              name: t('teamTransfer'),
              component: TeamTransfer,
              meta: {
                parentData: "Production",
                requiresAuth: true,
                parentLink: '/admin/production/team-transfer',
                permissions: [
                  "list_team_transfer",
                ],
              },
            },
            {
              path: 'project/:id',
              name: t('detailProject'),
              component: DetailProject,
              meta: {
                isDetailProject: true,
                parentData: "Production",
                requiresAuth: true,
                parentLink: '/admin/production/projects',
                permissions: [
                  "detail_project"
                ],
              },
            },
            {
              path: 'project/create',
              name: t('createProject'),
              component: ProjectForm,
              meta: {
                parentData: "Production",
                requiresAuth: true,
                parentLink: '/admin/production/projects',
                permissions: [
                  "create_project"
                ],
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
                parentLink: '/admin/user-management/users',
                permissions: [
                  "list_user"
                ],
              },
            },
            {
              path: "roles",
              name: t('role'),
              component: RolesView,
              meta: {
                parentData: "User Management",
                requiresAuth: true,
                parentLink: '/admin/user-management/roles',
                permissions: [
                  "list_role"
                ],
              },
            },
            {
              path: "roles/create",
              name: t('createRole'),
              component: RoleForm,
              meta: {
                parentData: "User Management",
                requiresAuth: true,
                parentLink: '/admin/user-management/roles',
                permissions: [
                  "create_role"
                ],
              },
            },
            {
              path: "roles/edit/:id",
              name: t('editRole'),
              component: RoleForm,
              meta: {
                parentData: "User Management",
                requiresAuth: true,
                parentLink: '/admin/user-management/roles',
                permissions: [
                  "edit_role"
                ],
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
                parentLink: '/admin/inventories/suppliers',
                permissions: [
                  "list_supplier"
                ],
              },
            },
            {
              path: "request-equipment",
              name: t('requestEquipment'),
              component: RequestEquipmentView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/request-equipment',
                permissions: [
                  "list_request_equipment"
                ],
              },
            },
            {
              path: "request-equipment/:projectId",
              name: t('detailRequestEquipment'),
              component: DetailRequestEquipment,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/request-equipment',
                permissions: [
                  "detail_request_equipment"
                ],
              },
            },
            {
              path: "request-equipment/:projectId/scan",
              name: t('scanInventory'),
              component: InventoryScanner,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/request-equipment',
                permissions: [
                  "detail_request_equipment"
                ],
              },
            },
            {
              path: "brands",
              name: t('brands'),
              component: BrandView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/brands',
                permissions: [
                  "list_brand"
                ],
              },
            },
            {
              path: "units",
              name: t('units'),
              component: UnitView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/units',
                permissions: [
                  "list_unit"
                ],
              },
            },
            {
              path: "inventory-types",
              name: t('inventoryTypes'),
              component: InventoryTypeView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/inventory-types',
                permissions: [
                  "list_inventory_type"
                ],
              },
            },
            {
              path: "list",
              name: t('inventoryList'),
              component: InventoriesView,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/list',
                permissions: [
                  "list_inventory"
                ],
              },
            },
            {
              path: "custom",
              name: t('customInventories'),
              component: CustomInventories,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/custom',
                permissions: [
                  "list_custom_inventory"
                ],
              },
            },
            {
              path: "custom/:uid",
              name: t('detailCustomInventory'),
              component: DetailCustomInventory,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/custom',
                permissions: [
                  "list_custom_inventory"
                ],
              },
            },
            {
              path: "custom/edit/:uid",
              name: t('editBuildItem'),
              component: BuildInventory,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/custom',
                permissions: [
                  "edit_custom_inventory"
                ],
              },
            },
            {
              path: "custom/create",
              name: t('buildCustomInventory'),
              component: BuildInventory,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/custom',
                permissions: [
                  "create_custom_inventory"
                ],
              },
            },
            {
              path: "create",
              name: t('createInventory'),
              component: InventoryForm,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/list',
                permissions: [
                  "create_inventory"
                ],
              },
            },
            {
              path: "edit/:uid",
              name: t('editInventory'),
              component: InventoryForm,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/list',
                permissions: [
                  "edit_inventory"
                ],
              },
            },
            {
              path: ":uid",
              name: t('detailInventory'),
              component: InventoryDetail,
              meta: {
                parentData: "Inventories",
                requiresAuth: true,
                parentLink: '/admin/inventories/list',
                permissions: [
                  "detail_inventory"
                ],
              },
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach((to, from) => {
  const store = useProjectStore();

  // TODO: DELETED SOON
  if (to.path == '/') {
    return {
      path: '/auth/a/login'
    }
  }

  if (to.path === "/admin/production/projects" && from.meta.isDetailProject) {
    store.setForceUpdatePages(false);
    store.setKeepProjectParams(true);
  }

  // redirected
  var officeMenu = [
    {
      path: '/employees',
      slug: 'employees',
      currentPath: '/admin/employees/list'
    },
    {
      path: '/branches',
      slug: 'branches',
      currentPath: '/admin/master/branches'
    },
    {
      path: '/roles',
      slug: 'roles',
      currentPath: '/admin/user-management/roles'
    },
    {
      path: '/users',
      slug: 'users',
      currentPath: '/admin/user-management/users'
    },
    {
      path: '/positions',
      slug: 'positions',
      currentPath: '/admin/master/positions'
    },
    {
      path: '/divisions',
      slug: 'divisions',
      currentPath: '/admin/master/divisions'
    },
    {
      path: '/inventories',
      slug: 'inventories',
      currentPath: '/admin/inventories/list'
    },
    {
      path: '/brands',
      slug: 'brands',
      currentPath: '/admin/inventories/brands'
    },
    {
      path: '/suppliers',
      slug: 'suppliers',
      currentPath: '/admin/inventories/suppliers'
    },
    {
      path: '/units',
      slug: 'units',
      currentPath: '/admin/inventories/units'
    },
    {
      path: '/inventory-types',
      slug: 'inventoryTypes',
      currentPath: '/admin/inventories/inventory-types'
    },
    {
      path: '/custom-inventories',
      slug: 'customInventories',
      currentPath: '/admin/inventories/custom'
    },
    {
      path: '/request-inventories',
      slug: 'requestInventories',
      currentPath: '/admin/inventories/request-inventories'
    }
  ];

  for (let xx = 0; xx < officeMenu.length; xx++) {
    if (officeMenu[xx].currentPath === to.path) {
      return window.location.href = import.meta.env.VITE_OFFICE_URL + '/init/' + useBreakToken('encrypted_user_id') + `?path=${officeMenu[xx].slug}`;
    }
  }

  if (to.path == '/admin/inventories/list') {
    window.location.href = import.meta.env.VITE_OFFICE_URL + '/init/' + useBreakToken('encrypted_user_id') + `?path=inventories`;
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

  if (to.meta.permissions) {
    for (let permission in to.meta.permissions) {
      if (!useCheckPermission(to.meta.permissions[permission])) {
        return {
          path: '/not-allowed'
        }
      }
    }
  }

  // validate page permission
  if (to.meta.authView) {
    var allowed = true
    var currentRole = useBreakToken('role')
    if (
      (currentRole) && (to.meta.authView.indexOf(currentRole) == -1)
    ) {
      allowed = false
    }

    if (!allowed) {
      return {
        path: '/not-allowed'
      }
    }
  }
});

export default router;
