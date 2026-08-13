import { Notify, type QNotifyCreateOptions } from "quasar";

type NotifyType = "positive" | "negative" | "warning" | "info";

interface NotifyOptions {
  message: string;
  caption?: string;
}

function createNotify(
  type: NotifyType,
  options: NotifyOptions | string,
) {
  const data =
    typeof options === "string"
      ? { message: options }
      : options;

  const config: QNotifyCreateOptions = {
    position: "top-right",
    timeout: type === "negative" ? 5000 : 3000,
    progress: true,
    type,
    message: data.message,
    actions: [
      {
        icon: "close",
        color: "white",
      },
    ],
  };

  if (data.caption !== undefined) {
    config.caption = data.caption;
  }

  Notify.create(config);
}

export const notify = {
  success(options: NotifyOptions | string) {
    createNotify("positive", options);
  },

  error(options: NotifyOptions | string) {
    createNotify("negative", options);
  },

  warning(options: NotifyOptions | string) {
    createNotify("warning", options);
  },

  info(options: NotifyOptions | string) {
    createNotify("info", options);
  },
};
