import { match } from "lit-match"

enum Progress {
  None,
  Loading,
  Loaded,
}

const currentProgress = Progress.Loaded as Progress

const result = match(currentProgress)
  .with(Progress.None, () => null)
  .with(Progress.Loading, () => "loading")
  .with(Progress.Loaded, () => "loaded")
  .else((_v) => 123)
//       ?^ all variants exhausted, is "unknown" type 👌

console.log({ result })

const result2 = match(currentProgress)
  .with(Progress.None, () => null)
  .else((_v) => 123)
//       ?^ Progress.Loading | Progress.Loaded

console.log({ result2 })
