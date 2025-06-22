import { useParams } from "react-router-dom";
import type { Jam } from "../types/jam.types";
import jamService from "../services/jam.service";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
import Section from "../components/Section/Section";

function JamPage() {
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [jam, setJam] = useState<Jam | null>(null);
    useEffect(() => {
        const fetchJam = async () => {
            const response = await jamService.getJam(id as string);
            setJam(response as any);
            setLoading(false);
            console.log(jam);
        }
        fetchJam();
    }, [id, loading]);

    
    if (!jam) {
        return <div>Loading...</div>;
    }
    
    const totalProblems = jam.sections.reduce((acc, s) => acc + s.problems.length, 0);
    const solvedProblems = jam.sections.reduce((acc, s) => {
        return acc + s.problems.filter(p => p.solved_by?.length > 0).length;
    }, 0);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">{jam.name}</div>
                        <p>{solvedProblems} / {totalProblems}</p>
                    </div>
                    <Progress value={(solvedProblems / totalProblems) * 100} />
                </CardHeader>
                <CardBody>
                    {jam.sections.map((section) => (
                        <Section key={section.topic} section={section} reload={() => setLoading(true)} />
                    ))}
                  
                </CardBody>
            </Card>
        </div>
    )
}

export default JamPage;