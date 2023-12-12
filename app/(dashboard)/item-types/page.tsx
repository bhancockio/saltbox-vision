import ItemTypesContainer from "@/components/ItemTypesContainer";
import { prismadb } from "@/lib/prismadb";

const fetchItemTypess = async () => {
  return prismadb.itemType.findMany({
    orderBy: { name: "asc" },
    include: { items: true },
  });
};

export default async function ItemTypesPage() {
  const itemTypes = await fetchItemTypess();

  return <ItemTypesContainer itemTypes={itemTypes} />;
}
