import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const newItemType = await prismadb.itemType.create({
      data: {
        name: `New Item Type ${Math.floor(Math.random() * 1000)}`,
        price: 9.99,
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
