const ORE_TICKER = '$ORE'
const STRN_TICKER = '$STRN'
const ORE_TO_STRN = 100000000
export const MINIMUM_STRN_AMOUNT = 1 / ORE_TO_STRN
const FLOAT = ORE_TO_STRN.toString().length - 1

export const isValidAmount = (amount: number): boolean => {
  return amount >= MINIMUM_STRN_AMOUNT
}

export const strnToOre = (amount: number): number => {
  const strn = amount * ORE_TO_STRN

  const pow = Math.pow(10, 0)
  return Math.round(strn * pow) / pow
}

export const oreToStrn = (amount: number): number => {
  return amount / ORE_TO_Strn
}

/*
 * Return a string with the format $STRN X.XXXXXXXX ($ORE X^8)
 */
export const displayStrnAmountWithCurrency = (amount: number, displayOre: boolean): string => {
  let strn = `${STRN_TICKER} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: FLOAT,
    maximumFractionDigits: FLOAT,
  })}`

  if (displayOre) {
    strn += ` (${ORE_TICKER} ${strnToOre(amount).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })})`
  }

  return strn
}
