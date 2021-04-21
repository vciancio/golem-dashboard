/** ETH Addresses are really long, need to shorten. */
function wallet(ethAddr: string): string {
    return [
        ethAddr.substring(0, 6),
        ethAddr.substring(ethAddr.length - 5, ethAddr.length)
    ].join('...')
}

/** Balances are really long, need to shorten. */
function balance(balance: number, decimals = 7) {
    if (decimals > decimalPlaces(balance)) {
        return balance
    }

    const mod = Math.pow(10, decimals)
    let friendlyBalance = balance == null ?
        "unknown" :
        Math.floor(balance * mod) / mod

    if (typeof friendlyBalance !== 'string') {
        friendlyBalance = friendlyBalance.toString() + '...'
    }
    return friendlyBalance
}

function decimalPlaces(num: number) {
    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
        // Adjust for scientific notation.
        - (match[2] ? +match[2] : 0));
}

const PaymentFormat = {
    wallet, balance
}
export default PaymentFormat