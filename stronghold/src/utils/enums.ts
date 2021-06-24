
export type StrEnumValue<T> = T[keyof T]
export type StrEnum<T> = Record<keyof T, string>

export class StrEnumUtils {
  static getValues<T extends StrEnum<T>>(enumType: T): Array<StrEnumValue<T>> {
    return Object.values(enumType)
      .filter((v) => typeof v === 'string')
      .map((v) => v as StrEnumValue<T>)
  }

  static isInEnum<T extends StrEnum<T>>(value: unknown, enumType: T): value is StrEnumValue<T> {
    for (const enumValue of StrEnumUtils.getValues(enumType)) {
      if (enumValue === value) return true
    }

    return false
  }
}
