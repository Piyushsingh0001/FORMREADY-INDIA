import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal.html',
  styleUrl: './legal.scss'
})
export class Legal implements OnInit {
  private route = inject(ActivatedRoute);
  
  pageType: 'privacy' | 'terms' | 'about' = 'privacy';
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.route.url.subscribe(url => {
      if (url.length > 0) {
        this.pageType = url[0].path as 'privacy' | 'terms' | 'about';
      }
    });
  }
}
