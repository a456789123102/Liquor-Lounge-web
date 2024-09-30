import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/verify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//สร้าง store
export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const store = await prisma.store.create({
      data: {
        name: name,
        ownerId: (req as CustomRequest).user.id,
      },
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

//หา store
export const find = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const stores = await prisma.store.findMany({
      where: {
        name: { contains: name as string },
        ownerId: (req as CustomRequest).user.id,
      },
    });
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

//หา branch ที่ตรงกับ store ID
export const branches = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    const branches = await prisma.branch.findMany({
      where: {
        storeId: parseInt(storeId),
        store: {
          ownerId: (req as CustomRequest).user.id,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json(branches); // ส่งข้อมูล branches กลับมาในรูปแบบ JSON
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};


//หา store เดียว
export const findOne = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const store = await prisma.store.findUnique({
      where: {
        id: parseInt(storeId),
        ownerId: (req as CustomRequest).user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    return res.status(200).json(store);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update store
export const update = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const { name } = req.body;

    const store = await prisma.store.update({
      where: {
        id: parseInt(storeId),
      },
      data: {
        name: name,
      },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};
