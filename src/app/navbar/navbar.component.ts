import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cookieValue = null;
  decodedToken = null;

  constructor(private _cookieService: CookieService) { }

  ngOnInit(): void {
    this.cookieValue = this.getCookie('token');
    if (this.cookieValue) {
      this.decodedToken = helper.decodeToken(this.cookieValue);
    }
  }

  getCookie(key: string) {
    return this._cookieService.get(key);
  }

  removeCookie(key: string){
    this._cookieService.remove(key);
  }

  logout() {
    this.removeCookie('token');
    this.cookieValue = null;
    this.decodedToken = null;
  }
}
