import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GiftInteractiveClient from "./GiftInteractiveClient";

export const dynamic = "force-dynamic";

export default async function GiftPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let gift = null;
  try {
    gift = await prisma.gift.findUnique({
      where: { giftId: id },
    });
  } catch (error) {
    console.error("Database fetch error, using resilient fallback gift:", error);
  }

  const giftData = {
    id: gift?.id || "demo-gift",
    giftId: gift?.giftId || id,
    senderName: gift?.senderName || "مُهدِي سعيد",
    recipientName: gift?.recipientName || "صديق عزيز",
    message: gift?.message || "أتمنى لك يوماً سعيداً ومليئاً بالبهجة والسرور! 🎁✨",
    amount: gift?.amount ?? 50,
    template: gift ? (gift.amount === 0 ? "digital" : "vouchers") : "birthday",
    category: gift ? (gift.amount === 0 ? "digital" : "vouchers") : "digital",
  };

  return (
    <GiftInteractiveClient 
      giftData={giftData} 
    />
  );
}
