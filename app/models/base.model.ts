export class Base {
    set active(value: boolean|number) {
        this._active = !!value;
    }
    get active(): boolean|number {
        return this._active;
    }
    public id: number;
    public orgId: number;
    public name: string;
    public description: string;
    public modifiedBy: number;
    public modifiedDate: string;
    private _active: boolean;
}
