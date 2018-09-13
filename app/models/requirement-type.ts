import { Base } from './base.model';

export class RequirementType extends Base {
    parentId: number;
    system: number;
    code: string;
    color: string;
    seqnum: number;
    type: number;
}