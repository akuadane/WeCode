import { useParams } from "react-router-dom";
import type { Jam } from "../types/jam.types";
import jamService from "../services/jam.service";
import { useEffect, useState } from "react";
import { Avatar, AvatarGroup, Button, Card, CardBody, Link, Progress } from "@heroui/react";
import Section from "../components/Section/Section";

function JamPage() {
    const [loading, setLoading] = useState(true);
    const [LiveJamUrl, setLiveJamUrl] = useState<string | null>(null);
    const {id} = useParams();
    const [jam, setJam] = useState<Jam | null>(null);
    useEffect(() => {
        const fetchJam = async () => {
            const response = await jamService.getJam(id as string);
            setJam(response as Jam);
            setLoading(false);
            setLiveJamUrl(jam?.live_call_url as string);
            console.log(jam);
        }
        fetchJam();
    }, [id, loading]);

    const handleCreateLiveJam = async () => {
        const response = await jamService.createLiveJam(jam?.jam_id.toString() as string) as { live_call_url: string };
        setLiveJamUrl(response.live_call_url);
    }
    
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
                <div className="flex justify-between items-top">
                    <div className="flex-col gap-4 p-4 w-3/4">
                        <h2 className="text-2xl font-bold">{jam.name}</h2>
                       {jam.plan_source && (
                        <p className="text-sm text-gray-500">Forked from: <Link showAnchorIcon={true} href={jam.plan_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{jam.plan_name}</Link></p>
                       )}
                        
                        <div className="flex items-center gap-4">
                            <Progress className="flex-1" value={(solvedProblems / totalProblems) * 100} />
                            <p className="flex-shrink-0 text-sm font-medium text-gray-500 whitespace-nowrap">{solvedProblems} / {totalProblems} solved</p>
                        </div>
                        <div className="flex justify-start">
                            <AvatarGroup>
                                {jam.members.map((member) => (
                                    <Avatar key={member.user_id} name={member.name} />
                                ))}
                            </AvatarGroup>
                        </div>
                    </div>
                    <div className="flex flex-col justify-left gap-4 p-6">
                        {LiveJamUrl ? (
                            <Link color="danger" showAnchorIcon={true} href={LiveJamUrl} target="_blank" rel="noopener noreferrer">
                               Live Jam
                            </Link>
                        ) : (
                            <Button color="primary" variant="flat" size="sm" className="mr-2" onPress={handleCreateLiveJam}>
                                Create Live Jam
                            </Button>
                        )}

                        <Button color="primary" variant="flat" size="sm" className="mr-2" > Add Jammer</Button>
                    </div>
                 </div>
                <CardBody>
                    {jam.sections.map((section) => (
                        <Section key={section.topic} section={section} reload={() => setLoading(true)} members={jam.members} />
                    ))}
                </CardBody>
            </Card>
        </div>
    )
}

export default JamPage;