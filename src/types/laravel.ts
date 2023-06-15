import { ModelConstructorAttributes } from "./model";

export interface LaravelPaginatedResponse {
    current_page: number;
    data: ModelConstructorAttributes[];
    first_page_url: string | null;
    from: number;
    last_page: number;
    last_page_url: string | null;
    links: Array<{
        active: boolean;
        label: string;
        url: string | null;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface LaravelItemResponse extends ModelConstructorAttributes { }

