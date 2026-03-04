import type { SerializedParam } from './types'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value) as unknown
  return proto === Object.prototype || proto === null
}

function assertSerializable(value: unknown, path: string): asserts value is SerializedParam {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return
  }

  if (typeof value === 'undefined') {
    return
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      assertSerializable(value[i], `${path}[${i}]`)
    }
    return
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      assertSerializable(value[key], `${path}.${key}`)
    }
    return
  }

  throw new TypeError(`Non-serializable value at "${path}": ${Object.prototype.toString.call(value)}`)
}

export function stableSerialize(input: unknown): SerializedParam | undefined {
  if (input === undefined) return undefined

  assertSerializable(input, 'root')

  return stableSerializeInternal(input as SerializedParam)
}

function stableSerializeInternal(value: SerializedParam): SerializedParam {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => stableSerializeInternal(item as SerializedParam)) as readonly SerializedParam[]
  }

  const obj = value as Record<string, SerializedParam>
  const sortedKeys = Object.keys(obj).sort()
  const result: Record<string, SerializedParam> = {}

  for (const key of sortedKeys) {
    const val = obj[key]
    if (val !== undefined) {
      result[key] = stableSerializeInternal(val)
    }
  }

  return result
}
