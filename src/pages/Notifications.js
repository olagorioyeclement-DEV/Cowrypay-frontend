import { useEffect, useState } from "react";
import API from "../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications/");
        setNotifications(res.data);
      } catch (err) {
        console.error(err.response?.data);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 && <p>No notifications</p>}
      <ul className="flex flex-col gap-2">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="p-2 border rounded bg-gray-50 hover:bg-gray-100"
          >
            {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}


