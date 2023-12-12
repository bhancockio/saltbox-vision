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
    const itemTypeToDelete = await prismadb.itemType.findUnique({
      where: { id },
    });

    if (!itemTypeToDelete) {
      return NextResponse.json({
        message: "Item Type not found",
        success: false,
      });
    }

    await prismadb.itemType.delete({ where: { id } });

    return NextResponse.json(
      { message: "Successfully deleted item type", data: null, success: true },
      { status: 202 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting item type" },
      { status: 500 }
    );
  }
}
