import { Component, signal } from '@angular/core';
import { Attachment, Ticket, TicketService } from './ticket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RxJs');

   tickets: Ticket[] = [];
  currentTicket: Ticket | null = null;
  attachments: Attachment[] = [];
  selectedFile: File | null = null;
  statusFilter: string = '';

  newTicket: Partial<Ticket> = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'new'
  };

  updateData: Partial<Ticket> = {};

  constructor(private apiService: TicketService) {
    this.loadTickets();
  }

  // Ticket methods
  loadTickets() {
    this.apiService.getTickets(this.statusFilter).subscribe({
      next: (tickets) => this.tickets = tickets,
      error: (error) => console.error('Error loading tickets:', error)
    });
  }

  createTicket() {
    this.apiService.createTicket(this.newTicket).subscribe({
      next: (ticket) => {
        this.tickets.push(ticket);
        this.newTicket = { title: '', description: '', priority: 'medium', status: 'new' };
        console.log('Ticket created:', ticket);
      },
      error: (error) => console.error('Error creating ticket:', error)
    });
  }

  selectTicket(ticket: Ticket) {
    this.currentTicket = ticket;
    this.updateData = { ...ticket };
    this.loadAttachments(ticket.id!);
  }

  updateTicket() {
    if (!this.currentTicket) return;
    
    this.apiService.updateTicket(this.currentTicket.id!, this.updateData).subscribe({
      next: (ticket) => {
        this.currentTicket = ticket;
        this.loadTickets();
        console.log('Ticket updated:', ticket);
      },
      error: (error) => console.error('Error updating ticket:', error)
    });
  }

  deleteTicket(id: string) {
    this.apiService.deleteTicket(id).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== id);
        if (this.currentTicket?.id === id) {
          this.currentTicket = null;
        }
        console.log('Ticket deleted');
      },
      error: (error) => console.error('Error deleting ticket:', error)
    });
  }

  // Attachment methods
  loadAttachments(ticketId: string) {
    this.apiService.getAttachments(ticketId).subscribe({
      next: (attachments) => this.attachments = attachments,
      error: (error) => console.error('Error loading attachments:', error)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile || !this.currentTicket) return;

    this.apiService.uploadAttachment(this.currentTicket.id!, this.selectedFile).subscribe({
      next: (attachment) => {
        this.attachments.push(attachment);
        this.selectedFile = null;
        console.log('File uploaded:', attachment);
      },
      error: (error) => console.error('Error uploading file:', error)
    });
  }

  downloadFile(attachment: Attachment) {
    if (!this.currentTicket) return;

    this.apiService.downloadAttachment(this.currentTicket.id!, attachment.id!).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.originalName;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('File downloaded:', attachment.originalName);
      },
      error: (error) => console.error('Error downloading file:', error)
    });
  }

  deleteFile(attachmentId: string) {
    if (!this.currentTicket) return;

    this.apiService.deleteAttachment(this.currentTicket.id!, attachmentId).subscribe({
      next: () => {
        this.attachments = this.attachments.filter(a => a.id !== attachmentId);
        console.log('File deleted');
      },
      error: (error) => console.error('Error deleting file:', error)
    });
  }
}
