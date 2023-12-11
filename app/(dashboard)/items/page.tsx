import { prismadb } from "@/lib/prismadb";
import { ItemType } from "@prisma/client";

const fetchItems = async (): Promise<ItemType[]> => {
  return prismadb.itemType.findMany({ orderBy: { name: "asc" } });
};

export default async function ItemsPage() {
  const items = await fetchItems();

  return <div>Item page</div>;
}
