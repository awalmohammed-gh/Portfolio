import { collectionHandlers } from "@/lib/crud";
import { experienceResource } from "@/lib/resources";

export const { GET, POST } = collectionHandlers(experienceResource);
