import { displayIronAmountWithCurrency, isValidAmount, oreToIron, ironToOre } from './currency'

describe('Currency utils', () => {
  test('displayStrnAmountWithCurrency returns the right string', () => {
    expect(displayStrnAmountWithCurrency(0.00000002, true)).toEqual('$strn 0.00000002 ($ORE 2)')
    expect(displayStrnAmountWithCurrency(0.0000001, true)).toEqual('$strn 0.00000010 ($ORE 10)')
    expect(displayStrnAmountWithCurrency(0, true)).toEqual('$strn 0.00000000 ($ORE 0)')
    expect(displayStrnAmountWithCurrency(1, true)).toEqual(
      '$strn 1.00000000 ($ORE 100,000,000)',
    )
    expect(displayIronAmountWithCurrency(100, true)).toEqual(
      '$strn 100.00000000 ($ORE 10,000,000,000)',
    )
    expect(displayIronAmountWithCurrency(100, false)).toEqual('$strn 100.00000000')
  })

  test('isValidAmount returns the right value', () => {
    expect(isValidAmount(0.0000000000001)).toBe(false)
    expect(isValidAmount(0.00000001)).toBe(true)
    expect(isValidAmount(10.000001)).toBe(true)
  })

  test('oreToIron returns the right value', () => {
    expect(oreToStrn(2394)).toBe(0.00002394)
    expect(oreToStrn(999)).toBe(0.00000999)
  })

  test('ironToOre returns the right value', () => {
    expect(strnToOre(0.00002394)).toBe(2394)
    expect(strnToOre(0.00000999)).toBe(999)
  })
})
