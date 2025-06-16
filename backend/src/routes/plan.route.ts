import { Request, Response } from 'express';
import {pool} from '../config/database';

const express = require('express')
const router = express.Router()

//TODO: create a bettertype for the plan and problem
interface Problem {
    plan_id: number;
    topic: string;
    topic_order: number;
    [key: string]: any; // for other problem properties
}

interface Section {
    section_name: string;
    section_order: number;
    problems: Problem[];
}



router.get('/', (_req: Request, res: Response) => {
    res.json({message: 'Hello World'});
});

router.get('/all', async (req: Request, res: Response)=>{
    const client = await pool.connect();
    client.query('SELECT * FROM plan',(err: any,result: any)=>{
        if(err){
            res.status(500).json({error: err.message});
        }else{
            console.log(result.rows);
            res.status(200).json(result.rows);
        }
    });
});

router.get('/:id', async (req: Request, res: Response)=>{
    const {id} = req.params;
    const client = await pool.connect();
    client.query('SELECT * FROM plan where plan_id = $1',[id],(err: any,result: any)=>{
        if(err){
            res.status(500).json({error: err.message});
        }else{
            client.query(`SELECT * 
                        FROM problem 
                        WHERE plan_id = $1
                        ORDER BY topic_order`,
                        [id],(err: any,result2: any)=>{
                            if(err){
                                res.status(500).json({error: err.message});
                            }else{
                                const sections: Section[] = []
                                let current_section: Section | null = null
                                let current_section_order: number | null = null
                                for (const problem of result2.rows){
                                    if(problem.topic_order !== current_section_order){
                                        current_section_order = problem.topic_order
                                        current_section = {
                                            'section_name': problem.topic,
                                            'section_order': problem.topic_order,
                                            'problems': []
                                        }
                                        sections.push(current_section)
                                    }
                                    current_section!.problems.push(problem)
                                }
                                res.status(200).json({plan: result.rows[0], sections: sections});
                            }
            })
        }
    });
});

export {router as planRouter};