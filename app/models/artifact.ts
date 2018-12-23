import { Base } from './base.model';
import { Employee } from './employee';
import { Attribute } from './attribute';

export class Artifact extends Base {
    projectId: number;
    parentId: number;
    UID: string;
    status: string;
    effectiveDate: string;
    actualPoints: number;
    expectedPoints: number;
    comments: string;
    filePath: string;
    displaySequence: number;
    user: Employee;
    // To add artifact attribute values serially which is helpful to display in Grid
    [key: string]: any;
    attributes: Attribute[];
}