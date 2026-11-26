import Image from "next/image";
import CareerChat from "./career-chat";
import { experience, profile, projects, skills } from "./content";
import systemsArt from "./systems-art.webp";

const icons = {
  pin: <><path d="M20 10c0 5-8 10-8 10s-8-5-8-10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v6m0-8h.01M12 16v-6m0 2.5a2.5 2.5 0 0 1 5 0V16"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5"/></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/></>,
  pulse: <path d="M2 12h5l3-7 4 14 3-7h5"/>,
};

function Icon({ name }: { name: keyof typeof icons }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Vagner Caldeira home">
      <span className="monogram" aria-hidden="true">VC<span>.</span></span>
      <span>Vagner Caldeira</span>
    </a>
  );
}

function Tags({ items }: { items: readonly string[] }) {
  return <ul className="tags" aria-label="Technologies">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header" id="top">
        <div className="shell header-inner">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#work">Portfolio</a>
            <a href="#career-chat">AI chat</a>
          </nav>
          <a className="button button-small button-outline header-contact" href="#contact">Get in touch</a>
        </div>
      </header>

      <main id="main">
        <section className="shell hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-label">Senior Backend &amp; Full-Stack Engineer</p>
            <h1 id="hero-title">Vagner<br /><span>Caldeira<span className="hero-period">.</span></span></h1>
            <p className="hero-description">I build real-time systems that move money, process trades, and keep financial platforms running at scale.</p>
            <div className="actions">
              <a className="button button-primary" href="#experience">Explore my experience</a>
              <a className="button button-outline" href={profile.resume} download><Icon name="download" /> Download résumé</a>
            </div>
            <p className="location"><Icon name="pin" /> <span>Curitiba, Brazil</span> <span className="location-divider" aria-hidden="true" /> <span className="location-remote">Open to international remote roles</span></p>
          </div>
          <div className="hero-figure" aria-hidden="true">
            <Image src={systemsArt} alt="" fill preload unoptimized />
          </div>
        </section>

        <div className="shell">
          <dl className="metrics">
            <div><dt>Years in software engineering</dt><dd>10+</dd></div>
            <div><dt>Reduction in response time for targeted exchange operations</dt><dd>~40%</dd></div>
            <div><dt>Concurrent users supported</dt><dd>Thousands</dd></div>
          </dl>
        </div>

        <section className="shell section about" id="about" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">About me</p>
            <h2 id="about-title">Backend depth.<br />Full-stack range.</h2>
          </div>
          <div className="about-body">
            <p>My work spans cryptocurrency exchanges, lending platforms, and financial operations. I focus on the backend systems that make those products work, from processing orders and payments to delivering live updates and securing transactions.</p>
            <p>I work across the stack when the problem calls for it. That has meant rethinking how an exchange processes orders, improving deployment reliability, and integrating AI into operational workflows.</p>
            <Tags items={skills} />
          </div>
        </section>

        <section className="experience-band" id="experience" aria-labelledby="experience-title">
          <div className="shell section">
            <div className="section-heading">
              <p className="eyebrow">Experience</p>
              <h2 id="experience-title">Career journey.</h2>
            </div>
            <ol className="timeline">
              {experience.map(({ company, title, period, summary, result, stack }) => (
                <li className="role" key={company}>
                  <p className="role-date">{period}</p>
                  <article className="role-content">
                    <h3>{company}</h3>
                    <p className="role-title">{title}</p>
                    <p>{summary}</p>
                    {result && <p className="role-result">{result}</p>}
                    <Tags items={stack} />
                  </article>
                </li>
              ))}
            </ol>
            <div className="credentials">
              <div><h3>Education</h3><p>Universidade Estadual de Montes Claros<br />Bachelor’s in Computer Technology · 2012–2018</p></div>
              <div><h3>Languages</h3><p>Portuguese · Native<br />English · Full professional proficiency (CEFR C1)</p></div>
            </div>
          </div>
        </section>

        <section className="shell section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="eyebrow">Portfolio</p>
            <h2 id="work-title">Selected work.</h2>
            <p className="section-description">Projects from my career, with full case studies to follow.</p>
          </div>
          <div className="project-grid">
            {projects.map(({ title, category, description, icon, href }) => (
              <article className="project-card" key={title}>
                <div className="project-icon"><Icon name={icon} /></div>
                <p className="project-category">{category}</p>
                <h3>{title}</h3>
                <p>{description}</p>
                {href ? <a className="project-link" href={href}>Read case study<span className="sr-only"> for {title}</span></a> : <span className="project-status">Case study forthcoming</span>}
              </article>
            ))}
          </div>
        </section>

        <CareerChat />

        <section className="shell contact-wrap" id="contact" aria-labelledby="contact-title">
          <div className="contact">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Let’s talk engineering.</h2>
              <p>I’m open to international remote roles in backend engineering, infrastructure, fintech, and crypto.</p>
            </div>
            <div className="actions">
              <a className="button button-primary" href={`mailto:${profile.email}`}><Icon name="mail" /> Email me</a>
              <a className="button button-outline" href={profile.linkedIn}><Icon name="linkedin" /> LinkedIn</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="shell site-footer">
        <Brand />
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}
