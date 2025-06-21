import { useEffect, useState } from "react";
import jamService from "../../services/jam.service";
import type { JamSnippet } from "../../types/jam.types";
import Jam from "../Jam/Jam";


function Jams() {
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
        <div>
            <h1>Jams</h1>
            {jams.map((jam) => (
                <Jam key={jam.jam_id} {...jam} />
            ))}
        </div>
    )
}

export default Jams;