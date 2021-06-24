import { ValueTransformer } from 'typeorm'

export const bigint: ValueTransformer = {
  to: (entityValue: number) => entityValue,
  from: (databaseValue: string): number => parseInt(databaseValue, 10),
}

export const timestamp: ValueTransformer = {
  to: (entityValue: number) => {
    return new Date(entityValue).toISOString()
  },
  from: (databaseValue: string): number => new Date(databaseValue).getTime(),
}
