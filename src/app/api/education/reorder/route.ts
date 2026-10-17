import { reorderHandler } from "@/lib/crud";
import { educationResource } from "@/lib/resources";

export const POST = reorderHandler(educationResource);
