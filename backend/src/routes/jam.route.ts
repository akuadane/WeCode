import {Request, Response } from 'express';
import {pool} from '../config/database';

const express = require('express')
const router = express.Router()

router.get('/', (_req: Request, res: Response)=>{
    res.json({message: 'Hello World'});
});

router.get('/ongoing', async (req: Request, res: Response)=>{
    // status 1 is ongoing
    // status 2 is completed
    // status 0 is pending

    // TODO: get user_id from the request/ session
    const user_id = 1;
    console.log('Getting ongoing jams');
    pool.query(`
        SELECT jam.*, jam_user.is_admin, (select json_agg(users.name)
                                                 from jam_user as ju2
                                                join users on ju2.user_id = users.user_id
                                                 where ju2.jam_id = jam.jam_id
                                                ) as users
        FROM jam 
        LEFT JOIN jam_user ON jam.jam_id = jam_user.jam_id
        where jam.status = 1 and jam_user.user_id = $1`
        ,[user_id],(err: any,result: any)=>{
        if(err){
            res.status(500).json({error: err.message});
        }else{
            res.status(200).json(result.rows);
        }
    }); 
}); 
 

router.post('/createFromPlan', async (req: Request, res: Response)=>{
    const {plan_id} = req.body;
    // TODO: get user_id from the request/ session
    const {user_id} = req.body;
    // transaction to insert jam_user and jam_problem
    try{
        await pool.query('BEGIN');
        const result = await pool.query('INSERT INTO jam (plan_id, name,prob_goal_per_day,start_date,end_date,status,live_call) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING jam_id',[plan_id, req.body.name, req.body.prob_goal_per_day, req.body.start_date, req.body.end_date, req.body.status, req.body.live_call]);
        await pool.query('INSERT INTO jam_user (jam_id, user_id, is_admin) VALUES ($1, $2, $3)',[result.rows[0].jam_id, user_id, true]);
        await pool.query('INSERT INTO jam_problem (jam_id, problem_id) SELECT $1, problem_id FROM problem WHERE plan_id = $2',[result.rows[0].jam_id, plan_id]);
        await pool.query('COMMIT');
        res.status(200).json({message: 'Jam created successfully', jam_id: result.rows[0].jam_id});
    }catch(err: any){
        await pool.query('ROLLBACK');
        res.status(500).json({error: err.message});
    }
});


router.post('/adduser', async (req: Request, res: Response)=>{
    const {jam_id, user_id} = req.body;
    try{
        await pool.query('INSERT INTO jam_user (jam_id, user_id) VALUES ($1, $2)',[jam_id, user_id]);
        res.status(200).json({message: 'User added to jam successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.delete('/removeuser', async (req: Request, res: Response)=>{
    const {jam_id, user_id} = req.body;
    try{
        await pool.query('DELETE FROM jam_user WHERE jam_id = $1 AND user_id = $2',[jam_id, user_id]);
        res.status(200).json({message: 'User removed from jam successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.patch('/solved', async (req: Request, res: Response)=>{
    console.log('Solving problem');
    const {jam_problem_id, user_id} = req.body;
    try{
        await pool.query(
            "UPDATE jam_problem SET solved_by = COALESCE(solved_by, ARRAY[]::integer[]) || ARRAY[$1::integer] WHERE jam_problem_id = $2",
            [user_id, jam_problem_id]
        );    
        console.log('Problem solved successfully');
        res.status(200).json({message: 'Problem solved successfully'});
    }catch(err: any){   
        res.status(500).json({error: err.message});
    }
});

router.patch('/unsolved', async (req: Request, res: Response)=>{
    const {jam_problem_id, user_id} = req.body;
    try{
        await pool.query("UPDATE jam_problem SET solved_by = array_remove(solved_by, $1) WHERE jam_problem_id = $2",[user_id, jam_problem_id]);
        res.status(200).json({message: 'Problem unsolved successfully'});
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});

router.get('/:jam_id', async (req: Request, res: Response)=>{
    const {jam_id} = req.params;
    // TODO: get user_id from the request/ session
    const user_id = 1;
    console.log('Getting jam', jam_id);
    try{
        const result = await pool.query(`
            SELECT * 
            FROM jam_user
            WHERE jam_id = $1 AND user_id = $2
        `,[jam_id, user_id]);
        if(result.rows.length === 0){
            res.status(404).json({error: 'Jam not found'});
        }else{
            
            // get problems as json
            const jam = await pool.query(`
                SELECT 
                    jam.*,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'topic', topic,
                                'problems', problems
                            )
                        )
                        FROM (
                            SELECT 
                                p.topic,
                                json_agg(
                                    json_build_object(
                                        'problem_id', p.problem_id,
                                        'jam_problem_id', jp.jam_problem_id,
                                        'name', p.name,
                                        'difficulty', p.difficulty,
                                        'url', p.url,
                                        'tags', p.tags,
                                        'topic_order', p.topic_order,
                                        'solved_by', jp.solved_by
                                    ) ORDER BY p.topic_order, jp.jam_problem_id
                                ) as problems
                            FROM jam_problem jp
                            JOIN problem p ON jp.problem_id = p.problem_id
                            WHERE jp.jam_id = jam.jam_id
                            GROUP BY p.topic
                            ORDER BY MIN(p.topic_order)
                        ) as topic_groups
                    ) as sections, 
                     (select json_agg(json_build_object('name', users.name, 'user_id', users.user_id))
                                                 from jam_user as ju2
                                                join users on ju2.user_id = users.user_id
                                                 where ju2.jam_id = jam.jam_id
                                                ) as users
                FROM jam
                WHERE jam.jam_id = $1
            `, [jam_id]);
            console.log(jam.rows[0]);
            res.status(200).json(jam.rows[0]);
        }
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
});
export {router as jamRouter};