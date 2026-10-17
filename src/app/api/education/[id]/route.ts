import { itemHandlers } from "@/lib/crud";
import { educationResource } from "@/lib/resources";

export const { GET, PATCH, DELETE } = itemHandlers(educationResource);
