import {
  mdiAccountGroup,
  mdiAccountSettings,
  mdiBank,
  mdiBookAccount,
  mdiCar,
  mdiCircleOutline,
  mdiGamepad,
  mdiGauge,
  mdiSoundbar,
  mdiTruckDeliveryOutline,
  mdiWeightGram,
  mdiCogOutline,
  mdiNoteText
} from "@mdi/js";
import { defineStore } from "pinia";

export const useMenusStore = defineStore("menus", {
  state: () => ({
    panelMenus: [
      {
        title: 'Addons',
        is_subheader: true,
        menus: [
          {
            name: 'Addons List',
            key: 'Production',
            icon: mdiNoteText,
            children: [],
            href: '/panel/addons',
            permission: 'dashboard_access',
          },
          {
            name: 'Setting',
            key: 'Production',
            icon: mdiCogOutline,
            children: [],
            href: '/panel/setting',
            permission: 'dashboard_access',
          },
        ],
      },
    ],
    menus: [
      {
        title: "Dashboard",
        is_subheader: false,
        menus: [
          {
            name: "Dashboard",
            key: "Dashboard",
            href: "/admin/dashboard",
            icon: mdiGauge,
            children: [],
            permission: 'dashboard_access',
          },
          {
            name: "Setting",
            key: "Setting",
            href: "/admin/setting",
            icon: mdiCogOutline,
            children: [],
            permission: 'dashboard_access',
          },
        ],
      },
      {
        title: 'Production',
        is_subheader: true,
        menus: [
          {
            name: 'Project List',
            key: 'Production',
            icon: mdiNoteText,
            children: [],
            href: '/admin/production/projects',
            permission: 'dashboard_access',
          }
        ],
      },
      {
        title: "HRD",
        is_subheader: true,
        menus: [
          {
            name: "User Management",
            key: "UserManagement",
            icon: mdiAccountSettings,
            children: [
              {
                name: "Users",
                icon: mdiCircleOutline,
                href: "/admin/user-management/users",
                permission: 'list_user',
              },
              {
                name: "Role",
                icon: mdiCircleOutline,
                href: "/admin/user-management/roles",
                permission: 'list_role',
              },
            ],
          },
          {
            name: "Employee",
            key: "Employee",
            icon: mdiAccountGroup,
            href: "/admin/employees/list",
            children: [],
            permission: 'list_employee',
          },
        ],
      },
      {
        title: "Master",
        is_subheader: true,
        menus: [
          {
            name: "Master",
            key: "Master",
            icon: mdiGamepad,
            children: [
              {
                name: "Division",
                icon: mdiCircleOutline,
                href: "/admin/master/divisions",
                permission: 'list_division',
              },
              {
                name: "Positions",
                icon: mdiCircleOutline,
                href: "/admin/master/positions",
                permission: 'list_position',
              },
            ],
          },
        ],
      },
      {
        title: "Accounting",
        is_subheader: true,
        menus: [
          {
            name: "Accounts",
            icon: mdiBank,
            href: "/admin/homepage",
            children: [],
            permission: 'list_account',
          },
          {
            name: "Reports",
            icon: mdiBookAccount,
            href: "/admin/homepage",
            children: [],
            permission: 'accounting_reports',
          },
        ],
      },
      {
        title: "Inventory",
        is_subheader: true,
        menus: [
          {
            name: "Suppliers",
            icon: mdiCar,
            href: "/admin/inventories/suppliers",
            children: [],
            permission: 'list_supplier',
          },
          {
            name: "Brands",
            icon: mdiCar,
            href: "/admin/inventories/brands",
            children: [],
            permission: 'list_brand',
          },
          {
            name: "Units",
            icon: mdiWeightGram,
            href: "/admin/inventories/units",
            children: [],
            permission: 'list_unit',
          },
          {
            name: "Inventory Type",
            icon: mdiTruckDeliveryOutline,
            href: "/admin/inventories/inventory-types",
            children: [],
            permission: 'list_inventory_type',
          },
          {
            name: "Inventories",
            icon: mdiSoundbar,
            href: "/admin/inventories/list",
            children: [],
            permission: 'list_inventory',
          },
        ],
      },
    ],
    activeMenu: null,
    pathName: null,
    showNotification: true,
  }),
  getters: {
    availableMenus: (state) => state.menus,
    activeMenuGetters: (state) => state.activeMenu,
    pathNameGetters: (state) => state.pathName,
    showSnackbar: (state) => state.showNotification,
  },
  actions: {
    navigateMenu(path) {
      this.activeMenu = path;
    },
    setPathName(name) {
      this.pathName = name;
    },
    getMenus() {
      var menus = this.menus;

      var currentLang = localStorage.getItem('lang')
      if (currentLang == 'en') {
        menus = menus.map((elem) => {
          elem.name = elem.lang_en

          return elem
        })
      } else if (currentLang == 'id') {
        menus = menus.map((elem) => {
          elem.name = elem.lang_id

          return elem
        })
      }

      return menus;
    },
    getPanelMenus() {
      var menus = this.panelMenus;

      return menus;
    }
  },
});
