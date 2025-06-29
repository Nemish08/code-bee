import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const syncUser = async (token, user) => {
  if (!token || !user) return;

  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/sync`,
      {
        email: user.primaryEmailAddress?.emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ User synced to backend");
  } catch (err) {
    console.error("❌ Sync failed:", err.response?.data || err.message);
  }
};

export default syncUser;
