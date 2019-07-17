import { ArtifactAttribute } from "./artifact-attribute";
import { Base } from "./base.model";
import { Employee } from "./employee";

export class Artifact extends Base {
    public applicationId: number;
    public projectId: number;
    public requirementTypeId: number;
    public parentId: number;
    public UID: string;
    public version: number;
    public status: string;
    public effectiveDate: string;
    public actualPoints: number;
    public expectedPoints: number;
    public comments: string;
    public filePath: string;
    public displaySequence: number;
    public user: Employee;
    // To add artifact attribute values serially which is helpful to display in Grid
    [key: string]: any;
    public attributes: ArtifactAttribute[];
    public associations: Artifact[];
}
