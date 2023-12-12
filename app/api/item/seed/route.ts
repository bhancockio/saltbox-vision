import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

const SEED_ITEM_COUNT = 5;

export async function POST() {
  try {
    // Fetch all item types
    const itemTypes = await prismadb.itemType.findMany();

    // Create 5 items for each item type using transactions
    const itemCreations = itemTypes.map((itemType) => {
      const itemsForType = Array(SEED_ITEM_COUNT)
        .fill(null)
        .map(() => {
          return prismadb.item.create({
            data: {
              itemTypeId: itemType.id,
            },
            include: {
              itemType: true,
              orderItems: true,
            },
          });
        });
      return prismadb.$transaction(itemsForType);
    });

    // Execute all transactions
    const createdItemsResults = await Promise.all(itemCreations);

    // Flatten the array of arrays of items
    const newItems = createdItemsResults.flat();

    // Return all items to the client
    return NextResponse.json(
      { message: "New items created", data: newItems, success: true },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error creating new items: ", e);
    return NextResponse.error();
  }
}
