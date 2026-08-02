import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GiftInteractiveClient from "./GiftInteractiveClient";

export default async function GiftPage({ params }: { params: { id: string } }) {
  // Fetch from database
  const gift = await prisma.gift.findUnique({
    where: { giftId: params.id },
  });

  if (!gift) {
    notFound();
  }

  // Define template and category (mocking based on amount since we didn't save category previously, but you can expand this)
  const template = gift.amount === 0 ? "digital" : "vouchers";
  const category = gift.amount === 0 ? "digital" : "vouchers";

  return (
    <GiftInteractiveClient 
      giftData={{
        id: gift.id,
        giftId: gift.giftId,
        senderName: gift.senderName,
        recipientName: gift.recipientName,
        message: gift.message,
        amount: gift.amount,
        template,
        category
      }} 
    />
  );
}
