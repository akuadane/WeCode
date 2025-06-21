import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import type { JamSnippet } from "../../types/jam.types";

export default function Jam(jam: JamSnippet) {
    console.log("jam", jam.name);
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
       
        <div className="flex flex-col">
          <p className="text-md">{jam.name}</p>

        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui">
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
  );
}
