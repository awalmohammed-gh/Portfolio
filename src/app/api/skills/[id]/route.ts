import { itemHandlers } from "@/lib/crud";
import { skillResource } from "@/lib/resources";

export const { GET, PATCH, DELETE } = itemHandlers(skillResource);
