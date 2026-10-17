import { reorderHandler } from "@/lib/crud";
import { skillCategoryResource } from "@/lib/resources";

export const POST = reorderHandler(skillCategoryResource);
