import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST() {
  try {
    const newItemType = await prismadb.itemType.create({
      data: {
        name: `New Item Type ${Math.floor(Math.random() * 1000)}`,
        price: 9.99,
        description: "New Item Type Description Here...",
      },
    });

    return NextResponse.json(
      { message: "New Item Type created", data: newItemType, success: true },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error creating new item type: ", e);
    return NextResponse.error();
  }
}

const updatedItemTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  qualityControlInstructions: z.string().nullable(),
  qualityControlImageURL: z.string().nullable(),
});

export async function PUT(request: Request) {
  const requestBody = await request.json();
  console.log("requestBody: ", requestBody);
  const parsedRequest = updatedItemTypeSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({
      message: parsedRequest.error.message,
      success: false,
    });
  }

  const itemTypeToUpdate = await prismadb.itemType.findUnique({
    where: {
      id: parsedRequest.data.id,
    },
  });

  console.log("parsedRequest.data: ", parsedRequest.data);

  if (!itemTypeToUpdate) {
    return NextResponse.json(
      { message: "Item Type not found" },
      { status: 404 }
    );
  }

  try {
    const updatedItem = await prismadb.itemType.update({
      where: {
        id: parsedRequest.data.id,
      },
      data: {
        ...parsedRequest.data,
      },
    });

    return NextResponse.json(
      { message: "Item Type Updated", success: true, data: updatedItem },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating item type" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "No id provided", success: false },
      { status: 400 }
    );
  }

  try {
    const itemTypeToDelete = await prismadb.itemType.findUnique({
      where: { id },
    });

    if (!itemTypeToDelete) {
      return NextResponse.json({
        message: "Item Type not found",
        success: false,
      });
    }

    await prismadb.itemType.delete({ where: { id } });

    return NextResponse.json(
      { message: "Successfully deleted item type", data: null, success: true },
      { status: 202 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting item type" },
      { status: 500 }
    );
  }
}
