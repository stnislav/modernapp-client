import { useQuery } from "@tanstack/react-query";
import { getItems } from "../api/items.api";
import type { ItemDto } from "../types/item";
import type { PagedResponse } from "../types/paging";
import { HttpError } from "../api/http";
import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";

export function ItemsPage() {

    const [page, setPage] = useState(1);
    const pageSize = 5;
    const query = useQuery<PagedResponse<ItemDto>, Error>({
        queryKey: ["items", page, pageSize],
        queryFn: ({ signal }) => getItems(signal, page, pageSize),
        placeholderData: keepPreviousData,
    });
    
    // Loading
    if (query.isPending) {
        return (
            <div>
                <h2>Items</h2>
                <p>Loading...</p>
            </div>
        );
    }

    // Error (your HttpError formatting kept)
    if (query.isError) {
        const e = query.error;
        const message =
            e instanceof HttpError
                ? `Failed: ${e.status} ${e.statusText}`
                : `Error: ${e?.message ?? String(e)}`;

        return (
            <div>
                <h2>Items</h2>
                <p>{message}</p>
            </div>
        );
    }

    const data = query.data;
    const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
    const hasNextPage = page <  totalPages;

    return (
        <div>
            <h2>Items</h2>

            {/* optional: subtle background refetch indicator */}
            {query.isFetching && <p style={{ opacity: 0.7 }}>Updating...</p>}

            {data.items.length === 0 && <p>No items found.</p>}

            {data.items.length > 0 && (
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
            <div style={{ display: "flex", gap: 8 }}>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || query.isFetching || query.isPending}
                >
                    Prev
                </button>

                <span>
                    Page {page} {query.isFetching ? "(updating…)" : ""}
                </span>

                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage || query.isFetching || query.isPending}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
