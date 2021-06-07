import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_URL } from 'src/app.constants';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http:HttpClient) { }

  addNote(uname,n,u){
    return this.http.post(`${APP_URL}/data/${uname}/add/${u}`,n)
  }

  setPin(uname,nid){
    return this.http.put(`${APP_URL}/data/setpin/${uname}/${nid}`,{})
  }

  updateNote(uname,nid,n){
    return this.http.put(`${APP_URL}/data/update/${uname}/${nid}`,n)
  }

  getAll(uname,from,to){
    return this.http.get<any>(`${APP_URL}/data/${uname}/getall/${from}/${to}`)
  }

  get(nid){
    return this.http.get<any>(`${APP_URL}/data/get/${nid}`)
  }

  remove(nid){
    return this.http.delete(`${APP_URL}/data/remove/${nid}`)
  }
}
