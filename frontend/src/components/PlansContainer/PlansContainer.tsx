import { useEffect, useState } from "react";
import planService from "../../services/plan.service";
import type { PlanSnippet } from "../../types/plan.types";
import Plan from "../Plan/Plan";

import {Card, CardBody, CardHeader} from "@heroui/react";



function PlansContainer() {
    const [plans, setPlans] = useState<PlanSnippet[]>([]);

    useEffect(() => {
        const fetchPlans = async () => {
            const data = await planService.getPlans();
            setPlans(data as any);
        }
        fetchPlans();
    }, []);

    return (
        <Card className="shadow-none">
            <CardHeader className="text-xl font-bold"> Study Plans</CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <Plan key={plan._id.toString()} {...plan} />
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}

export default PlansContainer;