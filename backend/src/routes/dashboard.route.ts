import {Request, Response } from 'express';
import { getMongoDB } from '../config/mongodb';
import { ObjectId } from 'mongodb';

const express = require('express')
const router = express.Router()

// Skill category mappings
const ALGORITHMS_TAGS = [
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Divide and Conquer',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Prefix Sum',
  'Sorting',
  'Counting',
  'Math',
  'Recursion',
  'Memoization',
  'Depth-First Search',
  'Breadth-First Search',
  'Union Find',
  'Topological Sort',
  'Shortest Path',
  'Bit Manipulation',
  'String Matching',
  'Combinatorics',
  'Geometry',
  'Quickselect',
  'Merge Sort',
  'Counting Sort',
  'Bucket Sort',
  'Simulation',
  'Interactive',
  'Randomized'
];

const DATA_STRUCTURE_TAGS = [
  'Array',
  'String',
  'Hash Table',
  'Stack',
  'Queue',
  'Linked List',
  'Tree',
  'Binary Tree',
  'Binary Search Tree',
  'Graph',
  'Trie',
  'Matrix',
  'Heap (Priority Queue)',
  'Doubly-Linked List',
  'Monotonic Stack',
  'Monotonic Queue',
  'Ordered Set',
  'Binary Indexed Tree',
  'Segment Tree'
];

const DB_TAGS = ['Database'];

const SYSTEM_DESIGN_TAGS = [
  'Design',
  'Data Stream',
  'Iterator'
];

function getSkillsFromTags(tags: string[]): string[] {
  const skills: string[] = [];
  const tagSet = new Set(tags.map(t => t.toLowerCase())); 
  
  // Check for Algorithms
  if (ALGORITHMS_TAGS.some(tag => tagSet.has(tag.toLowerCase()))) {
    skills.push('Algorithms');
  }
  
  // Check for Data Structure
  if (DATA_STRUCTURE_TAGS.some(tag => tagSet.has(tag.toLowerCase()))) {
    skills.push('Data Structure');
  }
  
  // Check for DB
  if (DB_TAGS.some(tag => tagSet.has(tag.toLowerCase())) || 
      tags.some(t => t.toLowerCase().includes('sql'))) {
    skills.push('DB');
  }
  
  // Check for System Design
  if (SYSTEM_DESIGN_TAGS.some(tag => tagSet.has(tag.toLowerCase())) ||
      tags.some(t => t.toLowerCase().includes('system design') || t.toLowerCase().includes('design'))) {
    skills.push('System Design');
  }
  console.log(skills);
  return skills;
}

// Dummy data for line and bar charts
const lineChartData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// Dummy data for tag cloud
const tagCloudData = [
  { value: 'JavaScript', count: 25 },
  { value: 'React', count: 18 },
  { value: 'Node.js', count: 15 },
  { value: 'CSS', count: 10 },
  { value: 'HTML', count: 10 },
  { value: 'TypeScript', count: 8 },
  { value: 'WebAssembly', count: 2 },
];

router.get('/radarChartData', async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ error: 'user_id query parameter is required and must be a number' });
    }

    const db = await getMongoDB();
    const jamCollection = db.collection('jams');


    // Aggregate to find all solved problems for the user
    // sections is an object with topic names as keys, so we need to convert it to array first
    const solvedProblems = await jamCollection.aggregate([
     
      {
        $unwind: {
          path: '$sections',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: '$sections.problems',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $match: {
          'sections.problems.solved_by.user_id': {
            $eq: new ObjectId(userId)
          }
        }
      },
      {
        $project: {
          tags: '$sections.problems.tags'
        }
      }
    ]).toArray();

    console.log(solvedProblems);

    // Count problems by skill category
    const skillCounts: Record<string, number> = {
      'Algorithms': 0,
      'Data Structure': 0,
      'DB': 0,
      'System Design': 0
    };

    solvedProblems.forEach((problem: any) => {
      const tags = problem.tags || [];
      const skills = getSkillsFromTags(tags);
      skills.forEach(skill => {
        skillCounts[skill]++;
      });
    });

    console.log(skillCounts);
    // Format response
    const radarChartData = [
      {
        subject: 'Algorithms',
        A: skillCounts['Algorithms'],
        fullMark: 150
      },
      {
        subject: 'Data Structure',
        A: skillCounts['Data Structure'],
        fullMark: 150
      },
      {
        subject: 'System Design',
        A: skillCounts['System Design'],
        fullMark: 150
      },
      {
        subject: 'DB',
        A: skillCounts['DB'],
        fullMark: 150
      }
    ];

    res.json(radarChartData);
  } catch (error: any) {
    console.error('Error fetching radar chart data:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/lineChartData', async (req: Request, res: Response)=>{
    res.json(lineChartData);
});

router.get('/tagCloudData', async (req: Request, res: Response)=>{
    res.json(tagCloudData);
});

router.get('/barChartData', async (req: Request, res: Response)=>{
    res.json(lineChartData);
});
export {router as dashboardRouter};