import { Request, Response } from 'express';
import { StudyPlan } from '../models/studyPlan';

const express = require('express')
const router = express.Router()



router.get('/', (_req: Request, res: Response) => {
    res.json({message: 'Hello World'});
});

router.get('/all', async (req: Request, res: Response)=>{
    try {
        const plans = await StudyPlan.find();
        res.status(200).json(plans);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req: Request, res: Response)=>{
    try {
        const { id } = req.params;
        const plan = await StudyPlan.findOne({ slug: id });
        
        if (!plan) {
            return res.status(404).json({ error: 'Study plan not found' });
        }
        
        // Transform the problem groups into sections format
        const sections = plan.problems.map((group) => ({
            section_name: group.name,
            section_order: plan.problems.indexOf(group),
            problems: group.problems
        }));
        
        res.status(200).json({ plan, sections });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export {router as planRouter};