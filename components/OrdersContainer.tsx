"use client";

import { HydratedOrderItem } from "@/app/(dashboard)/orders/page";
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
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import OrderCard from "./OrdersCard";

interface OrdersContainerProps {
  orderItems: HydratedOrderItem[];
}

function OrdersContainer({ orderItems }: OrdersContainerProps) {
  const [selectedOrderItem, setSelectedOrderItem] =
    useState<HydratedOrderItem | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [localOrderItems, setLocalOrderItems] =
    useState<HydratedOrderItem[]>(orderItems);

  const handleSeed = () => {
    setIsSeeding(true);
    axios
      .post<{ success: boolean; data: HydratedOrderItem[]; message: string }>(
        "/api/order-item/seed"
      )
      .then((res) => {
        const { success, message, data } = res.data;
        if (success) {
          setLocalOrderItems((prev) => [...prev, ...data]);
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Something went wrong creating orders. Please try again later."
        );
      })
      .finally(() => {
        setIsSeeding(false);
      });
  };

  const validateOrderQuality = () => {
    // TODO: send message with image url to AI
  };

  // TODO: Upload new image to upload thing

  return (
    <div className="flex flex-row w-full h-full gap-x-6">
      <div className="w-1/2 flex flex-col">
        <div className="flex flex-row justify-between mb-2">
          <h1 className="font-semibold text-2xl">Orders</h1>
          <Button variant="default" disabled={isSeeding} onClick={handleSeed}>
            {isSeeding ? "Seeding" : "Seed"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Order Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localOrderItems.map((orderItem) => (
              <TableRow
                key={orderItem.id}
                onClick={() => setSelectedOrderItem(orderItem)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{orderItem.orderId}</TableCell>
                <TableCell>{orderItem.quantity}</TableCell>
                <TableCell>{orderItem.order.amount}</TableCell>
                <TableCell>
                  {moment(orderItem.createdAt).format("YYYY-MM-DD")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {localOrderItems.length === 0 && (
          <div className="text-center w-full my-2">
            <p className="text-gray-500">
              No orders found. Please create a new one.
            </p>
          </div>
        )}
      </div>
      <div className="w-1/2 flex flex-col">
        <OrderCard
          orderItem={selectedOrderItem}
          setOrderItem={setSelectedOrderItem}
          setOrderItems={setLocalOrderItems}
        />
      </div>
    </div>
  );
}

export default OrdersContainer;
