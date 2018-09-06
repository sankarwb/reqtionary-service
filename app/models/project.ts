import { Base } from './base.model';

export class Project extends Base {
    appId: number;
    statusId: number;
    releaseId: number;
    pcode: string;
    private _type: boolean;
    set type(value: boolean|number) {
        this._type = !!value;
    }
    get type(): boolean|number {
        return this._type;
    }
    productionDate: Date;
    startDate: Date;
    endDate: Date;
}