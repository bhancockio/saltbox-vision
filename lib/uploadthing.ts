import { generateComponents } from "@uploadthing/react";

import type {
  ItemTypeFileRouter,
  OrderFileRouter,
} from "@/app/api/uploadthing/core";

export const { UploadButton: ItemTypeUploadButton } =
  generateComponents<ItemTypeFileRouter>();

export const { UploadButton: OrderFileUploadButton } =
  generateComponents<OrderFileRouter>();
