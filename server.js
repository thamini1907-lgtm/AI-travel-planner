import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  await readFile(new URL('./firebase-service-account.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Middleware to verify Firebase ID Token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173', // Optional
    'X-OpenRouter-Title': 'WanderMind AI', // Optional
  },
});

const systemInstruction = `
Generate a real-time adaptive 3-day travel itinerary for the given destination.
For every outdoor activity, include a 'Weather-Ready Backup' (Plan B).
Focus on local experiences over generic tourist spots. 
Output the result in structured Markdown.
Use clear headings for Day 1, Day 2, and Day 3.
Use bullet points for activities and bold text for the 'Weather-Ready Backup'.
`;

// Protected route for profile
app.get('/api/profile', authenticateUser, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      // Create profile if it doesn't exist
      const newProfile = {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || '',
        photoURL: req.user.picture || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
      };
      await userRef.set(newProfile);
      return res.json(newProfile);
    }
    
    res.json(doc.data());
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/generate', async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: 'Destination is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: `Generate a 3-day itinerary for ${destination}.` },
      ],
    });

    const responseText = completion.choices[0].message.content;
    
    res.json({ markdown: responseText });
  } catch (error) {
    console.error('Error with OpenRouter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate itinerary via OpenRouter.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

