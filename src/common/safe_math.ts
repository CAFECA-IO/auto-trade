import BigNumber from 'bignumber.js';

export class SafeMath {
  static isNumber(str: string | number) {
    try {
      if (typeof str !== 'string' && typeof str !== 'number') {
        return false;
      }

      const numReg = /^(([1-9]\d*)|([0]{1}))(\.\d+)?$/;
      return numReg.test(str.toString());
    } catch (error) {
      return false;
    }
  }
  /**
   * check is hex number string
   * @param {string} str
   * @returns {boolean}
   */
  static isHex(str: string): boolean {
    const reg = /^(0x)?[a-fA-F0-9]*$/;
    return reg.test(str);
  }

  static toBn(input: string | number): BigNumber {
    let bnInput: BigNumber;
    if (
      typeof input === 'string' &&
      !SafeMath.isNumber(input) &&
      SafeMath.isHex(input)
    ) {
      bnInput = new BigNumber(input, 16);
    } else {
      bnInput = new BigNumber(input);
    }
    return bnInput;
  }

  static toSmallestUnit(amount: string | number, decimals: number): number {
    const bnAmount = SafeMath.toBn(amount);
    const bnBase = SafeMath.toBn(10);
    const bnDecimal = bnBase.exponentiatedBy(decimals);
    const smallestUint = parseInt(bnAmount.multipliedBy(bnDecimal).toFixed());
    return smallestUint;
  }
}
