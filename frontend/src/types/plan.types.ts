export interface PlanSnippet {
    _id: string;
    slug: string;
    name: string;
    source: string;
    source_link: string;
}

export interface Problem {
    _id: string;
    slug: string;
    name: string;
    difficulty: string;
    url: string;
    tags: string[];
}

export interface ProblemGroup {
    _id: string;
    name: string;
    size: number;
    problems: Problem[];
}

export interface Plan extends PlanSnippet {
    problems: ProblemGroup[];
}

