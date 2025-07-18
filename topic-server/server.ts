import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getTopicSegments } from './topic_segmentation_pipeline';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/segment', async (req: Request, res: Response) => {
  try {
    const transcript = req.body.transcript;
    if (!transcript) return res.status(400).json({ error: 'Missing transcript' });

    const segments = await getTopicSegments(transcript);
    res.json({ segments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to segment topics' });
  }
});

app.listen(3001, () => {
  console.log('✅ Topic segmentation server running on http://localhost:3001');
});