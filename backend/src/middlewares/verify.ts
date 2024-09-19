import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// สร้าง type ที่ขยายจาก Request เพื่อเพิ่ม user property
export type CustomRequest = Request & { user: { id: number } };



export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: "Token not provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    // กำหนดค่า decoded ลงใน req.user โดยใช้ CustomRequest
    (req as CustomRequest).user = decoded as any;

    // ส่งต่อไปยัง middleware หรือ route handler ถัดไป
    next();
  } catch (error) {
    res.status(500).json({ message: "Error verifying token" });
  }
};

