export interface CreateJamFromPlanData {
    plan_id: number;
    user_id: number;
    name: string;
    prob_goal_per_day: number;
    start_date: string;
    end_date: string;
    status: number;
    live_call: boolean;
}

export interface JamSnippet {
    end_date: string;
    is_admin: boolean;
    jam_id: number;
    live_call: boolean;
    live_call_url: string | null;
    name: string;
    plan_id: number;
    prob_goal_per_day: number;
    start_date: string;
    status: number;
    users: string[];
}

export interface JamUser {
    jam_id: number;
    user_id: number;
}

export interface JamProblemUser {
    jam_problem_id: number;
    user_id: number;
}

export interface Problem {
    difficulty: number;
    jam_problem_id: number;
    name: string;
    problem_id: number;
    solved_by: number[];
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
    members: UserSnippet[];
    plan_name: string;
    plan_id: number;
    plan_source: string;
    plan_url: string;
} 