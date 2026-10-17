import { itemHandlers } from "@/lib/crud";
import { experienceResource } from "@/lib/resources";

export const { GET, PATCH, DELETE } = itemHandlers(experienceResource);
