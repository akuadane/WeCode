import { useParams } from "react-router-dom";
import type { Jam } from "../types/jam.types";
import jamService from "../services/jam.service";
import { useEffect, useState } from "react";
import { Avatar, Button, Card, CardBody, Checkbox, Input, Link, Progress } from "@heroui/react";
import Section from "../components/Section/Section";
import { GlobalConstants } from "../assets/GlobalConstants";


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

    const handleRemoveMember = async (userId: string) => {
        console.log('userId', userId);
        console.log('GlobalConstants.USER_ID', GlobalConstants.USER_ID);
        if (userId === GlobalConstants.USER_ID as string) {
            alert("You cannot remove yourself from the jam.");
            return;
        }
        if (!jam?._id) {
            return;
        }

        try {
            await jamService.removeUser({
                jam_id: jam._id,
                user_id: userId,
            });
            setLoading(true);
        } catch (error: any) {
            console.error("Failed to remove user:", error);
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
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Card className="border border-gray-200 bg-white dark:bg-gray-800 shadow-md">
                <div className="h-1 bg-gradient-to-r from-blue-200 to-blue-300 rounded-t-lg"></div>
                <div className="flex justify-between items-top">
                    <div className="flex-col gap-4 p-6 w-3/4">
                        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{jam.name}</h2>
                        
                        <div className="flex items-center gap-4 mb-4">
                            <Progress className="flex-1" value={(solvedProblems / totalProblems) * 100} />
                            <p className="flex-shrink-0 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">{solvedProblems} / {totalProblems} solved</p>
                        </div>
                        <div className="flex justify-start mb-4 gap-2">
                            {jam.users.map((member) => (
                                <div key={member._id} className="relative group">
                                    <Avatar name={member.name} />
                                    {member._id !== GlobalConstants.USER_ID as string && (
                                    <button 
                                            onClick={() => handleRemoveMember(member._id)}
                                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                                            aria-label="Remove member"
                                        >
                                            <span className="text-white text-xs font-bold leading-none">×</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-start gap-4">
                                <Checkbox isSelected={hideTags} onValueChange={() => setHideTags(!hideTags)} size="sm" color="primary" className="text-gray-700 dark:text-gray-300"> Hide tags</Checkbox>
                                <Checkbox isSelected={hideSection} onValueChange={() => setHideSection(!hideSection)} size="sm" color="primary" className="text-gray-700 dark:text-gray-300"> Hide Section</Checkbox>
                        </div>
                    </div>
                    <div className="flex flex-col justify-left gap-4 p-6">
                        {LiveJamUrl ? (
                            <Link color="danger" showAnchorIcon={true} href={LiveJamUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                               Live Jam
                            </Link>
                        ) : (
                            <Button color="primary" variant="flat" size="sm" className="mr-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50" onPress={handleCreateLiveJam}>
                                Create Live Jam
                            </Button>
                        )}

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add user to this jam</h3>
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
                                    className="bg-blue-400 hover:bg-blue-500 text-white"
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
                <CardBody className="pt-4">
                    {jam.sections.map((section, index) => (
                        <Section key={section.topic} section={section} users={jam.users} index={index} jam_id={jam._id} reload={() => setLoading(true)} hideTags={hideTags} hideSection={hideSection} />
                    ))}
                </CardBody>
            </Card>
        </div>
    )
}

export default JamPage;