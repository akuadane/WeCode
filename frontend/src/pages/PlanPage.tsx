import { useParams, useNavigate } from "react-router-dom";
import type { Plan } from "../types/plan.types";
import planService from "../services/plan.service";
import { useEffect, useState } from "react";
import { Card, CardBody, Checkbox, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react";
import PlanSection from "../components/PlanSection/PlanSection";
import jamService from "../services/jam.service";
import type { CreateJamFromPlanData } from "../types/jam.types";
import { GlobalConstants } from "../assets/GlobalConstants";

function PlanPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hideTags, setHideTags] = useState(true);
    const [hideSection, setHideSection] = useState(false);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [jamLoading, setJamLoading] = useState(false);
    const [goalPerDay, setGoalPerDay] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [jamName, setJamName] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await planService.getPlan(id as string) as { plan: Plan };
                setPlan(response.plan);
                setJamName(response.plan.name);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching plan:", error);
                setLoading(false);
            }
        };
        fetchPlan();
    }, [id]);

    const calculateEndDate = (start: string, goal: number) => {
        if (!start || !goal || goal <= 0 || !plan) return "";
        
        const totalProblems = plan.problems.reduce((acc, group) => acc + group.problems.length, 0);
        if (totalProblems === 0) return "";
        
        const startDateObj = new Date(start);
        const daysNeeded = Math.ceil(totalProblems / goal);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(endDateObj.getDate() + daysNeeded - 1);
        
        return endDateObj.toISOString().split('T')[0];
    };

    const handleGoalPerDayChange = (value: string) => {
        setGoalPerDay(value);
        if (startDate && value) {
            const calculatedEndDate = calculateEndDate(startDate, parseInt(value));
            setEndDate(calculatedEndDate);
        }
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        if (value && goalPerDay) {
            const calculatedEndDate = calculateEndDate(value, parseInt(goalPerDay));
            setEndDate(calculatedEndDate);
        }
    };

    const handleCreateJam = async () => {
        if (!goalPerDay || !startDate || !plan) {
            alert("Please fill in all required fields");
            return;
        }

        setJamLoading(true);
        try {
            // Transform plan problems into sections format
            const sections = plan.problems.map((group) => ({
                topic: group.name,
                problems: group.problems.map((problem) => ({
                    slug: problem.slug,
                    name: problem.name,
                    difficulty: problem.difficulty,
                    url: problem.url,
                    tags: problem.tags,
                    solved_by: []
                }))
            }));

            const jamData: CreateJamFromPlanData = {
                plan_id: plan._id as any,
                user_id: GlobalConstants.USER_ID as string,
                name: jamName || plan.name,
                prob_goal_per_day: parseInt(goalPerDay),
                start_date: new Date(startDate).toISOString(),
                end_date: new Date(endDate).toISOString(),
                status: "active" as any,
                live_call: false
            };

            const requestData = {
                ...jamData,
                sections: sections
            };

            const response = await jamService.createFromPlan(requestData as any) as any;
            setIsOpen(false);
            // Navigate to the created jam
            if (response.jam_id) {
                navigate(`/jam/${response.jam_id}`);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error creating jam:", error);
            alert("Failed to create jam. Please try again.");
        } finally {
            setJamLoading(false);
        }
    };

    if (loading || !plan) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    const totalProblems = plan.problems.reduce((acc, group) => acc + group.problems.length, 0);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <div className="flex justify-between items-top">
                    <div className="flex-col gap-4 p-4 w-3/4">
                        <h2 className="text-2xl font-bold">{plan.name}</h2>
                        <p className="text-sm text-gray-500">{plan.source}</p>
                        {plan.source_link && (
                            <a href={plan.source_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                View on {plan.source}
                            </a>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                            <p className="text-sm font-medium text-gray-500">
                                {totalProblems} problems in {plan.problems.length} sections
                            </p>
                        </div>
                        <div className="flex justify-start mt-2">
                            <Checkbox 
                                isSelected={hideTags} 
                                onValueChange={() => setHideTags(!hideTags)} 
                                size="sm" 
                                color="primary" 
                                className="mr-2"
                            >
                                Hide tags
                            </Checkbox>
                            <Checkbox 
                                isSelected={hideSection} 
                                onValueChange={() => setHideSection(!hideSection)} 
                                size="sm" 
                                color="primary" 
                                className="mr-2"
                            >
                                Hide Section
                            </Checkbox>
                        </div>
                    </div>
                    <div className="flex flex-col justify-left gap-4 p-6">
                        <Button 
                            color="primary" 
                            variant="solid" 
                            size="md" 
                            onPress={() => setIsOpen(true)}
                        >
                            Create Jam from Plan
                        </Button>
                    </div>
                </div>
                <CardBody>
                    {plan.problems.map((section, index) => (
                        <PlanSection 
                            key={section._id} 
                            section={section} 
                            index={index} 
                            hideTags={hideTags} 
                            hideSection={hideSection} 
                        />
                    ))}
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Create Jam from Plan</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Jam Name"
                            placeholder={plan.name}
                            value={jamName}
                            onValueChange={setJamName}
                            description="Leave empty to use plan name"
                        />
                        <Input
                            type="number"
                            label="Goal Per Day"
                            placeholder="e.g., 5"
                            value={goalPerDay}
                            onValueChange={handleGoalPerDayChange}
                            min="1"
                            isRequired
                        />
                        <Input
                            type="date"
                            label="Start Date"
                            value={startDate}
                            onValueChange={handleStartDateChange}
                            isRequired
                        />
                        {endDate && (
                            <div className="text-sm text-gray-600">
                                <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
                                {totalProblems > 0 && goalPerDay && (
                                    <p className="text-xs text-gray-500">
                                        {totalProblems} problems ÷ {goalPerDay} per day = {Math.ceil(totalProblems / parseInt(goalPerDay))} days
                                    </p>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleCreateJam} isLoading={jamLoading}>
                            Create Jam
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default PlanPage;

