import { createProvider } from "./createProvider";
import type { RelativeSize } from "shared/types";
import type { IDir, IPoint } from "../types";
import { Dir, Vector } from "../path";

const {
  Provider: LocatorProvider,
  useProvider: useLocatorProvider,
  useProviderRegister: useLocatorProviderRegister,
} = createProvider<{
  getLocation?: (location: RelativeSize) => { pos: Vector; dir: Dir };
}>("LocatorProvider");
export { LocatorProvider, useLocatorProvider, useLocatorProviderRegister };
export default LocatorProvider;
