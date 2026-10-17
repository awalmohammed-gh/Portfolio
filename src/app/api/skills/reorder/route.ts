import { reorderHandler } from "@/lib/crud";
import { skillResource } from "@/lib/resources";

export const POST = reorderHandler(skillResource);
