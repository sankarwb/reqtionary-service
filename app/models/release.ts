import { Project } from "./project";

export class Release extends Project {
    public type: number;
    public projects: Project[];
}
