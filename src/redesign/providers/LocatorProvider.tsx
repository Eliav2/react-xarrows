import { createProvider } from "./createProvider";
import type { RelativeSize } from "shared/types";
import type { IDir, IPoint } from "../types";

const {
  Provider: LocatorProvider,
  useProvider: useLocatorProvider,
  useProviderRegister: useLocatorProviderRegister,
} = createProvider<{
  getLocation?: (location: RelativeSize) => { pos: IPoint; dir: IDir };
}>("LocatorProvider");
export { LocatorProvider, useLocatorProvider, useLocatorProviderRegister };
export default LocatorProvider;
