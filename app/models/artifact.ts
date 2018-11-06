import { Base } from './base.model';
import { Employee } from './employee';

export class Artifact extends Base {
    parentArtifactId: number;
    UID: string;
    status: string;
    actualPoints: number;
    expectedPoints: number;
    comments: string;
    user: Employee;
    // To add artifact attribute values serially which is helpful to display in Grid
    [key: string]: any;
}