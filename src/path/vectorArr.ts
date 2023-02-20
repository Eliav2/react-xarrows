import { Dir, TrailingDir, Vector } from "./vector";

export class VectorArr<T extends Vector = Vector> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);

    // Set the prototype explicitly. (typescript does not allow to extend base classes like Array)
    // see: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
    Object.setPrototypeOf(this, VectorArr.prototype);
  }

  toList() {
    return super.map((v) => [v.x, v.y] as const);
  }

  rev() {
    let rev = [...this];
    return new VectorArr(...rev.reverse());
  }

  print() {
    return `Vector ${super.map((v) => `[${[v.x, v.y]}]`)}`;
  }

  // @ts-ignore

  map<K extends any>(callback: (value: T, index: number, array: T[]) => K, thisArg?: any): VectorArr<T> {
    const mapped = super.map(callback, thisArg);
    return new VectorArr(...(mapped as any)) as any;
  }
}

export class DirArr<T extends Dir = Dir> extends VectorArr<T> {
  constructor(...items) {
    super(...items);
  }

  // chooses one trailingDir from the list of trailingDir, based on a given direction
  // the chosen trailingDir is the one that is the closest projection to the given direction
  chooseDir(dir: Dir) {
    const sorted = [...this];
    sorted.sort((a, b) => {
      return b.projection(dir).size() - a.projection(dir).size();
    });
    return sorted[0];
  }

  // @ts-ignore
  map(callback, thisArg?: any) {
    return new DirArr(super.map(callback, thisArg));
  }
}
