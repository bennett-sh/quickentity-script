export function buildJSON<T1>(obj: T1) {
  return {
    setIf<TKey extends string | number | symbol, TVal>(
      condition: boolean,
      key: TKey,
      value: TVal
    ) {
      return buildJSON(condition ? { ...obj, [key]: value } : obj)
    },
    addIf: (condition: boolean, data: any) =>
      buildJSON(condition ? { ...obj, ...data } : obj),
    strip: (prop: string) =>
      buildJSON(
        Object.fromEntries(
          Object.entries(obj).filter((entry) => entry[0] != prop)
        )
      ),
    stripIf: (condition: boolean, prop: string) =>
      buildJSON(
        condition
          ? Object.fromEntries(
              Object.entries(obj).filter((entry) => entry[0] != prop)
            )
          : obj
      ),
    stripMultible: (props: string[]) =>
      buildJSON(
        Object.fromEntries(
          Object.entries(obj).filter((entry) => !props.includes(entry[0]))
        )
      ),
    stripNull: () =>
      buildJSON(
        Object.fromEntries(Object.entries(obj).filter((prop) => prop != null))
      ),
    build: () => obj,
    stringify: (
      replacer?: (this: any, key: string, value: any) => any,
      space?: string | number
    ) => JSON.stringify(obj, replacer, space),
  }
}

export function runForEachKeyValue(
  obj: { [key: string]: any },
  operation: (key: string, value: any) => void
) {
  for (const key of Object.keys(obj)) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (typeof value === "object") {
        runForEachKeyValue(value, operation)
      }
      operation(key, value)
    }
  }
}

export function deepAssign(target, ...sources) {
  for (const source of sources) {
    for (const k in source) {
      let vs = source[k],
        vt = target[k]
      if (Object(vs) == vs && Object(vt) === vt) {
        target[k] = deepAssign(vt, vs)
        continue
      }
      target[k] = source[k]
    }
  }
  return target
}

export function deepMerge(target, ...sources) {
  const isObject = item => item && typeof item === 'object' && !Array.isArray(item)
  const isArray = item => Array.isArray(item)
  if (!sources.length) {
    return target
  }
  const source = sources.shift()
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isArray(target[key]) && isArray(source[key])) {
        target[key].push(...source[key])
      } else if (isObject(source[key])) {
        if (!isObject(target[key])) {
          Object.assign(target, { [key]: {} })
        }
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return deepMerge(target, ...sources)
}
