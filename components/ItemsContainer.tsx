"use client";

import { Item } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { HydratedItem } from "@/app/(dashboard)/items/page";
import axios from "axios";
import toast from "react-hot-toast";

interface ItemsContainerProps {
  items: HydratedItem[];
}

function ItemsContainer({ items }: ItemsContainerProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [localItems, setLocalItems] = useState<HydratedItem[]>(items);

  const handleSeed = () => {
    setIsSeeding(true);
    axios
      .post<{ success: boolean; data: HydratedItem[]; message: string }>(
        "/api/item/seed"
      )
      .then((res) => {
        const { success, message, data } = res.data;
        if (success) {
          setLocalItems((prev) => [...prev, ...data]);
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Something went wrong creating Item Type. Please try again later."
        );
      })
      .finally(() => {
        setIsSeeding(false);
      });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-between">
        <h1 className="font-semibold text-2xl">Items</h1>
        <Button variant="default" disabled={isSeeding} onClick={handleSeed}>
          {isSeeding ? "Seeding" : "Seed"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Ordered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localItems.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{item.itemType?.name}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                {item.orderItems && item.orderItems?.length > 0 ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {items.length === 0 && (
        <div className="text-center w-full my-2">
          <p className="text-gray-500">
            No items found. Please seed with dummy data.
          </p>
        </div>
      )}
    </div>
  );
}

export default ItemsContainer;
