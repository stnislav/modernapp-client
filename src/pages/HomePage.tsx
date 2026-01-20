import { useState } from "react";
import { pingHealth } from "../api/health.api";
import { HttpError } from "../api/http";

export function HomePage() {
  const [status, setStatus] = useState<string>("Not checked yet");

  async function pingApi() {
    try {
      setStatus("Loading...");
      const result = await pingHealth();
      setStatus(`OK: ${result}`);
    } catch (e: any) {
      if (e instanceof HttpError) {
        setStatus(`Failed: ${e.status} ${e.statusText}${e.body ? ` | ${e.body}` : ""}`);
        return;
      }
      setStatus(`Error: ${e?.message ?? String(e)}`);
    }
  }

  return (
    <div>
      <h2>Home</h2>
      <p>Backend ping:</p>
      <button onClick={pingApi}>Ping API</button>
      <p style={{ marginTop: 12 }}>{status}</p>
    </div>
  );
}
