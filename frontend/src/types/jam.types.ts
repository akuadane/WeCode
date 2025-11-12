export interface CreateJamFromPlanData {
    plan_id: number;
    user_id: string;
    name: string;
    prob_goal_per_day: number;
    start_date: string;
    end_date: string;
    status: string;
    live_call: boolean;
}

export interface JamSnippet {
    _id: string;
    plan_id: string;
    name: string;
    prob_goal_per_day: number;
    start_date: string;
    end_date: string;
    status: string;
    live_call: boolean;
    live_call_url: string | null;
}

export interface JamUser {
    jam_id: number;
    user_id: number;
}

export interface JamProblemUser {
    jam_id: string;
    problem_slug: string;
    user_id: string;
}

export interface Problem {
    slug: string;
    difficulty: string;
    jam_problem_id: number;
    name: string;
    problem_id: number;
    solved_by: { user_id: string, solved_at: string }[];
    tags: string[];
    topic_order: number;
    url: string;
}

export interface Section {
    topic: string;
    problems: Problem[];
}
export interface UserSnippet {
    user_id: number;
    name: string;
}

export interface Jam extends JamSnippet {
    sections: Section[];
    plan_id: string;
} 