import { itemHandlers } from "@/lib/crud";
import { skillCategoryResource } from "@/lib/resources";

export const { GET, PATCH, DELETE } = itemHandlers(skillCategoryResource);
