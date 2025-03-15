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
  .exhaustive()

console.log({ result })
