import { HydratedOrderItem } from "@/app/(dashboard)/orders/page";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Label } from "./ui/label";
import { OrderFileUploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import axios from "axios";

interface OrdersCardProps {
  orderItem: HydratedOrderItem | null;
  setOrderItem: Dispatch<SetStateAction<HydratedOrderItem | null>>;
}

function OrderCard({ orderItem, setOrderItem }: OrdersCardProps) {
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async (orderItemId: string) => {
    setIsValidating(true);

    axios
      .post<{ message: string; success: boolean; data: HydratedOrderItem }>(
        "/api/validate-order-quality",
        { id: orderItemId }
      )
      .then((res) => {
        const { success, message, data } = res.data;
        if (success) {
          setOrderItem(data);
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Something went wrong validating order quality. Please try again later."
        );
      })
      .finally(() => {
        setIsValidating(false);
      });
  };

  // Handle empty selected order
  if (!orderItem)
    return (
      <div className="bg-white w-full min-h-[300px] rounded-md drop-shadow-lg p-6 flex flex-col">
        <div className="text-center my-auto">
          <p className="text-gray-500 ">
            No order selected. Please select one from the list.
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-white w-full min-h-[300px] rounded-md drop-shadow-lg p-6 flex flex-col">
      <div className="flex flex-col gap-y-3 w-full">
        <div className="text-center">
          <Label className="text-xl font-normal">
            Order ID: {orderItem?.order.id}
          </Label>
        </div>
        <div>
          <Label>Items</Label>
          <p>
            {orderItem?.quantity} - {orderItem?.item.itemType.name}
          </p>
        </div>
        {orderItem?.item.itemType.qualityControlImageURL &&
          orderItem?.item.itemType.qualityControlInstructions && (
            <>
              <div>
                <Label>Example:</Label>
                <img
                  className="max-h-[250px] mx-auto my-4"
                  src={orderItem?.item.itemType.qualityControlImageURL}
                  alt="quality control image"
                />
              </div>
              <div>
                <Label>Validate Quality Control:</Label>
                {orderItem?.qualityControlImageURL ? (
                  <img
                    className="max-h-[250px] mx-auto my-4"
                    src={orderItem?.qualityControlImageURL}
                    alt="quality control image"
                  />
                ) : (
                  <div className="text-center my-4">
                    <p className="text-gray-600 text-xs">
                      No quality control image uploaded. Please upload one.
                    </p>
                  </div>
                )}

                <OrderFileUploadButton
                  input={{ orderItemId: orderItem.id }}
                  appearance={{
                    button:
                      "bg-white-500 border text-black border-[#fcb503] hover:bg-[#fcb503] hover:text-white focus-within:ring-[#fcb503] after:bg-[#fcb503]",
                  }}
                  endpoint="orderImageUploader"
                  onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    if (res && (res?.length ?? 0) > 0) {
                      toast.success("Successfully uploaded image!");
                      const file = res[0];
                      file &&
                        setOrderItem((prev) => {
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
                {orderItem.qualityControlImageURL && (
                  <div className="flex flex-row justify-center my-4">
                    <Button onClick={() => handleValidate(orderItem.id)}>
                      {isValidating ? "Validating..." : "Validate"}
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label>Validate Quality Control:</Label>
              </div>
            </>
          )}
      </div>
    </div>
  );
}

export default OrderCard;
