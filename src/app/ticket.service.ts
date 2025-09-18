import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id?: string;
  objectName: string;
  originalName: string;
  mimetype: string;
  size: number;
  ticketId: string;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Tickets methods
  getTickets(status?: string): Observable<Ticket[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets`, { params });
  }

  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/tickets/${id}`);
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUrl}/tickets`, ticket);
  }

  updateTicket(id: string, data: Partial<Ticket>): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.baseUrl}/tickets/${id}`, data);
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tickets/${id}`);
  }

  // Attachments methods
  getAttachments(ticketId: string): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.baseUrl}/tickets/${ticketId}/attachments`);
  }

  uploadAttachment(ticketId: string, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Attachment>(`${this.baseUrl}/tickets/${ticketId}/attachments`, formData);
  }

  downloadAttachment(ticketId: string, fileId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/tickets/${ticketId}/attachments/${fileId}/download`, {
      responseType: 'blob'
    });
  }

  deleteAttachment(ticketId: string, fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tickets/${ticketId}/attachments/${fileId}`);
  }
}