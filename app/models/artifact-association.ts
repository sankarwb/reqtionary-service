import { Artifact } from "./artifact";

export class ArtifactAssociation extends Artifact {
    public artifactAssociationId: number;
    public primaryArtifactId: number;
    public secondaryArtifactId: string;
}
