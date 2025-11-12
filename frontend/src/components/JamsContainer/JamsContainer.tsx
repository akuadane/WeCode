import { useEffect, useState } from "react";
import jamService from "../../services/jam.service";
import type { JamSnippet } from "../../types/jam.types";
import Jam from "../Jam/Jam";

import {Card, CardBody, CardHeader} from "@heroui/react";
import { GlobalConstants } from "../../assets/GlobalConstants";



function JamsContainer() {
    const [jams, setJams] = useState< JamSnippet[]>([]);

   useEffect(() => {
    const fetchJams = async () => {
        const data = await jamService.getOngoingJams(GlobalConstants.USER_ID);
        setJams(data as any);
    }
    fetchJams();
}, []);

    return (
        <Card className="shadow-none">
            <CardHeader className="text-xl font-bold"> Ongoing Jams</CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jams.map((jam) => (
                        <Jam key={jam._id.toString()} {...jam} />
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}

export default JamsContainer;