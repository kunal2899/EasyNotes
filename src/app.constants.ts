import { HttpHeaders } from '@angular/common/http'

export const APP_URL = "https://kunalkj.pythonanywhere.com/"
export const CORS_HEADERS = {
    headers : new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    })
}
export const AUTH_HEADERS = {
    headers : new HttpHeaders({
        'Authorization' : sessionStorage.getItem('token'),
    })
}