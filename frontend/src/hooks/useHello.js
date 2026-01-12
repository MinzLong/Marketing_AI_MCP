import { useEffect, useState } from "react";

import { getHello } from "../services/marketingApi.js";

export default function useHello() {
  const [name, setName] = useState("World");
  const [message, setMessage] = useState("Loading...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      try {
        const data = await getHello(name, controller.signal);
        setMessage(data.message);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage("API unavailable");
          setStatus("error");
        }
      }
    }

    load();

    return () => controller.abort();
  }, [name]);

  return { name, setName, message, status };
}
