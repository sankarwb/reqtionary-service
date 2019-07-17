import { Base } from "./base.model";

export class Project extends Base {
    public appId: number;
    public statusId: number;
    public releaseId: number;
    public pcode: string;
    public type: number;
    public productionDate: Date;
    public startDate: Date;
    public endDate: Date;
    public expected: number;
    public actual: number;
}
