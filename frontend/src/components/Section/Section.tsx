import { Divider } from "@heroui/react";
import type { Section as SectionType, UserSnippet } from "../../types/jam.types";
import Problem from "../Problem/Problem";

export default function Section({ section, index, reload, members, hideTags, hideSection }: { section: SectionType, index: number, reload: () => void, members: UserSnippet[], hideTags: boolean, hideSection: boolean }) {
    return (
        <div className="mb-8 pl-2 pr-2 pt-2 mt-4  bg-default-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{ hideSection ? "Section "+ (index + 1) : section.topic}</h2>
            <div className="flex flex-col gap-2">
                {section.problems.map((problem) => (
                    <>
                        <Problem key={problem.jam_problem_id} problem={problem} reload={reload} members={members} hideTags={hideTags}  />
                        <Divider  />
                    </>
                ))}
            </div>
        </div>
    );
} 