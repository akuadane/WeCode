import {Card, CardHeader, CardBody, Divider, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input} from "@heroui/react";
import type { PlanSnippet, Plan } from "../../types/plan.types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import planService from "../../services/plan.service";
import jamService from "../../services/jam.service";
import type { CreateJamFromPlanData } from "../../types/jam.types";
import { GlobalConstants } from "../../assets/GlobalConstants";

export default function Plan(plan: PlanSnippet) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [goalPerDay, setGoalPerDay] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [jamName, setJamName] = useState<string>(plan.name);
    const [totalProblems, setTotalProblems] = useState<number>(0);
    const [endDate, setEndDate] = useState<string>("");

    const handleOpen = async () => {
        setIsOpen(true);
        // Fetch full plan to get total problems
        try {
            const fullPlan = await planService.getPlan(plan.slug) as { plan: Plan };
            const total = fullPlan.plan.problems.reduce((acc, group) => acc + group.problems.length, 0);
            setTotalProblems(total);
        } catch (error) {
            console.error("Error fetching plan details:", error);
        }
    };

    const calculateEndDate = (start: string, goal: number) => {
        console.log('Calculating end date');
        if (!start || !goal || goal <= 0 || totalProblems === 0) return "";
        
        const startDateObj = new Date(start);
        const daysNeeded = Math.ceil(totalProblems / goal);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(endDateObj.getDate() + daysNeeded - 1); // -1 because start date is day 1
        
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
        if (!goalPerDay || !startDate) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            // Fetch full plan to get sections
            const fullPlan = await planService.getPlan(plan.slug) as { plan: Plan };
            
            // Transform plan problems into sections format
            const sections = fullPlan.plan.problems.map((group) => ({
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

            // TODO: Get user_id from auth context/session
            // const user_id = 1; // Placeholder - should come from auth
            
            const jamData: CreateJamFromPlanData = {
                plan_id: plan._id as any, // MongoDB ObjectId string
                user_id: GlobalConstants.USER_ID as string,
                name: jamName || plan.name,
                prob_goal_per_day: parseInt(goalPerDay),
                start_date: new Date(startDate).toISOString(),
                end_date: new Date(endDate).toISOString(),
                status: "active" as any, // Backend expects string, but type says number
                live_call: false
            };

            // Add sections to the request body (backend expects it)
            const requestData = {
                ...jamData,
                sections: sections
            };

            await jamService.createFromPlan(requestData as any);
            setIsOpen(false);
            // Reset form
            setGoalPerDay("");
            setStartDate("");
            setJamName(plan.name);
            setEndDate("");
            // Optionally refresh the page or show success message
            window.location.reload();
        } catch (error) {
            console.error("Error creating jam:", error);
            alert("Failed to create jam. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card 
                isHoverable 
                isPressable 
                className="max-w-[400px] p-2 w-50 border-none bg-background/60 dark:bg-default-100/50 relative"
                onPress={() => navigate(`/plan/${plan.slug}`)}
            >
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col flex-1">
                        <p className="text-md">{plan.name}</p>
                    </div>
                    <div 
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            isIconOnly
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={handleOpen}
                        >
                            +
                        </Button>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <p className="text-sm text-gray-500">{plan.source}</p>
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
                        <Button color="primary" onPress={handleCreateJam} isLoading={loading}>
                            Create Jam
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

