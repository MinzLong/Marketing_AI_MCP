import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("Loading...");
  const [name, setName] = useState("World");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(`/api/hello?name=${encodeURIComponent(name)}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error("Failed to load message");
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage("API unavailable");
        }
      }
    }

    load();

    return () => controller.abort();
  }, [name]);

  return (
    <div className="app">
      <header className="hero">
        <h1>Marketing AI</h1>
        <p>React frontend + Python FastAPI backend</p>
      </header>

      <section className="card">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Type your name"
        />
        <div className="message">{message}</div>
      </section>
    </div>
  );
}
