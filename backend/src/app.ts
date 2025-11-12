import express from 'express';
import cors from 'cors';
import {planRouter} from './routes/plan.route';
import {jamRouter} from './routes/jam.route';
import {dashboardRouter} from './routes/dashboard.route';
import mongoose from 'mongoose';


const app = express();

// Configure CORS with more detailed options
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/plan', planRouter);
app.use('/jam', jamRouter);
app.use('/dashboard', dashboardRouter);

export default app;


