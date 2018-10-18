import { Base } from './base.model';

export class Project extends Base {
    appId: number;
    statusId: number;
    releaseId: number;
    pcode: string;
    type: number;
    productionDate: Date;
    startDate: Date;
    endDate: Date;
}