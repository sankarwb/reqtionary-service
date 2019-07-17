import {Base} from "./base.model";

export class ApplicationAgileStatus extends Base {
    public id: number;
    public statusText: string;
    public order: number;
}
