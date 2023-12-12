import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "No id provided", success: false },
      { status: 400 }
    );
  }

  try {
    const orderItemToDelete = await prismadb.orderItem.findUnique({
      where: { id },
    });

    if (!orderItemToDelete) {
      return NextResponse.json({
        message: "OrderItem not found",
        success: false,
      });
    }

    await prismadb.orderItem.delete({ where: { id } });

    return NextResponse.json(
      { message: "Successfully deleted orderItem", data: null, success: true },
      { status: 202 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting orderIterm" },
      { status: 500 }
    );
  }
}
