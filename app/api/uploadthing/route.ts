import { createNextRouteHandler } from "uploadthing/next";
import { itemTypeFileRouter, orderFileRouter } from "./core";

const combinedRouters = {
  ...itemTypeFileRouter,
  ...orderFileRouter,
};

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: combinedRouters,
});
