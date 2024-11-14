import { defineStore } from "pinia"
import axios from 'axios'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useCustomInventoriesStore = defineStore('customInventories', {
    state: () => ({
        availableInventories: [],
        targetInventories: [],
        selectedInventory: null,
        selectedType: null,
        inventoryList: [],
        removedInventories: [],
        inventoryListTotal: 0,
        totalPagination: 0,
    }),
    getters: {
        listOfAvailableInventories: (state) => state.availableInventories,
        listOfTargetInventories: (state) => state.targetInventories,
        listOfInventories: (state) => state.inventoryList,
        totalOfInventoryList: (state) => state.inventoryListTotal,
        totalOfPagination: (state) => state.totalPagination,
    },
    actions: {
        chooseInventory(inventory, type) {
            if (inventory.stock > 0) {
                this.selectedInventory = {
                    uid: inventory.uid,
                    stock: 1,
                    name: inventory.name,
                    active: false,
                }

                if (inventory.current_id) {
                    this.selectedInventory.current_id = inventory.current_id
                }

                if (type == 'available') {
                    var newArr = this.availableInventories.map((elem) => {
                        if (elem.uid == this.selectedInventory.uid) {
                            elem.active = true
                        } else {
                            elem.active = false
                        }

                        return elem
                    })

                    this.availableInventories = newArr
                } else {
                    var newArrTarget = this.targetInventories.map((elem) => {
                        if (elem.uid == this.selectedInventory.uid) {
                            elem.active = true
                        } else {
                            elem.active = false
                        }

                        return elem
                    })

                    this.targetInventories = newArrTarget
                }

                this.selectedType = type
            }
        },
        async getInventories(params) {
            try {
                const resp = await axios.get(`/custom-inventories/itemList?search=${params.search}`)

                this.availableInventories = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        },
        moveItem() {
            if (this.selectedInventory) {
                if (this.selectedType == 'available') {

                    // re-define current_id if needed
                    if (this.removedInventories.length) {
                        this.removedInventories.map((remove) => {
                            if (remove.uid == this.selectedInventory.uid) {
                                if (remove.current_id) {
                                    this.selectedInventory.current_id = remove.current_id
                                }
                            }
                        })
                    }

                    this.targetInventories.push(this.selectedInventory)

                    const sum = this.targetInventories.reduce((acc, cur)=> {
                        const found = acc.find(val => val.uid === cur.uid)
                        if(found){
                            found.stock += Number(cur.stock)
                        }
                        else{
                            acc.push({...cur})
                        }
                        return acc
                    }, [])
                    this.targetInventories = sum
                    this.targetInventories.map((target) => {
                        target.active = false

                        return target
                    })

                    this.availableInventories.map((elem) => {
                        elem.active = false

                        if (elem.uid == this.selectedInventory.uid) {
                            elem.stock = parseInt(elem.stock) - 1
                        }

                        return elem
                    })
                } else {
                    this.availableInventories.push(this.selectedInventory)

                    console.log('selected', this.selectedInventory);

                    // store to removed variable if needed
                    if (this.selectedInventory.current_id) {
                        this.removedInventories.push(this.selectedInventory)

                        const sumRemoved = this.removedInventories.reduce((acc, cur)=> {
                            const found = acc.find(val => val.uid === cur.uid)
                            if(found){
                                found.stock += Number(cur.stock)
                            }
                            else{
                                acc.push({...cur})
                            }
                            return acc
                        }, [])

                        this.removedInventories = sumRemoved
                    }

                    console.log('removed', this.removedInventories);

                    const sum = this.availableInventories.reduce((acc, cur)=> {
                        const found = acc.find(val => val.uid === cur.uid)
                        if(found){
                            found.stock += Number(cur.stock)
                        }
                        else{
                            acc.push({...cur})
                        }
                        return acc
                    }, [])
                    this.availableInventories = sum
                    this.availableInventories.map((target) => {
                        target.active = false

                        return target
                    })

                    this.targetInventories.map((elem) => {
                        elem.active = false

                        if (elem.uid == this.selectedInventory.uid) {
                            elem.stock = parseInt(elem.stock) - 1
                        }

                        return elem
                    })
                    this.targetInventories = this.targetInventories.filter((filter) => {
                        return filter.stock > 0
                    })
                }

                this.selectedInventory = null
                this.selectedType = null
            }
        },
        async storeInventory(payload, updatedId) {
            try {
                var url = '/custom-inventories'
                var method = 'post'
                if (updatedId != 0) {
                    url = `/custom-inventories/${updatedId}`
                    method = 'put'
                }
                const resp = await axios[method](url, payload)

                notify({
                    title: 'Success',
                    text: resp.data.message,
                    type: 'success',
                });

                return resp
            } catch (error) {
                return error
            }
        },
        async getList(payload) {
            try {
                console.log('payload script', payload);
                var params = {
                  page: payload.page || 1,
                  itemsPerPage: payload.itemsPerPage || 10,
                };

                if (payload.name) {
                  params.search = {
                    name: payload.name
                  };
                }

                console.log('params', params);

                const resp = await axios.get('/custom-inventories', {
                  params: params
                });

                this.inventoryList = resp.data.data.paginated

                this.inventoryListTotal = resp.data.data.totalData

                return resp
            } catch (error) {
                return error
            }
        },
        async showDetailCustomInventory(uid) {
            try {
                const resp = await axios(`/custom-inventories/edit/${uid}`)

                this.targetInventories = resp.data.data.items.map((elem) => {
                    return {
                        active: false,
                        name: elem.inventory.name,
                        stock: elem.qty,
                        uid: elem.inventory.uid,
                        current_id: elem.id,
                    }
                })

                return resp
            } catch (error) {
                return error
            }
        },
        clearState() {
            this.selectedInventory = null
            this.removedInventories = []
            this.targetInventories = []
            this.availableInventories = []
        }
    },
})
