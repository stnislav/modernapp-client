import type { ItemDto } from '../types/item';
import type { PagedResponse } from '../types/paging';
import { httpGet } from './http';


export function getItems(signal?: AbortSignal) {
    return httpGet<PagedResponse<ItemDto>>('/api/items', signal);
}