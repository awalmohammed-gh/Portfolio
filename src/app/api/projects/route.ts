import { collectionHandlers } from "@/lib/crud";
import { projectResource } from "@/lib/resources";

export const { GET, POST } = collectionHandlers(projectResource);
