import {Request, Response } from 'express';
import { Jam } from '../models/jam';
import { User } from '../models/user';
import mongoose, { ObjectId } from 'mongoose';

const express = require('express')
const router = express.Router()

interface JamUser {
    user_id: string;
    name: string;
}

interface JamSnippet {
    _id: string;
    plan_id: string | null;
    name: string;
    prob_goal_per_day: number;
    start_date: string | null;
    end_date: string | null;
    status: string;
    live_call: boolean;
    live_call_url: string | null;
    users?: JamUser[];
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
    const user_id = req.query.user_id as string;
    if (!user_id) {
        return res.status(400).json({error: 'User ID is required'});
    }
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
   
    // Fetch all users once (select _id, name, jams)
    const users = await User.find({_id: user_id}, { _id: 1, name: 1, jams: 1 }).lean();

    // Build a map of jam_id -> users (store as strings)
    const jamUsersMap: Record<string, JamUser[]> = {};
    users.forEach(user => {
        // user.jams is an array of objects with jam_id and is_admin
        user.jams?.forEach((jamRef: any) => {
            const jamId = jamRef?.jam_id?.toString?.();
            if (!jamId) return;
            if (!jamUsersMap[jamId]) jamUsersMap[jamId] = [];
            jamUsersMap[jamId].push({
                user_id: user._id.toString(),
                name: user.name,
            });
        });
    });

    const uniqueJamIds = Array.from(
        new Set(
            users.flatMap(user =>
                user.jams?.map((jamRef: any) => jamRef?.jam_id?.toString?.()).filter(Boolean) ?? []
            )
        )
    );

    if (uniqueJamIds.length === 0) {
        return res.status(200).json([]);
    }

    // Fetch jams that the user belongs to
    const jams = await Jam.find({
        _id: { $in: uniqueJamIds.map(id => new mongoose.Types.ObjectId(id)) },
        status: 'active'
    }).lean();

    // Transform to JamSnippet format
    const jamSnippets: JamSnippet[] = jams.map(jam => ({
        _id: jam._id.toString(),
        plan_id: jam.plan_id ? jam.plan_id.toString() : null,
        name: jam.name,
        prob_goal_per_day: jam.prob_goal_per_day,
        start_date: jam.start_date ? jam.start_date.toISOString() : null,
        end_date: jam.end_date ? jam.end_date.toISOString() : null,
        status: jam.status,
        live_call: jam.live_call || false,
        live_call_url: jam.live_call_url || null,
        users: jamUsersMap[jam._id.toString()] || [] // attach users here
    }));

    res.status(200).json(jamSnippets);
} catch (err: any) {
    console.error('Error getting ongoing jams', err);
    res.status(500).json({ error: err.message });
}
}); 
 

router.post('/createFromPlan', async (req: Request, res: Response)=>{
    console.log('Creating jam from plan');
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

        await User.findByIdAndUpdate(user_id, { 
            $push: { jams: { jam_id: savedJam._id, is_admin: true } } 
        });

        res.status(200).json({message: 'Jam created successfully', jam_id: savedJam._id});
    }catch(err: any){
        console.error('Error creating jam', err);
        res.status(500).json({error: err.message});
    }
});


router.post('/:jam_id/add-user', async (req: Request, res: Response) => {
    const { jam_id } = req.params;
    const { email } = req.body as { email?: string };

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // TODO: Replace with real invitation flow once available.
        console.log(`[jam][sample] Add user request`, { jam_id, email });

        const jamExists = await Jam.exists({ _id: jam_id });
        if (!jamExists) {
            return res.status(404).json({ error: 'Jam not found' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await User.findByIdAndUpdate(
            user._id,
            { $addToSet: { jams: { jam_id: new mongoose.Types.ObjectId(jam_id), is_admin: false } } }
        );
        res.status(200).json({
            message: `${email} added to jam successfully`,
        });
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to add user to jam' });
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
    console.log('Solving problem...');
    const {jam_id, problem_slug, user_id} = req.body;
    
    try{
        const solvedEntry = {
            user_id: new mongoose.Types.ObjectId(user_id),
            solved_at: new Date()
        };

        const result = await Jam.findByIdAndUpdate(
            jam_id,
            { $push: { "sections.$[s].problems.$[p].solved_by": solvedEntry } },
            {
                arrayFilters: [
                    { "s.problems": { $exists: true } },
                    { "p.slug": problem_slug }
                ],
                new: true
            }
        );

        if (!result) {
            return res.status(404).json({error: 'Jam not found'});
        }

        console.log('Problem solved successfully');
        res.status(200).json({message: 'Problem solved successfully'});
    }catch(err: any){   
        res.status(500).json({error: err.message});
    }
});

router.patch('/unsolved', async (req: Request, res: Response)=>{
    const {jam_id, problem_slug, user_id} = req.body;
    try{
        const result = await Jam.findByIdAndUpdate(
            jam_id,
            { $pull: { "sections.$[s].problems.$[p].solved_by": { user_id: new mongoose.Types.ObjectId(user_id) } } },
            {
                arrayFilters: [
                    { "s.problems": { $exists: true } },
                    { "p.slug": problem_slug }
                ],
                new: true
            }
        );

        if (!result) {
            return res.status(404).json({error: 'Jam not found'});
        }

        res.status(200).json({message: 'Problem unsolved successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.get('/:jam_id', async (req: Request, res: Response)=>{
    const {jam_id} = req.params;
    // TODO: get user_id from the request/ session

    console.log('Getting jam', jam_id);
    try{
        const jam = await Jam.findById(jam_id).lean();
        const users = await User.find(
            { jams: { $elemMatch: { jam_id: new mongoose.Types.ObjectId(jam_id) } } },
            { _id: 1, name: 1, email: 1 }
          );
        if (!jam) {
            return res.status(404).json({error: 'Jam not found'});
        }
        
        const jamWithUsers = {
            ...jam,
            users: users
        };
        res.status(200).json(jamWithUsers);
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