import { useEffect, useRef, useState } from "react";
import { getItems } from "../api/items.api";
import type { ItemDto } from "../types/item";
import type { PagedResponse } from "../types/paging";
import { HttpError } from "../api/http";

export function ItemsPage() {
    const [data, setData] = useState<PagedResponse<ItemDto> | null>(null);
    const [status, setStatus] = useState<string>("Loading...");
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        (async () => {
            try {
                setStatus("Loading...");
                const result = await getItems(ac.signal);
                setData(result);
                setStatus("OK");
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                if (e instanceof HttpError) {
                    setStatus(`Failed: ${e.status} ${e.statusText}`);
                    return;
                }
                setStatus(`Error: ${e?.message ?? String(e)}`);
            }
        })();

        return () => ac.abort();
    }, []);

    if (status !== "OK") {
        return (
            <div>
                <h2>Items</h2>
                <p>{status}</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Items</h2>

            {data && data.items.length === 0 && <p>No items found.</p>}

            {data && data.items.length > 0 && (
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Id</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Name</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Created</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((x) => (
                            <tr key={x.id}>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{x.id}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{x.name}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{x.createdAt}</td>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                                    <button onClick={() => alert(`Edit item ${x.id}`)}>Edit</button>
                                    <button onClick={() => alert(`Delete item ${x.id}`)} style={{ marginLeft: 8 }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
