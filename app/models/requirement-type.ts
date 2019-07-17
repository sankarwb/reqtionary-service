import { Base } from "./base.model";

export class RequirementType extends Base {
    public parentId: number;
    public system: number;
    public code: string;
    public color: string;
    public seqnum: number;
    public type: number;
}
