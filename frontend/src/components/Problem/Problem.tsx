import {  Avatar, AvatarGroup, Badge, Button, Checkbox, Chip } from "@heroui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { Problem as ProblemType, UserSnippet } from "../../types/jam.types";
import { GlobalConstants } from "../../assets/GlobalConstants";
import jamService from "../../services/jam.service";
import { useState } from "react";


const difficultyMap: { [key: number]: {text: string, color: any} } = {
    1: { text: "Easy", color: "success" },
    2: { text: "Medium", color: "warning" },
    3: { text: "Hard", color: "danger" },
};


export default function Problem({ problem, reload, members , hideTags}: { problem: ProblemType, reload: () => void, members: any, hideTags: boolean }) {
    const [solved, setSolved] = useState(problem.solved_by?.length > 0 && problem.solved_by?.includes(GlobalConstants.USER_ID));
    return (

  <div className="flex items-center justify-between p-4 rounded-lg hover:bg-default-100/50">
            <Checkbox color="success"  isSelected={solved} onValueChange={()=>{
                if (solved) {
                    jamService.markProblemUnsolved({jam_problem_id: problem.jam_problem_id, user_id: GlobalConstants.USER_ID});
                } else {
                    jamService.markProblemSolved({jam_problem_id: problem.jam_problem_id, user_id: GlobalConstants.USER_ID});
                }
                reload();
                setSolved(!solved);
            }} >
                
                </Checkbox>

                <div className="w-full" >
                    <a href={problem.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-2">
                    <p className="font-semibold">{problem.name}</p>
                    <p className="text-sm text-gray-500">{problem.solved_by?.length>0? '| ': ''}</p>
                    <AvatarGroup className="flex gap-3 items-center">
                        {members.map((user: UserSnippet) => (
                        problem.solved_by?.includes(user.user_id) ? (
                          <Badge  key={user.user_id}  variant="faded" size="sm" shape="circle" isInvisible={!problem.solved_by?.includes(user.user_id)} showOutline={false} content={<CheckCircleIcon className="w-4 h-4 text-green-500" />}>
                             <Avatar  size="sm"  key={user.user_id} name={user.name}  />
                          </Badge>
                        ) : <></>
                    
                        ))}
                    </AvatarGroup>
                    </div>
                    {!hideTags && <div className=" gap-2 mt-1">
                        {problem.tags.map(tag => (
                            <Chip className="mr-1" key={tag} variant="flat" color="default">{tag}</Chip> 
                        ))}
                    </div>}
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