export class ResultArray<T> extends Array<T> {
  get allTrue() {
    return this.every((x) => x == true);
  }
  get allFalse() {
    return this.every((x) => x == false);
  }
  get allTrueStrict() {
    return this.every((x) => x === true);
  }
  get allFalseStrict() {
    return this.every((x) => x === false);
  }
}

export function as<TObject, TReturn>(
  obj: any,
  fn: (obj: TObject) => TReturn,
): TReturn {
  return fn(obj as TObject);
}

export function scope<TObject, TReturn>(
  obj: TObject,
  fn: ((arg: TObject) => TReturn)[],
): ResultArray<TReturn> {
  return new ResultArray(fn.map((x) => x(obj)) as any);
}
