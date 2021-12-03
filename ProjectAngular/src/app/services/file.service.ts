import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  fileUrl = 'http://localhost:9999/api/file'

  constructor(private http: HttpClient) {}

  // define function to upload files
  upload(formData: FormData): Observable<HttpEvent<String[]>> {
    return this.http.post<string[]>(`${this.fileUrl}/upload`, formData, {
      observe: 'events'
    });
  }
}
