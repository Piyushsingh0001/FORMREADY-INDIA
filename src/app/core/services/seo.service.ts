import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  init() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['title'] || this.titleService.getTitle();
      const desc = data['description'] || 'Free online utility to resize, compress, and convert your photos, signatures, and documents for Indian government exams, visas, and online forms. 100% private.';
      const canonical = data['canonical'] || 'https://formready-india.vercel.app' + this.router.url;
      
      this.titleService.setTitle(title);
      
      this.metaService.updateTag({ name: 'description', content: desc });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: desc });
      this.metaService.updateTag({ property: 'og:url', content: canonical });
      
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: desc });

      this.updateCanonicalUrl(canonical);
    });
  }

  private updateCanonicalUrl(url: string) {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    // Remove query params for canonical if any exist
    link.setAttribute('href', url.split('?')[0]);
  }
}
