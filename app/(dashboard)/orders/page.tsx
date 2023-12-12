import OrdersContainer from "@/components/OrdersContainer";
import { prismadb } from "@/lib/prismadb";
import { Item, ItemType, Order, OrderItem } from "@prisma/client";
import React from "react";

export type HydratedOrderItem = OrderItem & {
  item: Item & { itemType: ItemType };
  order: Order;
};

const fetchOrderItems = async (): Promise<HydratedOrderItem[]> => {
  return prismadb.orderItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      item: {
        include: {
          itemType: true,
        },
      },
      order: true,
    },
  });
};

export default async function OrdersPage() {
  const orderItems = await fetchOrderItems();

  return <OrdersContainer orderItems={orderItems} />;
}
