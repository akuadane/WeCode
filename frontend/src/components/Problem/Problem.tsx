import {  Button, Chip } from "@heroui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { Problem as ProblemType } from "../../types/jam.types";
import { GlobalConstants } from "../../assets/GlobalConstants";
import jamService from "../../services/jam.service";

const difficultyMap: { [key: number]: {text: string, color: any} } = {
    1: { text: "Easy", color: "success" },
    2: { text: "Medium", color: "warning" },
    3: { text: "Hard", color: "danger" },
};

export default function Problem({ problem, reload }: { problem: ProblemType, reload: () => void }) {
    const solved = problem.solved_by?.length > 0 && problem.solved_by?.includes(GlobalConstants.USER_ID);
    return (

  <div className="flex items-center justify-between p-4 rounded-lg hover:bg-default-100/50">
            <Button isIconOnly variant="light" className="p-0" onPress={()=>{
                if (solved) {
                    jamService.markProblemUnsolved({jam_problem_id: problem.jam_problem_id, user_id: GlobalConstants.USER_ID});
                } else {
                    jamService.markProblemSolved({jam_problem_id: problem.jam_problem_id, user_id: GlobalConstants.USER_ID});
                }
                reload();
            }} >
                {solved ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                )}
                </Button>

                <div className="w-full" >
                    <a href={problem.url} target="_blank" rel="noopener noreferrer">
                    <p className="font-semibold">{problem.name}</p>
                    <div className=" gap-2 mt-1">
                        {problem.tags.map(tag => (
                            <Chip className="mr-1" key={tag} variant="flat" color="default">{tag}</Chip> 
                        ))}
                    </div>
                    </a>
                </div>
            
            <div className="flex items-center gap-4">
                <Chip  color={difficultyMap[problem.difficulty]?.color || "default"}>
                    {difficultyMap[problem.difficulty]?.text || "Unknown"}
                </Chip>
            </div>
        </div>
   
      
    );
} 