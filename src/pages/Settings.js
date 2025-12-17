import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: "soft",
    notifications_enabled: true,
    transaction_alerts: true,
    pin_set: false,
  });

  useEffect(() => {
    axios.get("/settings/")
      .then(res => {
        setSettings(res.data);

        // keep frontend in sync
        if (res.data.pin_set !== undefined) {
          localStorage.setItem("pin_set", String(res.data.pin_set));
        }
      })
      .catch(() => alert("Failed to load settings"));
  }, []);

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);

    axios.put("/settings/", { [key]: value })
      .catch(() => alert("Failed to save setting"));
  };

  const pinSet =
    settings.pin_set ??
    localStorage.getItem("pin_set") === "true";

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>

      {/* Theme */}
      <label className="block">
        <span className="block mb-1">Theme</span>
        <select
          value={settings.theme}
          onChange={e => updateSetting("theme", e.target.value)}
          className="w-full p-2 rounded border"
        >
          <option value="soft">Soft</option>
          <option value="midnight">Midnight</option>
          <option value="ocean">Ocean</option>
        </select>
      </label>

      {/* Notifications */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.notifications_enabled}
          onChange={e =>
            updateSetting("notifications_enabled", e.target.checked)
          }
        />
        Enable Notifications
      </label>

      {/* Transaction Alerts */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.transaction_alerts}
          onChange={e =>
            updateSetting("transaction_alerts", e.target.checked)
          }
        />
        Transaction Alerts
      </label>

      {/* PIN SECTION */}
      <div className="pt-4 border-t">
        <button
          onClick={() =>
            navigate(pinSet ? "/change-pin" : "/set-pin")
          }
          className="w-full py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {pinSet ? "Change PIN" : "Set PIN"}
        </button>
      </div>
    </div>
  );
}
