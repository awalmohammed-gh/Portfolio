import { collectionHandlers } from "@/lib/crud";
import { educationResource } from "@/lib/resources";

export const { GET, POST } = collectionHandlers(educationResource);
