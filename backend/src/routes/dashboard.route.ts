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
  'Topological Sort',
  'Shortest Path',
  'Bit Manipulation',
  'String Matching',
  'Quickselect',
  'Merge Sort',
  'Counting Sort',
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

];

const DB_TAGS = ['Database'];

const SYSTEM_DESIGN_TAGS = [
  'Design'
];

function getSkillsFromTags(tags: string[]): string[] {
  const skills: string[] = [];
  const tagSet = new Set(tags.map(t => t.toLowerCase())); 
  console.log(tagSet);
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
  try {
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const db = await getMongoDB();
    const jamCollection = db.collection('jams');

    // Aggregate problems solved by day for the user
    const lineChartData = await jamCollection.aggregate([
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
        $unwind: {
          path: '$sections.problems.solved_by',
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
          solved_at: '$sections.problems.solved_by.solved_at',
          date: {
            $dateToString: {
              format: '%Y-%m-%d:%H:%M',
              date: '$sections.problems.solved_by.solved_at'
            }
          }
        }
      },
      {
        $group: {
          _id: '$date',
          solved: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          solved: 1
        }
      },
      {
        $sort: { name: 1 }
      }
    ]).toArray();

    res.json(lineChartData);
  } catch (error: any) {
    console.error('Error fetching line chart data:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/tagCloudData', async (req: Request, res: Response)=>{
  const userId = req.query.user_id as string;
  if (!userId) {
    return res.status(400).json({ error: 'user_id query parameter is required and must be a number' });
  }

  const db = await getMongoDB();
  const jamCollection = db.collection('jams');
  const tagCloudData = await jamCollection.aggregate([
     
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
      $unwind: {
        path: '$sections.problems.tags',
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $group: {
        _id: '$sections.problems.tags',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        value: '$_id',
        count: 1
      }
    },
    {
      $sort: { count: -1 }
    }
  ]).toArray();
    res.json(tagCloudData);
});

router.get('/barChartData', async (req: Request, res: Response)=>{
  try {
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const db = await getMongoDB();
    const jamCollection = db.collection('jams');

    // Get all tags from const arrays above
    const allTags = [
      ...ALGORITHMS_TAGS,
      ...DATA_STRUCTURE_TAGS,
      ...DB_TAGS,
      ...SYSTEM_DESIGN_TAGS
    ];

    // Get all solved problems with tags from jams for this user
    const solvedProblemsWithTags = await jamCollection.aggregate([
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

    // Create a map to count solved problems per tag
    const tagSolvedCount: Record<string, number> = {};
    
    // Initialize all tags from const arrays with 0
    allTags.forEach((tag: string) => {
      tagSolvedCount[tag] = 0;
    });

    // Count solved problems per tag
    solvedProblemsWithTags.forEach((problem: any) => {
      const tags = problem.tags || [];
      tags.forEach((tag: string) => {
        if (tagSolvedCount.hasOwnProperty(tag)) {
          tagSolvedCount[tag]++;
        }
      });
    });

    // Convert to array and sort by count (ascending), then take top 10
    const barChartData = Object.entries(tagSolvedCount)
      .map(([tag, count]) => ({
        tag,
        count
      }))
      .sort((a, b) => a.count - b.count)
      .slice(0, 10)
      .map(item => ({
        name: item.tag,
        value: item.count
      }));
    console.log(barChartData);
    res.json(barChartData);
  } catch (error: any) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: error.message });
  }
});
export {router as dashboardRouter};