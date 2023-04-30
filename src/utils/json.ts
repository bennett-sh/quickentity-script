export function buildJSON<T1>(obj: T1) {
  return {
    setIf<TKey extends string | number | symbol, TVal>(condition: boolean, key: TKey, value: TVal) {
      return buildJSON(condition ? { ...obj, [key]: value } : obj)
    },
    addIf: (condition: boolean, data: any) => buildJSON(condition ? { ...obj, ...data } : obj),
    strip: (prop: string) => buildJSON(Object.fromEntries(Object.entries(obj).filter(entry => entry[0] != prop))),
    stripIf: (condition: boolean, prop: string) => buildJSON(condition ? Object.fromEntries(Object.entries(obj).filter(entry => entry[0] != prop)) : obj),
    stripMultible: (props: string[]) => buildJSON(Object.fromEntries(Object.entries(obj).filter(entry => !props.includes(entry[0])))),
    stripNull: () => buildJSON(Object.fromEntries(Object.entries(obj).filter(prop => prop != null))),
    build: () => obj,
    stringify: (replacer?: (this: any, key: string, value: any) => any, space?: string | number) => JSON.stringify(obj, replacer, space),
  }
}

export function runForEachKeyValue(obj: { [key: string]: any }, operation: (key: string, value: any) => void) {
  for(const key of Object.keys(obj)) {
    if(obj.hasOwnProperty(key)) {
      const value = obj[key]
      if(typeof value === "object") {
        runForEachKeyValue(value, operation)
      }
      operation(key, value)
    }
  }
}
