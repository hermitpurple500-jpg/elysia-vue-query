import { describe, it, expect, expectTypeOf } from "vite-plus/test";
import { stableSerialize } from "../serialize";
import type { SerializedParam } from "../types";

describe("stableSerialize", () => {
  it("returns undefined for undefined input", () => {
    expect(stableSerialize(undefined)).toBeUndefined();
  });

  it("preserves null", () => {
    expect(stableSerialize(null)).toBeNull();
  });

  it("preserves string values", () => {
    expect(stableSerialize("hello")).toBe("hello");
  });

  it("preserves number values", () => {
    expect(stableSerialize(42)).toBe(42);
    expect(stableSerialize(0)).toBe(0);
    expect(stableSerialize(-1)).toBe(-1);
  });

  it("preserves boolean values", () => {
    expect(stableSerialize(true)).toBe(true);
    expect(stableSerialize(false)).toBe(false);
  });

  it("sorts object keys deterministically", () => {
    const result = stableSerialize({ z: 1, a: 2, m: 3 });
    const keys = Object.keys(result as Record<string, unknown>);
    expect(keys).toEqual(["a", "m", "z"]);
  });

  it("produces identical output regardless of key insertion order", () => {
    const a = stableSerialize({ b: 1, a: 2 });
    const b = stableSerialize({ a: 2, b: 1 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("filters out undefined values in objects", () => {
    const result = stableSerialize({ a: 1, b: undefined, c: 3 });
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("handles nested objects with sorted keys", () => {
    const result = stableSerialize({
      z: { b: 2, a: 1 },
      a: { d: 4, c: 3 },
    }) as Record<string, Record<string, unknown>>;
    const outer = Object.keys(result);
    expect(outer).toEqual(["a", "z"]);

    const innerA = Object.keys(result["a"]!);
    expect(innerA).toEqual(["c", "d"]);
  });

  it("handles arrays preserving order", () => {
    const result = stableSerialize([3, 1, 2]);
    expect(result).toEqual([3, 1, 2]);
  });

  it("handles arrays of objects with sorted keys", () => {
    const result = stableSerialize([{ b: 1, a: 2 }]);
    const item = (result as SerializedParam[])[0] as Record<string, unknown>;
    expect(Object.keys(item)).toEqual(["a", "b"]);
  });

  it("throws on Date values", () => {
    expect(() => stableSerialize(new Date())).toThrow("Non-serializable");
  });

  it("throws on Function values", () => {
    expect(() => stableSerialize(() => {})).toThrow("Non-serializable");
  });

  it("throws on Set values", () => {
    expect(() => stableSerialize(new Set())).toThrow("Non-serializable");
  });

  it("throws on Map values", () => {
    expect(() => stableSerialize(new Map())).toThrow("Non-serializable");
  });

  it("throws on nested non-serializable values", () => {
    expect(() => stableSerialize({ deep: { fn: () => {} } })).toThrow("Non-serializable");
  });

  it("handles deeply nested structures", () => {
    const input = {
      level1: {
        level2: {
          level3: [1, "two", { z: true, a: false }],
        },
      },
    };
    const result = stableSerialize(input) as Record<
      string,
      Record<string, Record<string, SerializedParam[]>>
    >;
    expect(result).toBeDefined();

    const l3Array = result["level1"]!["level2"]!["level3"]!;
    const obj = l3Array[2] as Record<string, unknown>;
    expect(Object.keys(obj)).toEqual(["a", "z"]);
  });

  it("handles empty object", () => {
    expect(stableSerialize({})).toEqual({});
  });

  it("handles empty array", () => {
    expect(stableSerialize([])).toEqual([]);
  });

  it("returns correct type for serialized output", () => {
    const result = stableSerialize({ key: "value" });
    expectTypeOf(result).toEqualTypeOf<SerializedParam | undefined>();
  });
});
