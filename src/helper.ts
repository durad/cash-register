
/**
 * Helper class used to format string values.
 */
export class Helper {
    /**
     * Repeats a string for a number of times and returns the concatenated value.
     * @param ch String to be repeated.
     * @param width Number of times to be repeated.
     */
    static repeat(ch: string, width: number): string {
        let p = [];
        for (let i = 0; i < width; i++) {
            p.push(ch);
        }

        return p.join('');
    }

    /**
     * Pads a string with spaces to the right until is has a the given length.
     * @param s String to be padded.
     * @param width Target length of the string.
     */
    static padRight(s: string, width: number): string {
        if (s.length >= width) {
            return s.substring(0, width);
        }

        return s + this.repeat(' ', width - s.length);
    }

    /**
     * Pads a string with spaces to the left until is has a the given length.
     * @param s String to be padded.
     * @param width Target length of the string.
     */
    static padLeft(s: string, width: number): string {
        if (s.length >= width) {
            return s.substring(0, width);
        }

        return this.repeat(' ', width - s.length) + s;
    }

    /**
     * Formats a number in a money format. Negative values are displaed in brackets.
     * @param amount Number to be formatted.
     */
    static formatMoney(amount: number): string {
        return `${amount < 0 ? '(' : ''}$${Math.abs(amount).toFixed(2)}${amount < 0 ? ')' : ''}`;
    }
}
