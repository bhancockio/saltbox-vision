"use client";

import { Item, ItemType } from "@prisma/client";
import React, { useEffect, useState } from "react";
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
import ItemTypesCard from "@/components/ItemTypesCard";

interface ItemTypesContainerProps {
  itemTypes: ItemType[];
}

function ItemTypesContainer({ itemTypes }: ItemTypesContainerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [localItemTypes, setLocalItemTypes] = useState<ItemType[]>(itemTypes);
  const [editedItemType, setEditedItemType] = useState<ItemType | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(
    null
  );

  useEffect(() => {
    // Reset edited item type when selecting a new item type
    if (selectedItemType?.id !== editedItemType?.id) {
      setHasChanged(false);
      setEditedItemType(selectedItemType);
    } else {
      console.log(
        "has changed",
        JSON.stringify(editedItemType) !== JSON.stringify(selectedItemType)
      );
      setHasChanged(
        JSON.stringify(editedItemType) !== JSON.stringify(selectedItemType)
      );
    }
  }, [selectedItemType, editedItemType]);

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
          setLocalItemTypes((prev) => [...prev, data]);
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

  const handleDelete = (id: string): Promise<void> => {
    return axios
      .delete(`/api/item-types?id=${id}`)
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          setLocalItemTypes((prev) =>
            prev.filter((itemType) => itemType.id !== id)
          );
          setSelectedItemType(null);
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Something went wrong deleting Item Type. Please try again later."
        );
      });
  };

  const handleSave = (): Promise<void> => {
    return axios
      .put(`/api/item-types`, editedItemType)
      .then((res) => {
        const { success, message, data } = res.data;
        if (success) {
          setEditedItemType(data);
          setLocalItemTypes((prev) => {
            return prev.map((prevItemType) => {
              if (prevItemType.id === data.id) {
                return data;
              }
              return prevItemType;
            });
          });

          console.log("data", data);
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Something went wrong editing Item Type. Please try again later."
        );
      });
  };

  return (
    <div className="flex flex-row w-full h-full gap-x-6">
      <div className="w-1/2 flex flex-col">
        <div className="flex flex-row justify-between mb-2">
          <h1 className="font-semibold text-2xl">Item Types</h1>
          <Button
            variant="default"
            disabled={isCreating}
            onClick={handleCreate}
          >
            {isCreating ? "Creating" : "Create"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">
                Saltbox Vision Enabled
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localItemTypes.map((itemType) => (
              <TableRow
                key={itemType.id}
                onClick={() => setSelectedItemType(itemType)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{itemType.name}</TableCell>
                <TableCell>{convertNumberToCurrency(itemType.price)}</TableCell>
                <TableCell className="flex flex-row justify-end ">
                  {itemType.qualityControlInstructions &&
                  itemType.qualityControlImageURL ? (
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
        <ItemTypesCard
          itemTypes={itemTypes}
          selectedItemType={selectedItemType}
          setSelectedItemType={setSelectedItemType}
          handleDelete={handleDelete}
          handleSave={handleSave}
          setEditedItemType={setEditedItemType}
          editedItemType={editedItemType}
          hasChanged={hasChanged}
        />
      </div>
    </div>
  );
}

export default ItemTypesContainer;
