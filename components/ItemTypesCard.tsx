import { ItemType } from "@prisma/client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import "@uploadthing/react/styles.css";
import { ItemTypeUploadButton } from "@/lib/uploadthing";

interface ItemsTypeCardProps {
  selectedItemType: ItemType | null;
  editedItemType: ItemType | null;
  setEditedItemType: React.Dispatch<React.SetStateAction<ItemType | null>>;
  setSelectedItemType: Dispatch<SetStateAction<ItemType | null>>;
  itemTypes: ItemType[];
  handleDelete: (id: string) => Promise<void>;
  handleSave: () => Promise<void>;
  hasChanged: boolean;
}

function ItemTypesCard({
  selectedItemType,
  handleDelete,
  handleSave,
  editedItemType,
  setEditedItemType,
  hasChanged,
}: ItemsTypeCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle empty selected item type
  if (!editedItemType || !selectedItemType)
    return (
      <div className="bg-white w-full min-h-[300px] rounded-md drop-shadow-lg p-6 flex flex-col">
        <div className="text-center my-auto">
          <p className="text-gray-500 ">
            No item type selected. Please select one from the list.
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-white w-full min-h-[300px] rounded-md drop-shadow-lg p-6 flex flex-col">
      <div className="flex flex-col gap-y-3 w-full">
        <div>
          <Label>Name:</Label>
          <Input
            value={editedItemType.name}
            onChange={(e) => {
              setEditedItemType((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  name: e.target.value,
                };
              });
            }}
          />
        </div>
        <div>
          <Label>Price:</Label>
          <Input
            value={editedItemType.price}
            type="number"
            onChange={(e) => {
              setEditedItemType((prev) => {
                if (!prev) return prev;

                return {
                  ...prev,
                  price: parseFloat(e.target.value),
                };
              });
            }}
          />
        </div>
        <hr />
        <div>
          <Label>Quality Control Image:</Label>
          <div>
            {editedItemType.qualityControlImageURL ? (
              <img
                className="max-h-[250px] mx-auto my-4"
                src={editedItemType.qualityControlImageURL}
                alt="quality control image"
              />
            ) : (
              <div className="text-center my-4">
                <p className="text-gray-600 text-xs">
                  No quality control image uploaded. Please upload one below.
                </p>
              </div>
            )}
            <ItemTypeUploadButton
              input={{ itemTypeId: selectedItemType.id }}
              appearance={{
                button:
                  "bg-white-500 border text-black border-[#fcb503] hover:bg-[#fcb503] hover:text-white focus-within:ring-[#fcb503] after:bg-[#fcb503]",
              }}
              endpoint="itemTypeImageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                if (res && (res?.length ?? 0) > 0) {
                  toast.success("Successfully uploaded image!");
                  const file = res[0];
                  file &&
                    setEditedItemType((prev) => {
                      if (!prev) return prev;

                      return {
                        ...prev,
                        qualityControlImageURL: file.url,
                      };
                    });
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </div>
        <div>
          <Label>Quality Control Instructions:</Label>
          <Textarea
            value={editedItemType.qualityControlInstructions ?? ""}
            onChange={(e) => {
              setEditedItemType((prev) => {
                if (!prev) return prev;

                return {
                  ...prev,
                  qualityControlInstructions: e.target.value,
                };
              });
            }}
          />
        </div>
        <div className="w-full flex flex-row justify-center gap-x-4">
          <Button
            disabled={!hasChanged}
            onClick={async () => {
              setIsSaving(true);
              await handleSave();
              setIsSaving(false);
            }}
          >
            {isSaving ? "Saving" : "Save"}
          </Button>
          <Button
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true);
              await handleDelete(selectedItemType.id);
              setIsDeleting(false);
            }}
            variant="destructive"
          >
            {isDeleting ? "Deleting" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ItemTypesCard;
