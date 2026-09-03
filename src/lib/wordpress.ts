import { cache } from 'react';

// Pages
export interface Page{
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    acf:{
        hero_eyebrow: string;
        hero_headline: string;
        hero_lede: string;
        hero_stat_number: string;
        hero_stat_label: string;
        intro_heading: string;
        intro_lede: string;
        intro_stats: { number: string; label: string }[] | null;
        cta_eyebrow: string;
        cta_heading: string;
        cta_link: {
            title: string;
            url: string;
            target: string;
        }
    };
}   
export const getPage = cache(async (slug: string): Promise<Page> => {
    const res = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/pages?slug=${slug}`, {
        next: {revalidate: 30},
    });
    const data = await res.json();
    return data[0];

});

// Theme Option Page
export interface SiteOptions {
    email: string;
    phone: string;
    location: string;
    social_links: { label: string; url: string; }[];
    services_list: { title: string; description: string; tags: string; }[];
    footer_heading: string;
    footer_link: {
        title: string;
        url: string;
        target: string;
    };
}
export const getSiteOptions = cache(async (): Promise<SiteOptions> => {
    const res = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/vantage/v1/site-options`, {
        next: {revalidate: 30},
    });
    return res.json();
});

// Projects Post Type
export interface Project{
    id: number;
    slug: string;
    title: { rendered: string };
    excerpt:{ rendered: string };
    acf:{
        client: string;
        year: string;
        services: string;
        timeline: string;
    };
    _embedded?: {
        'wp:featuredmedia'?: {source_url: string}[];
    }
}
export const getProjects = cache(async (): Promise<Project[]> => {
    const res = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/projects?_embed`, {
      next: {revalidate: 30},  
    });
    return res.json();
});
// Posts
export interface Post {
    id: number;
    slug: string;
    title: {rendered: string};
    date: string;
    _embedded?: {
        'wp:featuredmedia'?: {source_url: string}[];
        'wp:term'?: {name: string}[][];
    };
}

export const getPosts = cache(async(): Promise<Post[]> => {
const res = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?_embed`, {
        next: {revalidate: 30},
    });
    return res.json();
});