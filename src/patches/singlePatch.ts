import { PatchAction } from './PatchActions.js'

export default class SinglePatch {
  constructor(
    public action: PatchAction,
    public data: any
  ) {}
}
