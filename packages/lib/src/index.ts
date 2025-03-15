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
 * Creates a "pattern matching"-like  expression for a given value
 * @see https://www.npmjs.com/package/lit-match
 * @example
 * ```ts
 * const statusText = match(status)
 *   .with(Status.Idle, () => "Idle")
 *   .with(Status.Active, () => "Active")
 *   .with(Status.Error, () => "Error")
 *   .exhaustive()
 *
 * console.log(statusText)
 * //           ^? string
 * ```
 */
export function match<T>(value: T) {
  const handlers: [unknown, Function][] = []
  const resolve = (fallback: Function) => {
    for (const [matchValue, handler] of handlers) {
      if (value === matchValue) return handler(value)
    }
    return fallback(value)
  }

  return {
    with(matchValue, handler) {
      handlers.push([matchValue, handler])
      return this as Matcher<
        T,
        ReturnType<typeof handler>,
        Exclude<T, typeof matchValue>
      >
    },
    else: resolve,
    exhaustive() {
      return resolve(() => {
        throw new NonExhaustiveError()
      })
    },
  } as Matcher<T, never, T>
}
