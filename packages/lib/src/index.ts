// @ts-ignore
export class NonExhaustiveError<T> extends Error {}

type Matcher<T, R, Remaining = T> = {
  with<V extends Remaining, U extends (value: V) => any>(
    matchValue: V,
    handler: U
  ): Matcher<T, R | ReturnType<U>, Exclude<Remaining, V>>
  else: <U extends (value: Remaining) => any>(handler: U) => R | ReturnType<U>
  exhaustive: [Remaining] extends [never]
    ? () => R
    : NonExhaustiveError<Remaining>
}
/**
 * Creates a pattern matching expression for a given value
 */
export function match<const T>(value: T) {
  const handlers: [unknown, Function][] = []
  const matcher = {
    with<V extends T, U extends Function>(matchValue: V, handler: U) {
      return handlers.push([matchValue, handler]), matcher
    },
    else<U extends (value: T) => any>(handler: U): never | ReturnType<U> {
      for (const [pattern, handler] of handlers) {
        if (value === pattern) return handler(value)
      }
      return handler(value)
    },
    exhaustive() {
      for (const [pattern, handler] of handlers) {
        if (value === pattern) return handler(value)
      }
      // If we reach here, no pattern matched, which shouldn't happen with exhaustive matching
      throw new NonExhaustiveError()
    },
  }
  return matcher as Matcher<T, never, T>
}
