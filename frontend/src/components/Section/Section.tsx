import { Divider } from "@heroui/react";
import type { JamUser, Section as SectionType } from "../../types/jam.types";
import Problem from "../Problem/Problem";

export default function Section({ section, index, jam_id, reload, hideTags, hideSection, users }: { section: SectionType, index: number, jam_id: string, reload: () => void, hideTags: boolean, hideSection: boolean, users: JamUser[] }) {
    return (
        <div className="mb-8 pl-2 pr-2 pt-2 mt-4  bg-default-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{ hideSection ? "Section "+ (index + 1) : section.topic}</h2>
            <div className="flex flex-col gap-2">
                {section.problems.map((problem) => (
                    <>
                        <Problem key={problem.jam_problem_id} users={users} problem={problem} jam_id={jam_id} reload={reload} hideTags={hideTags}  />
                        <Divider  />
                    </>
                ))}
            </div>
        </div>
    );
} 