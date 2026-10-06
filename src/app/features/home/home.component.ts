import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule, MatIconModule, FormsModule, ProductCardComponent, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

    // Inject services
    private readonly productService = inject(ProductService);
    private readonly authService = inject(AuthService);
    private readonly cartService = inject(CartService);
    private readonly wishlistService = inject(WishlistService);
    private readonly router = inject(Router);

    // SEO helpers (added)
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);
    private readonly document = inject(DOCUMENT);
    private jsonLdScripts: HTMLScriptElement[] = [];

    // TODO: replace with your real domain and share image
    private readonly siteUrl = 'https://www.your-domain.com';
    private readonly shareImage = `${this.siteUrl}/assets/og-cover.jpg`;

    // Component properties
    wishlistProductIds = new Set<string>();
    products: Product[] = [];
    loading = false;
    errorMessage = '';
    newsletterEmail = '';
    isSubscribing = false;

    ngOnInit(): void {
        this.setSeo();
        this.loadProducts();

        if (this.authService.isLoggedIn) {
            this.loadWishlist();
        }
    }

    ngOnDestroy(): void {
        this.jsonLdScripts.forEach(script => script.remove());
    }

    /**
     * SEO: title, meta description, Open Graph / Twitter tags, canonical + JSON-LD
     */
    private setSeo(): void {
        const title = 'Mooligai — Karuveppilai Powder, Herbal Hair Oil & Face Pack | Madurai';
        const description =
            'Karuveppilai powder, vendhaya powder, herbal hair oil and face packs from Madurai. ' +
            'Sun-dried, stone-ground and made in small batches from a 1948 family recipe.';

        this.titleService.setTitle(title);

        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

        // Open Graph
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:site_name', content: 'Mooligai' });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:url', content: this.siteUrl });
        this.metaService.updateTag({ property: 'og:image', content: this.shareImage });

        // Twitter
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:description', content: description });
        this.metaService.updateTag({ name: 'twitter:image', content: this.shareImage });

        // Canonical
        let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonical) {
            canonical = this.document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            this.document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', this.siteUrl);

        // Structured data (local business / store)
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'Mooligai',
            description,
            url: this.siteUrl,
            image: this.shareImage,
            telephone: '+918940566709',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Kalavasal, Sammattipuram Main Road',
                addressLocality: 'Madurai',
                addressRegion: 'Tamil Nadu',
                postalCode: '626016',
                addressCountry: 'IN'
            }
        };

        this.addJsonLd(jsonLd);

        // FAQ structured data (keep in sync with the FAQ section in the template)
        this.addJsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    q: 'How are Mooligai powders made?',
                    a: 'Every batch is washed, dried under open sun for up to five days, then stone-ground in small quantities so the natural oils stay intact. Nothing is added.'
                },
                {
                    q: 'Do your products contain fillers or synthetic fragrance?',
                    a: "No. We don't add fillers, silicones or synthetic fragrance."
                },
                {
                    q: 'How should I store the powders and oil?',
                    a: "Keep them in a tightly closed container in a cool, dry place, and always use a dry spoon so moisture doesn't get in."
                },
                {
                    q: 'Should I do a patch test first?',
                    a: 'Yes. As with any herbal product, try a small amount on your inner arm and wait a day before using it on your face or scalp.'
                },
                {
                    q: 'Is saree pre-pleating available yet?',
                    a: "Not yet. It's coming soon. Message us on WhatsApp and we'll tell you first when bookings open."
                }
            ].map(item => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a }
            }))
        });
    }

    private addJsonLd(data: object): void {
        const script = this.document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        this.document.head.appendChild(script);
        this.jsonLdScripts.push(script);
    }

    /**
     * Load products for home page
     */
    loadProducts(): void {
        this.loading = true;
        this.errorMessage = '';

        this.productService.getProducts({ page: 1, limit: 8 }).subscribe({
            next: (response) => {
                this.products = response.data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.errorMessage = 'Unable to load products. Please try again later.';
                this.loading = false;
            }
        });
    }

    /**
     * Load user's wishlist if logged in
     */
    loadWishlist(): void {
        this.wishlistService.getWishlist().subscribe({
            next: (response) => {
                if (response.success && response.data?.products) {
                    this.wishlistProductIds = new Set(
                        response.data.products.map(product => product._id)
                    );
                    this.wishlistService.updateWishlistCount(response.data);
                }
            },
            error: (error) => {
                console.error('Failed to load wishlist:', error);
            }
        });
    }

    /**
     * Add product to cart
     */
    addToCart(product: Product): void {
        if (!product?._id) {
            console.error('Invalid product');
            return;
        }

        this.cartService.addToCart(product._id).subscribe({
            next: (response) => {
                if (response.success) {
                    this.cartService.updateCartCount(response.data);
                    // Optional: Show success toast
                    console.log('Product added to cart');
                }
            },
            error: (error) => {
                console.error('Failed to add to cart:', error);
                this.errorMessage = 'Could not add product to cart. Please try again.';
            }
        });
    }

    /**
     * Toggle product in wishlist
     */
    toggleWishlist(product: Product): void {
        if (!product?._id) {
            console.error('Invalid product');
            return;
        }

        this.wishlistService.toggleWishlist(product._id).subscribe({
            next: (response) => {
                if (response.success && response.data?.products) {
                    // Update wishlist product IDs
                    this.wishlistProductIds = new Set(
                        response.data.products.map(p => p._id)
                    );

                    // Update navbar count
                    this.wishlistService.updateWishlistCount(response.data);
                }
            },
            error: (error) => {
                console.error('Failed to update wishlist:', error);
                this.errorMessage = 'Could not update wishlist. Please try again.';
            }
        });
    }

    /**
     * Subscribe to newsletter
     */
    subscribeNewsletter(): void {
        if (!this.newsletterEmail || !this.isValidEmail(this.newsletterEmail)) {
            alert('Please enter a valid email address');
            return;
        }

        this.isSubscribing = true;

        // Replace with your actual newsletter service
        // this.newsletterService.subscribe(this.newsletterEmail).subscribe({
        //     next: (response) => {
        //         alert('Successfully subscribed to our newsletter!');
        //         this.newsletterEmail = '';
        //         this.isSubscribing = false;
        //     },
        //     error: (error) => {
        //         console.error('Newsletter subscription failed:', error);
        //         alert('Failed to subscribe. Please try again.');
        //         this.isSubscribing = false;
        //     }
        // });

        // Mock implementation
        setTimeout(() => {
            alert('✨ Thanks for subscribing! Check your email for updates.');
            this.newsletterEmail = '';
            this.isSubscribing = false;
        }, 1000);
    }

    /**
     * Email validation helper
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}