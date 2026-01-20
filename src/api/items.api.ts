import type { ItemDto } from '../types/item';
import type { PagedResponse } from '../types/paging';
import { httpGet } from './http';


export function getItems(signal?: AbortSignal, page?: number, pageSize?: number): Promise<PagedResponse<ItemDto>> {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (pageSize !== undefined) params.append('pageSize', pageSize.toString());

    return httpGet<PagedResponse<ItemDto>>(`/api/items?${params}`, signal);
}