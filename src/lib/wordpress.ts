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
    };
}   

export async function getPage(slug: string): Promise<Page>{
    const res = await fetch(`${process.env.WORDPRESS_API_URL}/pages?slug=${slug}`);
    const data = await res.json();
    return data[0];

}