import { Entity } from './base.js'

declare module './_index.js' {
  interface Entity {
    getConstantInt(value: number): Entity
    getConstantBool(value: boolean): Entity
  }
}
