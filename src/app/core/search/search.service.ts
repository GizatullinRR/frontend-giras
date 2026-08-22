import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api';

export type SearchKind = 'workwear';

export interface SearchHit {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
}

export function searchHitPath(hit: Pick<SearchHit, 'kind' | 'id'>): string | null {
  switch (hit.kind) {
    case 'workwear':
      return `/workwear/${hit.id}`;
    default:
      return null;
  }
}

export interface SearchResponse {
  items: SearchHit[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);

  find(q: string, limit = 8) {
    return this.http.get<SearchResponse>(`${API_URL}/search`, {
      params: { q, limit: String(limit) },
    });
  }
}
