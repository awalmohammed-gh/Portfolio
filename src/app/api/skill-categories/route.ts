import { collectionHandlers } from "@/lib/crud";
import { skillCategoryResource } from "@/lib/resources";

export const { GET, POST } = collectionHandlers(skillCategoryResource);
