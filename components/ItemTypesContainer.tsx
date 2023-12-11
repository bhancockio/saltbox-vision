"use client";

import { Item, ItemType } from "@prisma/client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { convertNumberToCurrency } from "@/lib/utils";

interface ItemTypesContainerProps {
  itemTypes: (ItemType & { items: Item[] })[];
}

function ItemTypesContainer({ itemTypes }: ItemTypesContainerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(
    null
  );

  console.log(itemTypes);

  const handleCreate = () => {
    setIsCreating(true);
    axios
      .post<{ success: boolean; message: string; data: ItemType }>(
        "/api/item-types"
      )
      .then((res) => {
        const { success, message, data } = res.data;
        if (success) {
          setSelectedItemType(data);
          itemTypes.push({ ...data, items: [] });
          toast.success(message);
        } else {
          setSelectedItemType(null);
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
        setIsCreating(false);
      });
  };

  return (
    <div className="flex flex-row w-full h-full gap-x-6">
      <div className="w-1/2 flex flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="font-semibold text-2xl">Item Types</h1>
          <Button variant="default" onClick={handleCreate}>
            {isCreating ? "Creating" : "Create"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Count</TableHead>
              <TableHead className="text-right">
                Saltbox Vision Enabled
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemTypes.map((itemType) => (
              <TableRow
                key={itemType.id}
                onClick={() => setSelectedItemType(itemType)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{itemType.name}</TableCell>
                <TableCell>{convertNumberToCurrency(itemType.price)}</TableCell>
                <TableCell>{itemType.items?.length ?? 0}</TableCell>
                <TableCell className="flex flex-row justify-end ">
                  {itemType.visionInstructionId ? (
                    <IoMdEye className="text-primary" />
                  ) : (
                    <IoMdEyeOff />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {itemTypes.length === 0 && (
          <div className="text-center w-full my-2">
            <p className="text-gray-500">
              No items found. Please create a new one or seed with dummy data.
            </p>
          </div>
        )}
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="bg-white w-full min-h-[300px] rounded-md drop-shadow-lg p-4 flex flex-col">
          {selectedItemType ? (
            <div>{selectedItemType.id}</div>
          ) : (
            <div className="text-center my-auto">
              <p className="text-gray-500 ">
                No item type selected. Please select one from the list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemTypesContainer;
