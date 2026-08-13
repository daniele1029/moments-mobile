import { Dialog } from "quasar";

export function confirmDelete(
  message: string,
  onOk: () => Promise<void> | void,
) {
  Dialog.create({
    title: "Delete Guest",
    message,
    cancel: true,
    persistent: true,
    ok: {
      color: "negative",
      label: "Delete",
    },
  }).onOk(() => {
    void onOk();
  });
}
