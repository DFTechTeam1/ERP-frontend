import { defineStore } from "pinia";
import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const usePositionStore = defineStore("position", {
  state: () => ({
    positions: [],
    allPositions: [],
    totalPositions: 0,
    errorValidation: null,
    storeDataResult: null,
    detailPosition: null,
  }),
  getters: {
    listOfPositions: (state) => state.positions,
    listOfAllPositions: (state) => state.allPositions,
    totalOfPositions: (state) => state.totalPositions,
    errorValidationData: (state) => state.errorValidation,
  },
  actions: {
    async initPositions(payload) {
      let params = {
        page: payload ? payload.page : 1,
        itemsPerPage: payload ? payload.itemsPerPage : 10,
        sortBy: payload ? payload.sortBy : [],
        search: payload ? payload.search.value : "",
      };
      await axios
        .get("/positions", {
          params: params,
        })
        .then((res) => {
          this.positions = res.data.data.paginated;
          this.totalPositions = res.data.data.totalData;
        })
        .catch();
    },
    async getAll(payload = null) {
      try {
        var endpoint = '/positions/all';
        if (payload) {
          endpoint += "?search=" + payload.name;
        }
        const resp = await axios.get(endpoint)
        
        return resp;
      } catch (error) {
        return error;
      }
    },
    async storeData(payload) {
      try {
        if (payload.detailData) {
          this.storeDataResult = await axios.patch(
            "/positions/" + payload.detailData.uid,
            payload
          );
        } else {
          this.storeDataResult = await axios.post("/positions", payload);
        }
        notify({
          title: "Success",
          text: this.storeDataResult.data.message,
          type: "success",
        });
        return this.storeDataResult;
      } catch (error) {
        this.errorValidation = error.response.data.message;
        return error;
      }
    },
    async detailData(payload) {
      try {
        this.detailPosition = await axios.get("/positions/" + payload.uid);
        return this.detailPosition;
      } catch (error) {
        return error;
      }
    },
    async deleteData(payload) {
      try {
        var deleteResult = await axios.delete("/positions/" + payload.uid);
        notify({
          title: "Success",
          text: deleteResult.data.message,
          type: "success",
        });
        return deleteResult;
      } catch (error) {
        return error;
      }
    },
    async bulkDelete(payload) {
      try {
        var deleteResult = await axios.delete("/positions", {
          data: {
            uids: payload.map((item) => item.uid),
          },
        });

        if (deleteResult.data.code == 400) {
          notify({
            title: "Failed",
            text: deleteResult.data.message,
            type: "error",
          });
        } else {
          notify({
            title: "Success",
            text: deleteResult.data.message,
            type: "success",
          });
        }
        return deleteResult;
      } catch (error) {
        notify({
          title: "Failed",
          text: error.response.data.message,
          type: "error",
        });

        return error;
      }
    },
  },
});
