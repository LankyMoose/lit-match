# **lit-match**

#### A minimal alternative to ts-pattern that focuses on literal values and supports enums!

<br />

### Usage

```ts
import { match } from "lit-match"

enum Progress {
  None,
  Loading,
  Loaded,
}

const currentProgress = Progress.Loaded as Progress
```

_the above is used for all proceeding examples:_

```ts
const result = match(currentProgress)
  .with(Progress.None, () => null)
  .with(Progress.Loading, () => "loading")
  .with(Progress.Loaded, () => "loaded")
  .exhaustive()

console.log(result)
//          ^? string | null
```

The `exhaustive` method will throw a compile-time error if not all variants have been exhausted.

```ts
const result = match(currentProgress)
  .with(Progress.None, () => null)
  .with(Progress.Loading, () => "loading")
  .exhaustive()
// ^ throws compile-time error, not all variants have been exhausted
```

The `else` allows you to handle cases where no pattern matches, or can be used like a 'fallthrough' case.

```ts
const result = match(currentProgress)
  .with(Progress.None, (value) => null)
  //                    ^? Progress.None
  .else((value) => "active")
//       ^? Progress.Loading | Progress.Loaded

console.log(result)
//          ^? null | "active"
```
