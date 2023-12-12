import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI();

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

  if (
    !orderItem.item.itemType.qualityControlInstructions ||
    !orderItem.item.itemType.qualityControlImageURL ||
    !orderItem.qualityControlImageURL
  ) {
    return NextResponse.json({
      message: "Proper quality control instructions not found",
      success: false,
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: orderItem.item.itemType.qualityControlInstructions,
          },
          {
            type: "image_url",
            image_url: {
              url: orderItem.item.itemType.qualityControlImageURL,
            },
          },
          {
            type: "image_url",
            image_url: {
              url: orderItem.qualityControlImageURL,
            },
          },
        ],
      },
    ],
  });

  console.log("response: ", response);
  const aiResponse = response.choices[0].message.content;
  console.log("aiResponse: ", aiResponse);

  // TODO: Improve validation
  const isValid = !!aiResponse?.includes("True");
  const notes = aiResponse
    ?.replace("Pass: True", "")
    .replace("Pass: False", "")
    .replaceAll("`", "")
    .trim();

  // Update order in prisma with AI Feedback
  const updatedOrderItem = await prismadb.orderItem.update({
    where: { id: orderItem.id },
    data: {
      qualityControlNotes: notes,
      qualityControlStatus: isValid ? "Pass" : "Fail",
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

  return NextResponse.json({
    message: "Quality Control Updated",
    success: true,
    data: updatedOrderItem,
  });
}
