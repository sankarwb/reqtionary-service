export class Base {
    set active(value: boolean|number) {
        this._active = !!value;
    }
    get active(): boolean|number {
        return this._active;
    }
    id: number;
    orgId: number;
    name: string;
    description: string;
    modifiedBy: number;
    modifiedDate: string;
    private _active: boolean;
}
