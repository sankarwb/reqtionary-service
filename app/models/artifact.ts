import { ArtifactAttribute } from "./artifact-attribute";
import { Base } from "./base.model";
import { Employee } from "./employee";
import { ArtifactAssociation } from "./artifact-association";
import { Attachment } from "./attachment";
import { Conversation } from "./conversation";
import { RequirementType } from "./requirement-type";

export class Artifact extends Base {
    applicationId: number;
    projectId: number;
    requirementTypeId: number;
    requirementType: RequirementType;
    parentId: number;
    UID: string;
    version: number;
    status: string;
    effectiveDate: string;
    actualPoints: number;
    expectedPoints: number;
    comments: Conversation[];
    displaySequence: number;
    user: Employee;
    // To add artifact attribute values serially which is helpful to display in Grid
    [key: string]: any;
    attributes: ArtifactAttribute[];
    associations: ArtifactAssociation[];
    attachments: Attachment[];
}
