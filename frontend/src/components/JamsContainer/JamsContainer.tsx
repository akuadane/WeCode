import { useEffect, useState } from "react";
import jamService from "../../services/jam.service";
import type { JamSnippet } from "../../types/jam.types";
import Jam from "../Jam/Jam";

import {Card, CardBody, CardHeader} from "@heroui/react";



function JamsContainer() {
    const [jams, setJams] = useState< JamSnippet[]>([]);

   useEffect(() => {
    const fetchJams = async () => {
        const data = await jamService.getOngoingJams();
        setJams(data as any);
    }
    fetchJams();
}, []);

    console.log("jams", jams);

    return (
        <Card className="shadow-none">
            <CardHeader className="text-xl font-bold"> Ongoing Jams</CardHeader>
      <CardBody>
      {jams.map((jam) => (
                <Jam key={jam.jam_id} {...jam} />
            ))}
      </CardBody>
    </Card>
       
    )
}

export default JamsContainer;