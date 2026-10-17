/*
 * Creates the administrator account, or resets its password.
 *
 *   npm run admin:create
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from the environment (.env.local or
 * .env). There is no public registration; this script is the only way to
 * provision an admin. Remove ADMIN_PASSWORD from your env file afterwards.
 *
 * Flags:
 *   --reset-password   update the password of an existing admin and sign
 *                      out all of its sessions
 */
import { hashPassword } from "@/lib/auth/password";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import { emailField, passwordRules } from "@/lib/validations/auth";
import { AdminModel, SessionModel } from "@/models/Auth";
import { loadEnv } from "./load-env";

async function main() {
  loadEnv();
  const email = emailField.safeParse(process.env.ADMIN_EMAIL ?? "");
  const password = passwordRules.safeParse(process.env.ADMIN_PASSWORD ?? "");
  if (!email.success) throw new Error("Set ADMIN_EMAIL to a valid email address.");
  if (!password.success) throw new Error(`ADMIN_PASSWORD: ${password.error.issues[0]?.message}`);

  const resetPassword = process.argv.includes("--reset-password");
  await connectToDatabase();
  await AdminModel.createIndexes();
  await SessionModel.createIndexes();

  const existing = await AdminModel.findOne({ email: email.data });
  if (existing) {
    if (!resetPassword) {
      console.log(`An admin with ${email.data} already exists. Nothing changed.`);
      console.log("Run with --reset-password to set a new password from ADMIN_PASSWORD.");
      return;
    }
    existing.passwordHash = await hashPassword(password.data);
    existing.passwordChangedAt = new Date();
    await existing.save();
    const { deletedCount } = await SessionModel.deleteMany({ adminId: existing._id });
    console.log(`Password updated for ${email.data}. Signed out ${deletedCount} session(s).`);
    return;
  }

  const count = await AdminModel.countDocuments();
  if (count > 0 && !process.argv.includes("--additional")) {
    throw new Error(
      "A different admin account already exists. This portfolio supports a single administrator; pass --additional to create another anyway.",
    );
  }

  await AdminModel.create({
    email: email.data,
    name: process.env.ADMIN_NAME?.trim() || "Administrator",
    passwordHash: await hashPassword(password.data),
    passwordChangedAt: new Date(),
  });
  console.log(`Admin account created for ${email.data}. Sign in at /admin/login.`);
  console.log("You can now remove ADMIN_PASSWORD from your env file.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => disconnectFromDatabase());
