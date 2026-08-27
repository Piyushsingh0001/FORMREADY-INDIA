import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { SeoService } from './core/services/seo.service';
import { OnInit } from '@angular/core';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('formready-india');

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.init();
  }
}
