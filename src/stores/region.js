import { defineStore } from "pinia"
import axios from 'axios'

export const useRegionStore = defineStore('region', {
    state: () => ({
        provinces: [],
        cities: [],
        districts: [],
        villages: [],
        worldCountries: [],
        worldStates: [],
        worldCities: [],
    }),
    getters: {
        listOfProvinces: (state) => state.provinces,
        listOfCities: (state) => state.cities,
        listOfDistricts: (state) => state.districts,
        listOfVillages: (state) => state.villages,
        listOfWorldCountries: (state) => state.worldCountries,
        listOfWorldStates: (state) => state.worldStates,
        listOfWorldCities: (state) => state.worldCities,
    },
    actions: {
        async getProvinces() {
            const provinces = await axios.get('/indonesia/provinces')

            if (provinces.status == 200) {
                return provinces.data.data;
            }
        },
        async getCities(payload) {
            const cities = await axios.get('/indonesia/cities?province_code=' + payload.province_code)
            
            return cities.status < 300 ? cities.data.data : [];
        },
        async getDistricts(payload) {
            const districts = await axios.get('/indonesia/districts?city_code=' + payload.city_code)
            
            return districts.status < 300 ? districts.data.data : [];
        },
        async getVillages(payload) {
            const villages = await axios.get('/indonesia/villages?district_code=' + payload.district_code)
            
            return villages.status < 300 ? villages.data.data : [];
        },
        async initCountries() {
            try {
                const resp = await axios.get('/world/countries')

                this.worldCountries = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        },
        async initStates(countryCode) {
            try {
                const resp = await axios.get('/world/states?country_id=' + countryCode)

                this.worldStates = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        },
        async initCities(stateId) {
            try {
                const resp = await axios.get('/world/cities?state_id=' + stateId)

                this.worldCities = resp.data.data

                return resp
            } catch (error) {
                return error
            }
        }
    }
});