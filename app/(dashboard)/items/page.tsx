import ItemsContainer from "@/components/ItemsContainer";
import { prismadb } from "@/lib/prismadb";
import { Item, ItemType, OrderItem } from "@prisma/client";

export type HydratedItem = Item & {
  itemType?: ItemType;
  orderItems?: OrderItem[];
};

const fetchItems = async (): Promise<HydratedItem[]> => {
  return prismadb.item.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      itemType: true,
      orderItems: true,
    },
  });
};

export default async function ItemsPage() {
  const items = await fetchItems();

  return <ItemsContainer items={items} />;
}
