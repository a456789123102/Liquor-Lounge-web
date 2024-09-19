import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/verify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
  try {
    const { name, storeId } = req.body;

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
        ownerId: (req as CustomRequest).user.id,
      },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        storeId: storeId,
      },
    });
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

//ดึง branchทั้งหมด
export const find = async (req: Request, res: Response) => {
    try {
      const branches = await prisma.branch.findMany({
        where: {
          store: {
            ownerId: (req as CustomRequest).user.id,
          },
        },
      });
      res.status(200).json(branches);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };
  