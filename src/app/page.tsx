import { getPage, getSiteOptions, getProjects, getPosts } from '@/lib/wordpress';
import Stat from '@/components/stat';
import Card from '@/components/card';
import ServiceRow from '@/components/ServiceRow';

export default async function Home(){
  const page = await getPage('home');
  const siteOptions = await getSiteOptions();
  const projects = await getProjects();
  const posts = await getPosts();
  return(
    <main>
      {/* Hero Section */}
      <section className="hero container">
        <span className="eyebrow">{page.acf.hero_eyebrow}</span>
        <h1 className="word-reveal">{page.acf.hero_headline}</h1>
        <p className="lede">{page.acf.hero_lede}</p>
        <div className="hero-foot">
          <span className="scroll-cue">Scroll</span>
          <div className="stat">
            <div className="num">{page.acf.hero_stat_number}</div>
            <div className="lbl">{page.acf.hero_stat_label}</div>
          </div>
        </div>
      </section>
      {/* Marquee Section */}
      <section className="marquee">
        <div className="marquee-track">
          {[...siteOptions.services_list, ...siteOptions.services_list].map((service, i) => (
            <span key={i}>{service.title}</span>
          ))}
        </div>
      </section>
      {/* Intro Stats Section */}
      <section className="section container">
        <div className="section-head">
          <h2 dangerouslySetInnerHTML={{ __html: page.acf.intro_heading }} />
          <p className="lede">{page.acf.intro_lede}</p>
        </div>
        <div className="grid grid-3">
          {page.acf.intro_stats?.map((stat, i) => (
            <Stat key={i} number={stat.number} label={stat.label} />
          ))}
        </div>
      </section>
      {/* Projects Archive */}
      <section className="section container">
        <div className="section-head">
          <h2>Selected work</h2>
          <a href="/work" className="btn btn-ghost">View all work <span className="btn-arrow">→</span></a>
        </div>
        <div className="grid grid-3">
            {projects.slice(0, 3).map((project) => ( 
              <Card
                key={project.id}
                href={`/work/${project.slug}`}
                image={project._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                meta={[project.acf.services, project.acf.year]}
                title={project.title.rendered}
                description={project.excerpt?.rendered}
              />
            ))}
          </div>
      </section>
      {/* What We Do Section */}
      <section className="section container">
        <div className="section-head">
          <h2>What we do</h2>
          <a href="/services" className="btn btn-ghost">All services <span className="btn-arrow">→</span></a>
        </div>
        <div>
          {siteOptions.services_list.map((service, i) => (
            <ServiceRow
              key={i}
              idx={String(i+1).padStart(2, '0')}
              title={service.title}
              tags={service.tags.split(',')}
            />
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="cta-band container">
        <span className="eyebrow" style={{ justifyContent: 'center'}}>{page.acf.cta_eyebrow}</span>
        <h2>{page.acf.cta_heading}</h2>
        <a  
          href={new URL(page.acf.cta_link.url).pathname}
          target={page.acf.cta_link.target || undefined}
          className="btn btn-primary"
        >
          {page.acf.cta_link.title} <span className="btn-arrow">→</span>
        </a>
      </section>
      {/* Posts Archive */}
      <section className="section container">
          <div className="section-head">
            <h2>From the Journal</h2>
            <a href="/blog" className="btn btn-ghost">Read the blog <span className="btn-arrow">→</span></a>
          </div>
          <div className="grid grid-3">
            {posts.slice(0, 3).map((post) => (
              <Card
                key={post.id}
                href={`/blog/${post.slug}`}
                image={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                meta={[
                  post._embedded?.['wp:term']?.[0]?.[0]?.name || '',
                  new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                ]}
                title={post.title.rendered}
              />
            ))}
          </div>
      </section>
    </main>
  );
}
