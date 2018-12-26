import { Base } from './base.model';

export class Attribute extends Base {
    value: string;
    type: string;
    system: number;
    status: number;
    values: string[];
}