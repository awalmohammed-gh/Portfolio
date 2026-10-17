import { reorderHandler } from "@/lib/crud";
import { projectResource } from "@/lib/resources";

export const POST = reorderHandler(projectResource);
