import { collectionHandlers } from "@/lib/crud";
import { skillResource } from "@/lib/resources";

export const { GET, POST } = collectionHandlers(skillResource);
