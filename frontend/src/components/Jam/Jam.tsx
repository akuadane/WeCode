import {Card, CardHeader, CardBody, Divider, Avatar, AvatarGroup} from "@heroui/react";
import type { JamSnippet } from "../../types/jam.types";
import { useNavigate } from "react-router-dom";

export default function Jam(jam: JamSnippet) {
  
    // const MAX_AVATAR_LEN = 2;
    const navigate = useNavigate();

  return (
    <Card isHoverable isPressable className="max-w-[400px] p-2 mb-5 mr-5 w-50 border-none bg-background/60 dark:bg-default-100/50" onClick={() => navigate(`/jam/${jam._id}`)}>
      <CardHeader className="flex gap-3">
       
        <div className="flex flex-col">
          <p className="text-md">{jam.name}</p>

        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>This is an ongoing jam</p>
      </CardBody>
      <div className="flex justify-end px-4 pb-2">
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
