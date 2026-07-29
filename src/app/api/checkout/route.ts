import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, giftId } = body;

    // Lemon Squeezy Integration (Requires LEMON_SQUEEZY_API_KEY and STORE_ID)
    const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
    const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
    const VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID; // Create a dynamic price product

    if (!LEMON_SQUEEZY_API_KEY || !STORE_ID) {
      // Fallback for development if no keys are provided
      return NextResponse.json({
        url: `/gift/preview?id=${giftId}&paid=true` // simulate success
      });
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            custom_price: amount * 100, // Amount in cents/halalas
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/gift/preview?id=${giftId}&success=true`
            },
            checkout_data: {
              custom: {
                gift_id: giftId
              }
            }
          },
          relationships: {
            store: { data: { type: "stores", id: STORE_ID } },
            variant: { data: { type: "variants", id: VARIANT_ID } }
          }
        }
      })
    });

    const data = await response.json();
    
    if (data.data?.attributes?.url) {
      return NextResponse.json({ url: data.data.attributes.url });
    } else {
      throw new Error("Failed to create checkout");
    }

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
