"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, ExternalLink, Menu, X, Github, Linkedin, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CinematicVideo = dynamic(()=>import("../components/CinematicVideo"),{ssr:false});
const projects=[
 {n:"01",visual:"lifesync",name:"LifeSync",type:"Product concept · Web app",desc:"A personal dashboard concept connecting money, learning and everyday habits in one place.",tags:["Product thinking","UX","Web app"],href:"https://anushakallempudi12.github.io/LIfeSync/",linkLabel:"Explore LifeSync"},
 {n:"02",visual:"naavia",name:"Naavia AI",type:"AI agent concept",desc:"A travel-planning agent concept that turns preferences and constraints into practical itineraries.",tags:["AI agents","Travel","Planning"]},
 {n:"03",visual:"visa",name:"Vee Bot",type:"AI visa assistant · Chatbot",desc:"An AI-powered visa assistant that helps users explore visa-related questions and navigate guidance through a conversational experience.",tags:["AI assistant","Visa guidance","Conversational AI"],href:"https://anushakallempudi12.github.io/vee_bot/",linkLabel:"Try Vee Bot"}
];
const skills=[
 {title:"Backend & application development",items:["Java","Spring Boot","REST APIs","SQL"]},
 {title:"Quality engineering & testing",items:["Selenium","REST Assured","TestNG","Cucumber","API testing"]},
 {title:"Data analytics & visualization",items:["Python","Power BI","Jupyter","Data analysis"]},
 {title:"Machine learning & AI",items:["Machine Learning","CatBoost","Deep Learning","Prompt design"]},
 {title:"Development tools & delivery",items:["Git","GitHub","Maven","Docker","Jira","Dynatrace","Postman"]}
];
function ProjectVisual({kind}) {
 const visuals={
  codecoach:<div className="visual-code" aria-hidden="true"><div className="visual-window"><div className="visual-windowbar"><i/><i/><i/><span>challenge.java</span></div><div className="visual-codebody"><b>01</b><span className="code-purple">public class</span> <span className="code-cyan">Solution</span> {"{"}<br/><b>02</b><span className="code-muted">  // think it through</span><br/><b>03</b>  <span className="code-purple">int</span>[] <span className="code-cyan">solve</span>() {"{"}<br/><b>04</b>    <span className="code-green">return</span> answer;<br/><b>05</b>  {"}"}<br/><b>06</b>{"}"}</div></div><div className="visual-hint"><span>↳</span> Hint 02 · Try two pointers</div></div>,
  models:<div className="visual-model" aria-hidden="true"><div className="model-label">MODEL PIPELINE <span>01 / 02</span></div><div className="model-network"><div className="network-column"><i/><i/><i/><i/></div><div className="network-links"><i/><i/><i/><i/><i/><i/></div><div className="network-column middle"><i/><i/><i/></div><div className="network-links second"><i/><i/><i/><i/><i/></div><div className="network-column last"><i/><i/></div></div><div className="model-foot"><span>FEATURES</span><b>→</b><span>LEARNING</span><b>→</b><span>PREDICTION</span></div></div>,
  lifesync:<div className="visual-life" aria-hidden="true"><div className="life-top"><span>YOUR OVERVIEW</span><span className="life-live">● LIVE VIEW</span></div><div className="life-panels"><div className="life-panel life-focus"><small>WEEKLY FOCUS</small><strong>7.5<span>h</span></strong><div className="life-bars"><i/><i/><i/><i/><i/><i/><i/></div></div><div className="life-panel life-goals"><small>GOALS TRACKED</small><strong>04 <em>/ 06</em></strong><div className="life-progress"><i/></div><div className="life-progress short"><i/></div></div></div><div className="life-bottom"><span>FINANCES</span><span>LEARNING</span><span>HABITS</span></div></div>,
  training:<div className="visual-training" aria-hidden="true"><div className="training-top"><span>PROFESSOR PREDICT</span><span>5 STAGES</span></div><div className="training-prompt"><small>NEXT-WORD EXERCISE</small><strong>The capital of France is <em>___</em></strong><div className="training-answer"><b>Paris</b><span>✓ CORRECT</span></div></div><div className="training-steps"><i className="active"/><i/><i/><i/><i/></div><div className="training-foot"><span>LEARN · QUESTION · VERIFY</span><b>HALLUCINATION SPOTTER</b></div></div>,
  naavia:<div className="visual-travel" aria-hidden="true"><div className="travel-top"><span>TRIP BUILDER</span><span>ROUTE OPTIMIZED ↗</span></div><div className="travel-map"><svg viewBox="0 0 340 120" role="presentation"><path className="route-shadow" d="M28 88 C75 18 110 100 160 56 S245 18 310 48"/><path className="route-line" d="M28 88 C75 18 110 100 160 56 S245 18 310 48"/><circle cx="28" cy="88" r="5"/><circle cx="160" cy="56" r="5"/><circle cx="310" cy="48" r="5"/></svg><span className="travel-stop stop-a">START</span><span className="travel-stop stop-b">EXPLORE</span><span className="travel-stop stop-c">ARRIVE</span></div><div className="travel-foot"><span>3 STOPS</span><span>TIME · BUDGET · PREFERENCES</span></div></div>,
  visa:<div className="visual-training" aria-hidden="true"><div className="training-top"><span>VEE BOT · VISA ASSISTANT</span><span>AI GUIDE</span></div><div className="training-prompt"><small>CONVERSATIONAL VISA SUPPORT</small><strong>What would you like help with?</strong><div className="training-answer"><b>Visa pathways</b><span>↗ EXPLORE</span></div></div><div className="training-steps"><i className="active"/><i className="active"/><i/><i/><i/></div><div className="training-foot"><span>ASK · UNDERSTAND · PLAN</span><b>VISA GUIDANCE</b></div></div>
 };
 return <div className="project-visual">{visuals[kind]}</div>;
}
function SectionTitle({kicker,title,sub}){return <div className="project-head"><div><div className="section-kicker">{kicker}</div><h2 className="section-heading">{title}</h2>{sub&&<p className="about-copy" style={{marginTop:16}}>{sub}</p>}</div></div>}
export default function Home(){
 const navRef=useRef(null); const [menu,setMenu]=useState(false); const [artifactsOpen,setArtifactsOpen]=useState(false);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const ctx=gsap.context(()=>{
   gsap.from(".hero-enter",{y:36,opacity:0,duration:1.1,stagger:.13,ease:"power3.out",delay:.15});
   gsap.utils.toArray(".reveal").forEach(el=>gsap.to(el,{y:0,opacity:1,duration:.8,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
  });
  const onScroll=()=>{navRef.current?.classList.toggle("scrolled",window.scrollY>24);const max=document.documentElement.scrollHeight-window.innerHeight;document.documentElement.style.setProperty("--page-progress",`${max>0?(window.scrollY/max)*100:0}%`);};
  window.addEventListener("scroll",onScroll,{passive:true});
  return()=>{ctx.revert();window.removeEventListener("scroll",onScroll);};
 },[]);
 const close=()=>{setMenu(false);setArtifactsOpen(false);};
 return <main>
  <div className="site-noise"/><div className="scroll-progress" aria-hidden="true"/>
  <CinematicVideo/>
  <nav ref={navRef} className={`nav ${menu?"mobile-open":""}`} aria-label="Main navigation">
   <a className="brand" href="#top" onClick={close}>Anusha Kallempudi</a>
   <div className="navlinks">
    <a href="#about" onClick={close}>About</a>
    <div className="nav-dropdown">
     <button className="nav-dropdown-trigger" type="button" aria-expanded={artifactsOpen} onClick={()=>setArtifactsOpen(!artifactsOpen)}>Artifacts <ChevronDown size={15} className={artifactsOpen?"chevron-open":""}/></button>
     {artifactsOpen&&<div className="nav-dropdown-menu">
      <a href="/portfolio/artifacts/codecoach/" onClick={close}>CodeCoach <ArrowUpRight size={13}/></a>
      <a href="/portfolio/artifacts/ml-vs-dl/" onClick={close}>Machine Learning vs. Deep Learning <ArrowUpRight size={13}/></a>
      <a href="/portfolio/artifacts/ai-training-interaction/" onClick={close}>AI Training Interaction <ArrowUpRight size={13}/></a>
     </div>}
    </div>
    <a href="#contact" onClick={close}>Contact</a>
    <a href="/portfolio/documents/Anusha-Kallempudi-Resume.pdf" target="_blank" rel="noreferrer" onClick={close}>Resume</a>
   </div>
   <button className="menu-btn" onClick={()=>setMenu(!menu)} aria-label={menu?"Close menu":"Open menu"}>{menu?<X/>:<Menu/>}</button>
  </nav>
  <section className="hero" id="top">
   <div className="hero-grid"/><div className="hero-glow"/>
   <div className="hero-content">
    <div className="eyebrow hero-enter">Software engineer · AI/ML graduate student</div>
    <h1 className="hero-enter hero-nameplate"><span className="hero-first-name">Anusha</span><br/><span className="hero-name">Kallempudi</span></h1>
    <p className="hero-copy hero-enter">I build reliable software and explore how data and intelligent systems can solve practical problems.</p>
    <div className="hero-profession hero-enter">SOFTWARE ENGINEER <span>·</span> AI/ML GRADUATE STUDENT</div>
    <div className="hero-actions hero-enter">
     <a className="button hero-button-primary" href="#about">About <ArrowDownRight size={15}/></a>
     <a className="button hero-button-secondary" href="#artifacts">Explore artifacts <ArrowUpRight size={15}/></a>
     <a className="text-link hero-resume-link" href="/portfolio/documents/Anusha-Kallempudi-Resume.pdf" target="_blank" rel="noreferrer">Resume <ArrowUpRight size={14}/></a>
    </div>
   </div>
  </section>
  <section className="section" id="about"><div className="wrap about-grid">
   <div className="reveal"><div className="section-kicker">01 / About</div><h2 className="section-heading">From software foundations<br/><em>to applied AI.</em></h2>
    <p className="about-copy">My background is in software engineering at <strong>Tata Consultancy Services</strong>, where I worked on a retail technology project for Marks & Spencer. I contributed to Java development, API testing, test automation and application support—work that taught me to value reliability, clear problem-solving and thoughtful delivery.</p>
    <p className="about-copy">I’m currently pursuing an <strong>M.S. in Artificial Intelligence, specializing in Data Analytics</strong> at Indiana Wesleyan University. I’m building on my engineering experience to understand how data and AI can solve practical problems, while continuing to grow as a software developer.</p>
    <div className="principles"><div className="principle"><small>01 — BUILD</small><p>Reliable software with a clear purpose.</p></div><div className="principle"><small>02 — LEARN</small><p>Stay curious and keep improving.</p></div></div>
   </div>
   <div className="stat-card reveal"><div className="stat-top">Where I’m growing next</div><div className="focus-list"><div><span>01</span><strong>Software engineering</strong><small>Build reliable applications</small></div><div><span>02</span><strong>Data analytics</strong><small>Find meaning in information</small></div><div><span>03</span><strong>Applied AI</strong><small>Explore practical intelligent systems</small></div></div></div>
  </div></section>
  <section className="section" id="experience"><div className="wrap">
   <div className="reveal"><SectionTitle kicker="02 / Experience" title={<>The path so <em>far.</em></>}/></div>
   <div className="timeline">
    <div className="timeline-item reveal"><div className="timeline-date">AUG 2023 — NOV 2025</div><div><div className="timeline-role">System Engineer</div><div className="timeline-org">Tata Consultancy Services · Marks & Spencer project</div><ul className="timeline-points"><li>Contributed to Java development for a retail technology project supporting Marks & Spencer.</li><li>Worked on REST API testing to validate application behavior and support reliable integrations.</li><li>Used test automation practices and provided application support to help maintain software quality.</li></ul></div></div>
    <div className="timeline-item reveal"><div className="timeline-date">2026 — PRESENT</div><div><div className="timeline-role">M.S. Artificial Intelligence · Data Analytics</div><div className="timeline-org">Indiana Wesleyan University</div><div className="timeline-desc">Graduate study focused on data analytics, machine learning, data visualization and the practical application of AI.</div></div></div>
   </div>
  </div></section>
  <section className="section" id="skills"><div className="wrap"><div className="reveal"><SectionTitle kicker="03 / Toolkit" title={<>Tools I work <em>with.</em></>} sub="A growing toolkit across application development, testing, data and AI."/></div>
   <div className="skills-grid">{skills.map(s=><div className="skill-group reveal" key={s.title}><h3>{s.title}</h3><div className="skill-list">{s.items.map(i=><span key={i}>{i}</span>)}</div></div>)}</div>
  </div></section>
  <section className="section" id="work"><div className="wrap">
   <div className="reveal"><SectionTitle kicker="04 / Projects" title={<>Ideas shaped into <em>useful products.</em></>} sub="Product concepts that bring together practical problem-solving, thoughtful experiences and emerging technology."/></div>
   <div className="project-grid">{projects.map(p=><article className="project reveal" key={p.n}><div className="project-art"><ProjectVisual kind={p.visual}/></div><div className="project-index">{p.n} / {p.type}</div><h3>{p.name}</h3><p>{p.desc}</p><div className="tags">{p.tags.map(t=><span className="tag" key={t}>{t}</span>)}</div>{p.href&&<a className="artifact-link project-link" href={p.href} target="_blank" rel="noreferrer">{p.linkLabel} <ArrowUpRight size={14}/></a>}<ArrowUpRight className="project-arrow" size={18}/></article>)}</div>
  </div></section>
  <section className="section artifacts-section" id="artifacts"><div className="wrap">
   <div className="reveal"><SectionTitle kicker="05 / Academic artifacts" title={<>Work that shows <em>how I think.</em></>} sub="Selected coursework and documented experiments from my AI and data analytics studies. Select an artifact to explore its purpose, design process, implementation, testing and learning outcomes."/></div>
   <div className="artifact-grid">
    <article className="artifact-card reveal" id="artifact-codecoach"><a className="artifact-card-hitarea" href="https://anushakallempudi12.github.io/portfolio/artifacts/codecoach/" aria-label="Open CodeCoach artifact details"/>
     <div className="artifact-art codecoach-art"><img className="artifact-thumb" src="/portfolio/images/codecoach.png" alt="CodeCoach chatbot preview" loading="lazy"/><div className="artifact-terminal" hidden><div className="terminal-top"><i/><i/><i/><span>CodeCoach · practice session</span></div><div className="terminal-body"><small>JAVA · ARRAYS</small><strong>Find the maximum value</strong><p>What would you check first?</p><div className="terminal-hint">HINT 01 <span>Try scanning once from left to right.</span></div></div></div></div>
     <div className="artifact-meta"><span>ARTIFACT 01</span><span>AI LEARNING ASSISTANT</span></div>
     <h3>CodeCoach</h3><p>A hint-first coding interview coach for Java, Python and data structures. It encourages learners to attempt a problem, reason through hints and understand the solution before seeing an answer.</p>
     <a className="artifact-link" href="https://anushakallempudi12.github.io/portfolio/artifacts/codecoach/">Explore CodeCoach <ArrowUpRight size={14}/></a>
    </article>
    <article className="artifact-card reveal" id="artifact-ml-dl"><a className="artifact-card-hitarea" href="https://anushakallempudi12.github.io/portfolio/artifacts/ml-vs-dl/" aria-label="Open Machine Learning versus Deep Learning artifact details"/>
     <div className="artifact-art model-art"><img className="artifact-thumb" src="/portfolio/images/ml%20vs%20dl_1.png" alt="Machine Learning versus Deep Learning visual" loading="lazy"/><div className="compare-panel" hidden><div><small>STRUCTURED DATA</small><strong>CatBoost</strong><span>Customer churn prediction</span><i className="compare-bars"><b/><b/><b/><b/><b/></i></div><div className="compare-divider">VS</div><div><small>MEDICAL IMAGES</small><strong>CNN</strong><span>Retinal disease detection</span><i className="retina-grid"><b/><b/><b/><b/><b/><b/><b/><b/><b/></i></div></div></div>
     <div className="artifact-meta"><span>ARTIFACT 02</span><span>MODEL COMPARISON</span></div>
     <h3>Machine Learning vs. Deep Learning</h3><p>A comparison of CatBoost for customer churn prediction and convolutional neural networks for diabetic retinopathy detection, showing how data type and problem context influence model selection.</p>
    </article>
    <article className="artifact-card reveal" id="artifact-ai-training"><a className="artifact-card-hitarea" href="https://anushakallempudi12.github.io/portfolio/artifacts/ai-training-interaction/" aria-label="Open AI Training Interaction artifact details"/>
     <div className="artifact-art training-art"><ProjectVisual kind="training"/></div>
     <div className="artifact-meta"><span>ARTIFACT 03</span><span>RESPONSIBLE AI · LLM BASICS</span></div>
     <h3>AI Training Interaction</h3><p>A five-stage exploration of next-token prediction, training-data representation, hallucination, and choosing when an LLM needs external sources or expert review.</p>
     <a className="artifact-link" href="https://anushakallempudi12.github.io/portfolio/artifacts/ai-training-interaction/">Explore the interaction <ArrowUpRight size={14}/></a>
    </article>
   </div>
  </div></section>
  <section className="section" id="contact"><div className="wrap"><div className="contact-panel reveal">
   <div className="contact-copy"><div className="section-kicker">06 / Contact</div><h2>Let’s build<br/>something useful.</h2><p>I’m interested in opportunities where software engineering, data and emerging AI technologies come together. Connect with me, explore my work, or review my experience.</p></div>
   <div className="contact-links">
    <a className="contact-link" href="https://github.com/AnushaKallempudi12" target="_blank" rel="noreferrer"><span className="contact-link-icon"><Github size={18}/></span><span><strong>GitHub</strong><small>Explore my code and projects</small></span><ArrowUpRight size={16}/></a>
    <a className="contact-link" href="/portfolio/documents/Anusha-Kallempudi-Resume.pdf" target="_blank" rel="noreferrer"><span className="contact-link-icon"><ArrowUpRight size={18}/></span><span><strong>Resume</strong><small>View my experience and skills</small></span><ArrowUpRight size={16}/></a>
    <a className="contact-link" href="https://www.linkedin.com/in/anushakallempudi" target="_blank" rel="noreferrer"><span className="contact-link-icon"><Linkedin size={18}/></span><span><strong>LinkedIn</strong><small>Connect with me professionally</small></span><ArrowUpRight size={16}/></a>
    <a className="contact-link" href="mailto:anushakallempudi2002@gmail.com"><span className="contact-link-icon"><Mail size={18}/></span><span><strong>Email</strong><small>Send me a message</small></span><ArrowUpRight size={16}/></a>
   </div>
  </div></div></section>
  <footer className="wrap footer"><span>© {new Date().getFullYear()} Anusha Kallempudi</span><span>Designed around curiosity. Built with intention.</span><div style={{display:"flex",gap:16}}><a href="https://github.com/AnushaKallempudi12" aria-label="GitHub"><Github size={15}/></a></div></footer>
 </main>;
}
