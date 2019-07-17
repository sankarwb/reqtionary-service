import { Base } from "./base.model";

export class Application extends Base {
    public orgId: number;
    public divId: number;
    public appGroupId: number;
    public comments: string;
}
