// @ts-ignore
export class NonExhaustiveError<T> extends Error {}

type MatcherElseParam<Remaining> = [Remaining] extends [never]
  ? unknown
  : Remaining

type MatcherExhaustive<Result, Remaining> = [Remaining] extends [never]
  ? () => Result
  : NonExhaustiveError<Remaining>

type Matcher<Value, Result, Remaining = Value> = {
  with<MatchVal extends Remaining, Handler extends (value: MatchVal) => any>(
    matchValue: MatchVal,
    handler: Handler
  ): Matcher<Value, Result | ReturnType<Handler>, Exclude<Remaining, MatchVal>>
  else: <Handler extends (value: MatcherElseParam<Remaining>) => any>(
    handler: Handler
  ) => Result | ReturnType<Handler>
  exhaustive: MatcherExhaustive<Result, Remaining>
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
export function match<Value>(value: Value) {
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
        Value,
        ReturnType<typeof handler>,
        Exclude<Value, typeof matchValue>
      >
    },
    else: resolve,
    exhaustive() {
      return resolve(() => {
        throw new NonExhaustiveError()
      })
    },
  } as Matcher<Value, never, Value>
}
