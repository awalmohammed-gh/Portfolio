import { connection, type NextRequest } from "next/server";
import { handle, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { contentSections, parseSection } from "@/lib/validations/content";
import { SiteContentModel } from "@/models/SiteContent";

/** All page content sections, parsed against their schemas. */
export const GET = handle(async (request: NextRequest) => {
  void request;
  await connection();
  await connectToDatabase();
  const docs = await SiteContentModel.find({ section: { $in: contentSections } }).lean();
  const stored = new Map(docs.map((doc) => [doc.section, doc]));
  return ok(
    Object.fromEntries(
      contentSections.map((section) => [section, parseSection(section, stored.get(section)?.data)]),
    ),
  );
});
