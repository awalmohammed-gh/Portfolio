import { itemHandlers } from "@/lib/crud";
import { serviceResource } from "@/lib/resources";

export const { GET, PATCH, DELETE } = itemHandlers(serviceResource);
