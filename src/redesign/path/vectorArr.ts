import { Vector } from "./vector";

export class VectorArr extends Array<Vector> {
  constructor(...items) {
    super(...items);

    // Set the prototype explicitly. (typescript does not allow to extend base classes like Array)
    // see: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
    Object.setPrototypeOf(this, VectorArr.prototype);
  }

  toList() {
    return this.map((v) => [v.x, v.y] as const);
  }

  rev() {
    let rev = [...this];
    return new VectorArr(...rev.reverse());
  }

  print() {
    return `Vector ${this.map((v) => `[${[v.x, v.y]}]`)}`;
  }
}
