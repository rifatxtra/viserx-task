import { useEffect, useState, type FormEvent } from "react";
import api from "../../../lib/api";

export default function SettingsPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [defaultEmail, setDefaultEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      if (response.status === 200) {
        setAdminEmail(response.data.admin_email || "");
        setDefaultEmail(response.data.default_admin_email || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const response = await api.put("/settings", { admin_email: adminEmail });
      setAdminEmail(response.data.admin_email || "");
      setSuccess("Settings saved");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Settings</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg border border-gray-200 bg-white p-6"
      >
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </p>
        )}

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Product notification email
          </label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder={defaultEmail || "admin@example.com"}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Recipient of the email sent when a product is created or updated.
            Leave blank to use the default ({defaultEmail || "admin@example.com"}
            ).
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
