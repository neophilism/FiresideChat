import { redirect } from "next/navigation";
import {
  adminIsConfigured,
  isAdminAuthenticated,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  if (await isAdminAuthenticated()) redirect("/admin");

  const { error } = await searchParams;
  const configured = adminIsConfigured();

  return (
    <div className="detail-page">
      <section className="search-hero admin-login-hero">
        <p className="eyebrow">Private operations</p>
        <h1>Archive control room.</h1>
        <p className="lede compact-lede">
          Feed health, ingestion failures, transcript coverage, and operational
          status for Fireside Chat.
        </p>

        {configured ? (
          <form className="admin-login-form" action="/api/admin/session" method="post">
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
              />
            </label>
            <button type="submit">Enter control room</button>
            {error ? (
              <p className="admin-login-error" role="alert">
                The password was not accepted.
              </p>
            ) : null}
          </form>
        ) : (
          <div className="empty-state">
            <strong>Admin access is not configured.</strong>
            <span>
              Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the deployment
              environment before using this private interface.
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
