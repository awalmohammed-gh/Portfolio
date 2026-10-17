import { reorderHandler } from "@/lib/crud";
import { experienceResource } from "@/lib/resources";

export const POST = reorderHandler(experienceResource);
