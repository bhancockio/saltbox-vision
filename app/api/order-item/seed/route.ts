import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import Chance from "chance";

const chance = new Chance();

export async function POST() {
  try {
    const items = await prismadb.item.findMany({ include: { itemType: true } });

    const orders = await Promise.all(
      items.map(async (item) => {
        const order = await prismadb.order.create({
          data: {
            customer: chance.name(),
            address: chance.address(),
            city: chance.city(),
            state: chance.state(),
            amount: item.itemType.price,
            status: "Created",
          },
        });

        const orderItem = await prismadb.orderItem.create({
          data: {
            orderId: order.id,
            itemId: item.id,
            quantity: 1,
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

        return orderItem;
      })
    );

    return NextResponse.json(
      { message: "New orders created", data: orders, success: true },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error creating new orders: ", e);
    return NextResponse.error();
  }
}
