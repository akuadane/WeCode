import {Card, CardHeader, CardBody, Divider, Chip} from "@heroui/react";
import type { JamSnippet } from "../../types/jam.types";
import { useNavigate } from "react-router-dom";

export default function Jam(jam: JamSnippet) {
  
    // const MAX_AVATAR_LEN = 2;
    const navigate = useNavigate();

  return (
    <Card 
      isHoverable 
      isPressable 
      className="max-w-[400px] p-0 w-50 border border-gray-200 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-200" 
      onClick={() => navigate(`/jam/${jam._id}`)}
    >
      <div className="h-1 bg-gradient-to-r from-blue-200 to-blue-300 rounded-t-lg"></div>
      <CardHeader className="flex gap-3 pt-4 pb-2">
        <div className="flex flex-col flex-1">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{jam.name}</p>
        </div>
      </CardHeader>
      <Divider className="bg-gray-200" />
      <CardBody className="pt-4 pb-4">
        <div className="flex items-center gap-2">
          <Chip 
            size="sm" 
            variant="flat" 
            className="bg-blue-50/80 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50"
          >
            Active
          </Chip>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ongoing jam session</p>
        </div>
      </CardBody>
      <div className="flex justify-end px-4 pb-3">
     {/* <AvatarGroup size="sm" isBordered max={MAX_AVATAR_LEN}>
      {jam.users.map((user) => (
        <>
        <Avatar name={user}  size="sm" />
       
        </>
      ))}
  </AvatarGroup> */}
  </div>
    </Card>
  );
}
