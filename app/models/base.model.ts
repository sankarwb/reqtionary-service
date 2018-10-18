export class Base {
    id: number;
    orgId: number;
    name: string;
    description: string;
    private _active: boolean;
    set active(value: boolean|number) {
        this._active = !!value;
    }
    get active(): boolean|number {
        return this._active;
    }
    modifiedBy: number;
    modifiedDate: string;
}