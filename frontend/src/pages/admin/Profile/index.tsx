import { useAuth } from "../../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500">Name</p>
            <p className="text-sm text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Email</p>
            <p className="text-sm text-gray-900">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
