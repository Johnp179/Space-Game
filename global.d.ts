export {};

declare global {
  var __MONGO_URI__: string;
  var __MONGO_DB_NAME__: string;
  interface Window {
    user: IUser | null;
    showBoundary: (error: any) => void;
    setFullScreen: (boolean) => void;
  }
}
