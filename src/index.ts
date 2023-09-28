import express, { Request, Response } from 'express';
import deltaRoutes from './routes/delta';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/delta', deltaRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

