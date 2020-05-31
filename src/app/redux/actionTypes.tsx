export const APP_WILL_MOUNT = "APP_WILL_MOUNT";
export const APP_WILL_UNMOUNT = "APP_WILL_UNMOUNT";

export interface AppWillMountAction {
  type: typeof APP_WILL_MOUNT;
  app: Object;
}
export interface AppWillUnMountAction {
  type: typeof APP_WILL_UNMOUNT;
  app: Object;
}
