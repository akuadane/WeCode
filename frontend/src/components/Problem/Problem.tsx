import { Avatar, AvatarGroup, Badge, Checkbox, Chip } from "@heroui/react";
import type { JamUser, Problem as ProblemType } from "../../types/jam.types";
import { GlobalConstants } from "../../assets/GlobalConstants";
import jamService from "../../services/jam.service";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/16/solid";


const difficultyMap: { [key: string]: {text: string, color: any} } = {
    "easy": { text: "EASY", color: "success" },
    "medium": { text: "MEDIUM", color: "warning" },
    "hard": { text: "HARD", color: "danger" },
};


export default function Problem({ problem, jam_id, reload, hideTags, users}: { problem: ProblemType, jam_id: string, reload: () => void, hideTags: boolean, users: JamUser[] }) {
    const [solved, setSolved] = useState(problem.solved_by?.length > 0 && problem.solved_by?.some(solved => solved.user_id === GlobalConstants.USER_ID));
   
    console.log('problem', problem);
    return (

  <div className="flex items-center justify-between p-4 rounded-lg hover:bg-default-100/50">
            <Checkbox color="success"  isSelected={solved} onValueChange={()=>{
                if (solved) {
                    jamService.markProblemUnsolved({jam_id: jam_id, problem_slug: problem.slug, user_id: GlobalConstants.USER_ID as string});
                } else {
                    jamService.markProblemSolved({jam_id: jam_id, problem_slug: problem.slug, user_id: GlobalConstants.USER_ID as string});
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
                        {users.map((user: JamUser) => (
                        problem.solved_by?.some(solved => solved.user_id === user._id) ? (
                          <Badge  key={user._id}  variant="faded" size="sm" shape="circle" isInvisible={!problem.solved_by?.some(solved => solved.user_id === user._id)} showOutline={false} content={<CheckCircleIcon className="w-4 h-4 text-green-500" />}>
                             <Avatar  size="sm"  key={user._id} name={user.name}  />
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
                <Chip  color={difficultyMap[problem.difficulty.toLowerCase()]?.color || "default"}>
                    {difficultyMap[problem.difficulty.toLowerCase()]?.text || "Unknown"}
                </Chip>
            </div>
        </div>
   
      
    );
} 