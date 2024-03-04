export default class Stats {
    private delays: number[];
    public readonly delaysLength: number;

    constructor(delaysLength: number) {
        this.delays = [];
        this.delaysLength = delaysLength;
    }

    public update(deltaTime: number): void {
        this.delays.push(deltaTime);
        if (this.delays.length == this.delaysLength) {
            this.delays.splice(0, 1);
        }
    }

    public getLastMs(): number {
        const res = this.delays.at(-1);
        return res ? res : -1;
    }

    public getAvgMs(): number {
        return this.delays.length ? this.delays.reduce((a, b) => a + b) / this.delays.length : 0;
    }
}
