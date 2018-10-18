import { Base } from './base.model';

export class Artifact extends Base {
    parentArtifactId: number;
    status: string;
    comments: string;
}