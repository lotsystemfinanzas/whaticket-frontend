import { useEffect, useState } from "react";
import api from "../../services/api";

export default function useChannels(type) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) return;
    setLoading(true);
    api.get("/channels", { params: { type } })
      .then(r => setChannels(r.data))
      .finally(() => setLoading(false));
  }, [type]);

  return { channels, loading };
}
