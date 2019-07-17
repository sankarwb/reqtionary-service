import { Base } from "./base.model";

export class Attribute extends Base {
    public appObjectAttributeId: number;
    public value: string;
    public type: string;
    public system: number;
    public status: number;
    public values: string[];
}
