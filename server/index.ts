import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { dbPool, JWT_SECRET } from './db.js';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Get all expenses
app.get('/api/expenses', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM expense');
    res.json(rows);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// Add new expense
app.post('/api/expenses', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, date, description, category_id, user_id } = req.body;
    if (!amount || !date || !category_id || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [result] = await dbPool.query(
      'INSERT INTO expense (uuid, user_id, amount, date, description, category_id) VALUES (UUID(), ?, ?, ?, ?, ?)',
      [user_id, amount, date, description, category_id]
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// Get all categories
app.get('/api/categories', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM category');
    res.json(rows);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// Get user budgets
app.get('/api/budgets/:userId', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const [rows] = await dbPool.query('SELECT * FROM budget WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// Start the server
const startServer = async () => {
  try {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      process.exit(1);
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 