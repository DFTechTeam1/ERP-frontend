import { defineStore } from "pinia";
import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export const useDivisionStore = defineStore("division", {
  state: () => ({
    divisions: [],
    totalDivisions: 0,
    errorValidation: null,
    storeDataResult: null,
    detailDivision: null,
  }),
  getters: {
    listOfDivisions: (state) => state.divisions,
    totalOfDivisions: (state) => state.totalDivisions,
    errorValidationData: (state) => state.errorValidation,
  },
  actions: {
    async initDivisions(payload) {
      let params = {
        page: payload ? payload.page : 1,
        itemsPerPage: payload ? payload.itemsPerPage : 10,
        sortBy: payload ? payload.sortBy : [],
        search: payload ? payload.search.value : "",
      };
      await axios
        .get("/divisions", {
          params: params,
        })
        .then((res) => {
          this.divisions = res.data.data.paginated;
          this.totalDivisions = res.data.data.totalData;
        })
        .catch();
    },
    async storeData(payload) {
      try {
        if (payload.detailData) {
          this.storeDataResult = await axios.patch(
            "/divisions/" + payload.detailData.uid,
            payload
          );
        } else {
          this.storeDataResult = await axios.post("/divisions", payload);
        }
        notify({
          title: "Success",
          text: this.storeDataResult.data.message,
          type: "success",
        });
        return this.storeDataResult;
      } catch (error) {
        console.log("masuk catch", error);
        this.errorValidation = error.response.data.message;
        return error;
      }
    },
    async detailData(payload) {
      try {
        this.detailDivision = await axios.get("/divisions/" + payload.uid);
        return this.detailDivision;
      } catch (error) {
        return error;
      }
    },
    async deleteData(payload) {
      try {
        var deleteResult = await axios.delete("/divisions/" + payload.uid);
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
        var deleteResult = await axios.delete("/divisions", {
          data: {
            uids: payload.map((item) => item.uid),
          },
        });

        notify({
          title: "Success",
          text: deleteResult.data.message,
          type: "success",
        });

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
