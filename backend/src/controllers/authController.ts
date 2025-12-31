import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { LoginRequest, LoginResponse, ApiResponse } from '../types';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      // For simplicity, we'll use a single admin account
      // In production, you'd want to store this in the database
      const adminEmail = 'admin@photography.com';
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        res.status(500).json({
          success: false,
          message: 'Server configuration error'
        });
        return;
      }

      // For this demo, we'll use a simple password comparison
      // In production, you should hash the password and compare hashes
      if (email !== adminEmail || password !== adminPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Generate JWT token
      const token = generateToken('1', email);

      const response: LoginResponse = {
        success: true,
        token,
        user: {
          id: '1',
          email
        },
        message: 'Login successful'
      };

      res.json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a stateless JWT setup, logout is handled on the client side
      // by removing the token. We could implement a token blacklist here
      // for additional security if needed.
      
      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      // If we reach here, the token is valid (authenticateToken middleware passed)
      res.json({
        success: true,
        message: 'Token is valid',
        user: (req as any).user
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
