import { Base } from './base.model';

export class Application extends Base {
    orgId: number;
    divId: number;
    appGroupId: number;
    comments: string;
}