import { Loading } from "quasar";

export const loading = {
  show(message = "Please wait...") {
    Loading.show({
      message,
      spinnerColor: "deep-purple",
      backgroundColor: "rgba(58,49,43,.25)",
    });
  },

  hide() {
    Loading.hide();
  },
};
