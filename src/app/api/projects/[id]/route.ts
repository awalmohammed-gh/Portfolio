import { itemHandlers } from "@/lib/crud";
import { projectResource } from "@/lib/resources";

export const { GET, PATCH, DELETE } = itemHandlers(projectResource);
