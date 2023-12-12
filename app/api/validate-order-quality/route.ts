import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

const validateOrderQualitySchema = z.object({
  id: z.string(),
});

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log("requestBody: ", requestBody);
  const parsedRequest = validateOrderQualitySchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({
      message: parsedRequest.error.message,
      success: false,
    });
  }

  // Fetch order from prisma
  const orderItem = await prismadb.orderItem.findUnique({
    where: {
      id: parsedRequest.data.id,
    },
    include: {
      item: {
        include: {
          itemType: true,
        },
      },
      order: true,
    },
  });

  if (!orderItem) {
    return NextResponse.json({
      message: "Order item not found",
      success: false,
    });
  }

  // TODO: Send order to AI

  // TODO: Update order in prisma with AI Feedback

  // TODO: Return updated orderItem
}
