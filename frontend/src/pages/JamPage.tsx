import { useParams } from "react-router-dom";
import type { Jam } from "../types/jam.types";
import jamService from "../services/jam.service";
import { useEffect, useState } from "react";
import { Avatar, AvatarGroup, Button, Card, CardBody, Checkbox, Input, Link, Progress } from "@heroui/react";
import Section from "../components/Section/Section";
import { UserPlusIcon } from "@heroicons/react/16/solid";


function JamPage() {
    const [loading, setLoading] = useState(true);
    const [hideTags, setHideTags] = useState(true);
    const [hideSection, setHideSection] = useState(false);
    const [LiveJamUrl, setLiveJamUrl] = useState<string | null>(null);
    const {id} = useParams();
    const [jam, setJam] = useState<Jam | null>(null);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [addMemberError, setAddMemberError] = useState<string | null>(null);
    const [addMemberMessage, setAddMemberMessage] = useState<string | null>(null);
    useEffect(() => {
        const fetchJam = async () => {
            const response = await jamService.getJam(id as string);
            setJam(response as Jam);
            setLoading(false);
            setLiveJamUrl((response as Jam)?.live_call_url ?? null);
        }
        fetchJam();
    }, [id, loading]);

    const handleCreateLiveJam = async () => {
        const response = await jamService.createLiveJam(jam?._id.toString() as string) as { live_call_url: string };
        setLiveJamUrl(response.live_call_url);
    }

    const handleAddMember = async () => {
        if (!jam?._id) {
            setAddMemberError("Jam information is missing.");
            return;
        }

        const email = newMemberEmail.trim();
        if (!email) {
            setAddMemberError("Please enter an email address.");
            return;
        }

        try {
            setIsAddingMember(true);
            setAddMemberError(null);
            const response = await jamService.addUser({
                jam_id: jam._id,
                email,
            });
            setAddMemberMessage(response?.message ?? "Invitation sent.");
            setNewMemberEmail("");
            setLoading(true);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Failed to send invitation. Please try again.";
            setAddMemberError(errorMessage);
            setAddMemberMessage(null);
        } finally {
            setIsAddingMember(false);
        }
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
                        
                        <div className="flex items-center gap-4">
                            <Progress className="flex-1" value={(solvedProblems / totalProblems) * 100} />
                            <p className="flex-shrink-0 text-sm font-medium text-gray-500 whitespace-nowrap">{solvedProblems} / {totalProblems} solved</p>
                        </div>
                        <div className="flex justify-start">
                            <AvatarGroup>
                                {jam.users.map((member) => (
                                    <Avatar key={member._id} name={member.name} />
                                ))}
                            </AvatarGroup>
                          
                        </div>
                        <div className="flex justify-start">
                                <Checkbox isSelected={hideTags} onValueChange={() => setHideTags(!hideTags)} size="sm" color="primary" className="mr-2"> Hide tags</Checkbox>
                                <Checkbox isSelected={hideSection} onValueChange={() => setHideSection(!hideSection)} size="sm" color="primary" className="mr-2"> Hide Section</Checkbox>
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

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                            <h3 className="text-sm font-semibold text-gray-700">Add user to this jam</h3>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <Input
                                    type="email"
                                    label="Email address"
                                    placeholder="jammer@example.com"
                                    value={newMemberEmail}
                                    onValueChange={(value) => {
                                        setNewMemberEmail(value);
                                        if (addMemberError) setAddMemberError(null);
                                        if (addMemberMessage) setAddMemberMessage(null);
                                    }}
                                    labelPlacement="outside"
                                    className="sm:max-w-xs"
                                />
                                <Button
                                    color="primary"
                                    onPress={handleAddMember}
                                    isLoading={isAddingMember}
                                    isDisabled={isAddingMember || newMemberEmail.trim().length === 0}
                                >
                                    Add user
                                </Button>
                            </div>
                            {addMemberError && (
                                <p className="text-sm text-red-500">{addMemberError}</p>
                            )}
                            {addMemberMessage && (
                                <p className="text-sm text-green-600">{addMemberMessage}</p>
                            )}
                        </div>
                    </div>
                 </div>
                <CardBody>
                    {jam.sections.map((section, index) => (
                        <Section key={section.topic} section={section} users={jam.users} index={index} jam_id={jam._id} reload={() => setLoading(true)} hideTags={hideTags} hideSection={hideSection} />
                    ))}
                </CardBody>
            </Card>
        </div>
    )
}

export default JamPage;