import { Project } from './project';

export class Release extends Project {
    type: number;
    projects: Project[];
}