import {Request, Response } from 'express';
import { Jam } from '../models/jam';
import { User } from '../models/user';
import mongoose from 'mongoose';

const express = require('express')
const router = express.Router()

interface JamSnippet {
    _id: string;
    plan_id: string;
    name: string;
    prob_goal_per_day: number;
    start_date: string;
    end_date: string;
    status: string;
    live_call: boolean;
    live_call_url: string | null;
}

router.get('/', (_req: Request, res: Response)=>{
    res.json({message: 'Hello World'});
});

router.get('/ongoing', async (req: Request, res: Response)=>{
    // status 1 is ongoing
    // status 2 is completed
    // status 0 is pending

    // TODO: get user_id from the request/ session
    // const user_id = new mongoose.Types.ObjectId('1');
    console.log('Getting ongoing jams');
    try {
        const jams = await Jam.find({status: 'active'}).lean();
        
        // Transform to JamSnippet format
        const jamSnippets: JamSnippet[] = jams.map(jam => ({
            _id: jam._id.toString(),
            plan_id: jam.plan_id.toString(),
            name: jam.name,
            prob_goal_per_day: jam.prob_goal_per_day,
            start_date: jam.start_date.toISOString(),
            end_date: jam.end_date.toISOString(),
            status: jam.status,
            live_call: jam.live_call || false,
            live_call_url: jam.live_call_url || null
        }));
        
        res.status(200).json(jamSnippets);
    } catch (err: any) {
        console.error('Error getting ongoing jams', err);
        res.status(500).json({error: err.message});
    }
}); 
 

router.post('/createFromPlan', async (req: Request, res: Response)=>{
    const {plan_id} = req.body;
    // TODO: get user_id from the request/ session
    const {user_id} = req.body;
    try{
        const newJam = new Jam({
            plan_id: new mongoose.Types.ObjectId(plan_id),
            name: req.body.name,
            prob_goal_per_day: req.body.prob_goal_per_day,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            status: req.body.status,
            live_call: req.body.live_call,
            sections: req.body.sections || []
        });
        const savedJam = await newJam.save();
        res.status(200).json({message: 'Jam created successfully', jam_id: savedJam._id});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});


router.post('/adduser', async (req: Request, res: Response)=>{
    const {jam_id, user_id} = req.body;
    try{
        await Jam.findByIdAndUpdate(
            jam_id,
            { $addToSet: { sections: { $each: [] } } },
            { new: true }
        );
        res.status(200).json({message: 'User added to jam successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.delete('/removeuser', async (req: Request, res: Response)=>{
    const {jam_id, user_id} = req.body;
    try{
        await Jam.findByIdAndUpdate(jam_id, { new: true });
        res.status(200).json({message: 'User removed from jam successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.patch('/solved', async (req: Request, res: Response)=>{
    console.log('Solving problem');
    const {jam_id, problem_slug, user_id} = req.body;
    console.log('jam_id', jam_id);
    console.log('problem_slug', problem_slug);
    console.log('user_id', user_id);
    try{
        const jam = await Jam.findById(jam_id);
        if (!jam) {
            return res.status(404).json({error: 'Jam not found'});
        }

        // Find the problem in sections and add user to solved_by
        for (let section of jam.sections) {
            for (let problem of section.problems) {
                if (problem.slug === problem_slug) {
                    const solvedEntry = {
                        user_id: new mongoose.Types.ObjectId(user_id),
                        solved_at: new Date()
                    };
                    problem.solved_by.push(solvedEntry);
                }
            }
        }

        await jam.save();
        console.log('Problem solved successfully');
        res.status(200).json({message: 'Problem solved successfully'});
    }catch(err: any){   
        res.status(500).json({error: err.message});
    }
});

router.patch('/unsolved', async (req: Request, res: Response)=>{
    const {jam_id, problem_slug, user_id} = req.body;
    try{
        const jam = await Jam.findById(jam_id);
        if (!jam) {
            return res.status(404).json({error: 'Jam not found'});
        }

        // Find the problem in sections and remove user from solved_by
        for (let section of jam.sections) {
            for (let problem of section.problems) {
                if (problem.slug === problem_slug) {
                    problem.solved_by = problem.solved_by.filter(
                        (entry: any) => entry.user_id.toString() !== user_id
                    );
                }
            }
        }

        await jam.save();
        res.status(200).json({message: 'Problem unsolved successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.get('/:jam_id', async (req: Request, res: Response)=>{
    const {jam_id} = req.params;
    // TODO: get user_id from the request/ session
    const user_id = '1';
    console.log('Getting jam', jam_id);
    try{
        const jam = await Jam.findById(jam_id).lean();
        if (!jam) {
            return res.status(404).json({error: 'Jam not found'});
        }
        res.status(200).json(jam);
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.post('/createLiveJam', async (req: Request, res: Response)=>{
    const {jam_id} = req.body;
    try{
        const updatedJam = await Jam.findByIdAndUpdate(
            jam_id,
            { 
                live_call: true,
                live_call_url: 'https://meet.google.com/landing'
            },
            { new: true }
        );
        res.status(200).json({live_call_url: 'https://meet.google.com/landing'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.post('/endLiveJam', async (req: Request, res: Response)=>{
    const {jam_id} = req.body;
    try{
        const updatedJam = await Jam.findByIdAndUpdate(
            jam_id,
            { 
                live_call: false,
                live_call_url: null
            },
            { new: true }
        );
        res.status(200).json({message: 'Live jam ended successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});
export {router as jamRouter};