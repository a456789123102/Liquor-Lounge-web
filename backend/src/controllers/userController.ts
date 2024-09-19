import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CustomRequest } from '../middlewares/verify';
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY;

// ฟังก์ชันสร้างผู้ใช้ใหม่
export const create = async (req: Request, res: Response) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
      throw new Error('Username, password, and name are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      select: { id: true, username: true, name: true },
      data: { username, password: hashedPassword, name },
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// ฟังก์ชันค้นหาผู้ใช้ทั้งหมด
export const find = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, Branch: true }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// ฟังก์ชันล็อกอินผู้ใช้
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, Branch: true, password: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid Username or Password' });
    }

    if (!secretKey) {
      return res.status(500).json({ error: "JWT secret Missing" });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '30d' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ที่ล็อกอิน
export const me = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as CustomRequest).user.id },
      select: { id: true, username: true, Branch: true },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};
