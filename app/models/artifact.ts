import { Base } from './base.model';

export class Artifact extends Base {
    orgId: number;
    parentArtifactId: number;
    comments: string;
}