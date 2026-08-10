import React from "react";
import { prisma } from "@/lib/prisma";
import GiftInteractiveClient from "./GiftInteractiveClient";

export const dynamic = "force-dynamic";

export default async function GiftPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ occ?: string; gender?: string; age?: string }> | { occ?: string; gender?: string; age?: string };
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  
  const id = resolvedParams.id;
  const occasion = resolvedSearchParams.occ || "friend";
  const gender = resolvedSearchParams.gender || "male";
  const ageGroup = resolvedSearchParams.age || "youth";

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
    message: gift?.message || "أتمنى لك يوماً استثنائياً مليئاً بالبهجة والسرور والنجاح الدائم!",
    amount: gift?.amount ?? 50,
    occasion,
    gender,
    ageGroup,
  };

  return (
    <GiftInteractiveClient 
      giftData={giftData} 
    />
  );
}
