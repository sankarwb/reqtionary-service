import { Base } from "./base.model";

export class ArtifactAssociation extends Base {
    UID: string;
    color: string;
    status: AssociationStatus;
}

export enum AssociationStatus {
    NEW = 'new',
    DELETE = 'delete',
    SAVED = 'saved'
}
