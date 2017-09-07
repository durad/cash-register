
export class Helper {
    static repeat(ch: string, width: number): string {
        let p = [];
        for (let i = 0; i < width; i++) {
            p.push(ch);
        }

        return p.join('');
    }

    static padRight(s: string, width: number): string {
        if (s.length >= width) {
            return s.substring(0, width);
        }

        return s + this.repeat(' ', width - s.length);
    }

    static padLeft(s: string, width: number): string {
        if (s.length >= width) {
            return s.substring(0, width);
        }

        return this.repeat(' ', width - s.length) + s;
    }

    static formatMoney(amount: number): string {
        return `${amount < 0 ? '(' : ''}$${Math.abs(amount).toFixed(2)}${amount < 0 ? ')' : ''}`;
    }
}
