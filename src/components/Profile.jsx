import { useState, useEffect, useRef } from "react";
import { User, Shield, CheckCircle, AlertCircle, Camera, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const defaultProfileState = {
  firstName: "",
  lastName: "",
  email: "",
  profilePicture: "",
};

export default function Profile() {
  const { signOut, user } = useAuth();
  const [profile, setProfile] = useState(defaultProfileState);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: null, text: "" });
  const fileInputRef = useRef(null);

  // Load profile data on mount
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setProfile((prev) => ({
        ...prev,
        firstName: metadata.first_name || prev.firstName,
        lastName: metadata.last_name || prev.lastName,
        email: user.email || prev.email,
      }));

      const savedProfile = localStorage.getItem("user_profile");
      if (savedProfile) {
        try {
          const stored = JSON.parse(savedProfile);
          setProfile((prev) => ({
            ...prev,
            firstName: stored.firstName || prev.firstName,
            lastName: stored.lastName || prev.lastName,
            profilePicture: stored.profilePicture || prev.profilePicture,
          }));
        } catch (error) {
          console.error("Error loading profile from localStorage:", error);
        }
      }
    }
  }, [user]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveMessage({ type: "error", text: "Please select an image file." });
      setTimeout(() => setSaveMessage({ type: null, text: "" }), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: "error", text: "Image size must be less than 5MB." });
      setTimeout(() => setSaveMessage({ type: null, text: "" }), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePicture: reader.result }));
      setSaveMessage({ type: null, text: "" });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: null, text: "" });

    try {
      if (user && supabase) {
        const { error } = await supabase.auth.updateUser({
          data: {
            first_name: profile.firstName,
            last_name: profile.lastName,
          },
        });
        if (error) throw error;
      }

      localStorage.setItem(
        "user_profile",
        JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          profilePicture: profile.profilePicture,
        })
      );

      window.dispatchEvent(new Event("userProfileUpdated"));

      setSaveMessage({ type: "success", text: "Profile saved successfully!" });
      setTimeout(() => setSaveMessage({ type: null, text: "" }), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Update your personal details and manage account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Details */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h2 className="font-medium text-sm sm:text-base text-slate-900">Profile</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-3 sm:space-y-4">
            <div className="flex flex-col items-center sm:items-start">
              <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-slate-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors"
                  title="Change profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Click the camera icon to change your profile picture. Don&apos;t forget to click &quot;Save changes&quot; to
                apply.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">First name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleProfileChange("firstName", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Alex"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Last name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleProfileChange("lastName", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Morgan"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                placeholder="alex@mymail.com"
                title="Email cannot be changed here"
              />
              <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
            </div>
            {saveMessage.type && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  saveMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {saveMessage.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{saveMessage.text}</span>
              </div>
            )}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 text-sm shadow hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Security */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h2 className="font-medium text-sm sm:text-base text-slate-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Change password</label>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  type="password"
                  placeholder="Current"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="password"
                  placeholder="New"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="password"
                  placeholder="Confirm"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm shadow hover:bg-indigo-700"
                >
                  Update password
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Two-factor authentication</p>
                <p className="text-xs text-slate-600">Add an extra layer of security</p>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Configure
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Sign out</p>
                <p className="text-xs text-slate-600">Sign out of your account</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

