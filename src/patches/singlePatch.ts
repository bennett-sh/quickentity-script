import { PatchAction } from './patchActions.js'

export default class SinglePatch {
  constructor(
    public action: PatchAction,
    public data: any
  ) {}
}
