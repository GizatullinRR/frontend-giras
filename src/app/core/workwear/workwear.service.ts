import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api';
import {
  CreateWorkwearPayload,
  UpdateWorkwearPayload,
  Workwear,
} from './workwear.types';

@Injectable({ providedIn: 'root' })
export class WorkwearService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_URL}/workwear`;

  findAll() {
    return this.http.get<Workwear[]>(this.base);
  }

  findOne(id: string) {
    return this.http.get<Workwear>(`${this.base}/${id}`);
  }

  create(payload: CreateWorkwearPayload) {
    return this.http.post<Workwear>(this.base, payload);
  }

  update(id: string, payload: UpdateWorkwearPayload) {
    return this.http.patch<Workwear>(`${this.base}/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete<Workwear>(`${this.base}/${id}`);
  }

  copy(id: string) {
    return this.http.post<Workwear>(`${this.base}/${id}/copy`, {});
  }

  reorder(ids: string[]) {
    return this.http.patch<Workwear[]>(`${this.base}/reorder`, { ids });
  }

  addImage(id: string, file: File) {
    const data = new FormData();
    data.append('file', file, file.name);
    return this.http.post<Workwear>(`${this.base}/${id}/images`, data);
  }

  removeImage(id: string, key: string) {
    return this.http.delete<Workwear>(`${this.base}/${id}/images`, {
      params: { key },
    });
  }
}
