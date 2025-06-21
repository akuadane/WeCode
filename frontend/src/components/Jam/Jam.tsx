import {Card, CardHeader, CardBody, Divider, Avatar, AvatarGroup} from "@heroui/react";
import type { JamSnippet } from "../../types/jam.types";
import "./Jam.css";

export default function Jam(jam: JamSnippet) {
    console.log("jam", jam.users);
    jam.users.push("John Doe");
    jam.users.push("Smith Jogn")
    const MAX_AVATAR_LEN = 2;
    
  return (
    <Card className="max-w-[400px] p-2 m-4 w-50">
      <CardHeader className="flex gap-3">
       
        <div className="flex flex-col">
          <p className="text-md">{jam.name}</p>

        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
     <AvatarGroup size="sm" isBordered max={MAX_AVATAR_LEN} total={jam.users.length} className="flex justify-end">
      {jam.users.map((user) => (
        <>
        <Avatar name={user}  size="sm" />
       
        </>
      ))}
  </AvatarGroup>
     
    </Card>
  );
}
