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