"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGiftAction(data: {
  senderName: string;
  recipientName: string;
  message: string;
  amount: number;
}) {
  try {
    const giftId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newGift = await prisma.gift.create({
      data: {
        giftId,
        senderName: data.senderName,
        recipientName: data.recipientName,
        message: data.message,
        amount: data.amount,
        status: "PAID", // Bypass payment for verification
      }
    });

    revalidatePath("/admin");
    return { success: true, giftId: newGift.giftId };
  } catch (error) {
    console.error("Error creating gift:", error);
    return { success: false, error: "Failed to create gift" };
  }
}
