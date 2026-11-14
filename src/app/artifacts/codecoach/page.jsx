"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, RotateCcw, Lightbulb, Code2 } from "lucide-react";

const challenges = [
  {
    id:"maximum",
    label:"Find the maximum",
    language:"Java · Arrays",
    prompt:"Given an integer array, return the largest value.",
    hints:[
      "Start by treating the first element as the largest value you have seen.",
      "Scan the remaining elements once. Compare each value with your current maximum.",
      "Update the maximum whenever you find a larger value. Return it after the loop."
    ],
    approach:"Initialize max with the first array element, loop through the remaining values, and update max when the current value is greater.",
    complexity:"O(n) time · O(1) extra space"
  },
  {
    id:"reverse",
    label:"Reverse an array",
    language:"Java · Two pointers",
    prompt:"Reverse an array in place without creating another array.",
    hints:[
      "You can work from both ends instead of shifting every element.",
      "Keep one pointer at the beginning and one at the end.",
      "Swap the values, move both pointers toward the center, and stop when they meet."
    ],
    approach:"Use left = 0 and right = length - 1. Swap the two values while left is less than right, then move left forward and right backward.",
    complexity:"O(n) time · O(1) extra space"
  },
  {
    id:"vowels",
    label:"Count vowels",
    language:"Java · Strings",
    prompt:"Count the vowels in a string without creating a second character array.",
    hints:[
      "Read the string one character at a time.",
      "Use charAt(index) inside a loop and compare the character with a, e, i, o, and u.",
      "Increment a counter for each match. Decide whether your comparison should handle uppercase letters too."
    ],
    approach:"Loop from index 0 to the string length, read each character with charAt(index), normalize its case if needed, and increment a counter when it is a vowel.",
    complexity:"O(n) time · O(1) extra space"
  }
];

const steps = [
  ["01","Define the learning experience","Identified the target learners, interview-preparation needs, chatbot purpose, and expected behavior."],
  ["02","Build and configure the chatbot","Used Mizou Custom mode to create the chatbot instructions, welcome message, description, and interaction style."],
  ["03","Design hint-first guidance","Refined the instructions so learners could attempt problems before receiving more detailed guidance."],
  ["04","Test and evaluate responses","Reviewed array and string problem conversations, checked explanations and complexity analysis, and refined responses when they were inaccurate."]
];

export default function CodeCoachPage(){
 const [menuOpen,setMenuOpen]=useState(false);
 const [challengeId,setChallengeId]=useState("maximum");
 const [hintLevel,setHintLevel]=useState(0);
 const [showApproach,setShowApproach]=useState(false);
 useEffect(()=>{
  const items=document.querySelectorAll(".detail-content .detail-section");
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.08});
  items.forEach(item=>observer.observe(item));
  return()=>observer.disconnect();
 },[]);
 const active=challenges.find(item=>item.id===challengeId) || challenges[0];
 const chooseChallenge=(id)=>{setChallengeId(id);setHintLevel(0);setShowApproach(false);};
 const resetPractice=()=>{setHintLevel(0);setShowApproach(false);};
 return <main className="detail-page codecoach-page">
  <header className="detail-nav">
   <div className="nav-dropdown detail-nav-dropdown">
    <button className="nav-dropdown-trigger" type="button" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>
     Artifacts <ChevronDown size={15} className={menuOpen?"chevron-open":""}/>
    </button>
    {menuOpen&&<div className="nav-dropdown-menu">
     <Link href="/artifacts/codecoach/" onClick={()=>setMenuOpen(false)}>CodeCoach <ArrowUpRight size={13}/></Link>
     <Link href="/artifacts/ml-vs-dl/" onClick={()=>setMenuOpen(false)}>Machine Learning vs. Deep Learning <ArrowUpRight size={13}/></Link>
     <Link href="/artifacts/ai-training-interaction/" onClick={()=>setMenuOpen(false)}>AI Training Interaction <ArrowUpRight size={13}/></Link>
     <Link href="/artifacts/responsible-ai/" onClick={()=>setMenuOpen(false)}>Data Challenge Scenarios <ArrowUpRight size={13}/></Link>
    </div>}
   </div>
   <Link href="/#top">← Back to Portfolio</Link>
  </header>
  <section className="detail-hero"><div className="detail-wrap">
   <p className="detail-eyebrow">ACADEMIC ARTIFACT · AI LAB</p>
   <h1>CodeCoach – AI-Powered<br/><em>Interview Coach</em></h1>
   <p className="detail-lead">A hint-first AI coding coach for beginner-to-intermediate learners. It encourages independent attempts, gives progressively useful hints, and explains the reasoning behind programming solutions.</p>
   <div className="detail-tags"><span>Java</span><span>Python</span><span>AI chatbot</span><span>Hint-first learning</span><span>DSA</span></div>
   <div className="detail-snapshot-grid">
    <div><span>01 / LEARNING MODEL</span><strong>Hint first</strong><small>Attempt · reflect · improve</small></div>
    <div><span>02 / LANGUAGES</span><strong>Java + Python</strong><small>Interview-focused practice</small></div>
    <div><span>03 / CORE SKILLS</span><strong>Problem solving</strong><small>Logic and complexity reasoning</small></div>
   </div>
   <div className="detail-actions"><a className="detail-primary" href="https://mizou.com/preview-bot?ID=164096" target="_blank" rel="noreferrer">Try CodeCoach <ArrowUpRight size={14}/></a><a className="detail-secondary" href="/portfolio/documents/CodeCoach.pdf" target="_blank" rel="noreferrer">Project Documentation <ArrowUpRight size={14}/></a></div>
  </div></section>
  <div className="detail-wrap detail-content">
   <section className="detail-section codecoach-feature-panel"><p className="detail-index">1. INTRODUCTION</p><h2>Introduction</h2><p>CodeCoach is an AI chatbot I designed to help beginner-to-intermediate learners prepare for software engineering interviews. I created it to support programming theory and coding practice, with an emphasis on understanding concepts and developing problem-solving skills rather than simply memorizing answers.</p></section>
   <section className="detail-section"><p className="detail-index">2. DESCRIPTION</p><h2>What CodeCoach does</h2><p>CodeCoach supports practice in Java, Python, programming fundamentals, object-oriented programming, data structures, algorithms, and coding interview problems. It provides explanations, examples, hints, constructive feedback, and discussions of time and space complexity. It is designed to adapt to the learner’s requested programming language and experience level while explaining the reasoning behind an answer.</p><p>Its hint-first approach encourages learners to attempt a problem independently before receiving more detailed guidance or a complete solution.</p></section>
   <section className="detail-section"><p className="detail-index">2.1 OBJECTIVE</p><h2>Project objective</h2><p>My objective was to create an interactive interview-preparation tool that encourages active learning. I wanted CodeCoach to help learners attempt problems independently, receive useful feedback, understand their mistakes, and improve their technical reasoning.</p></section>
   <section className="detail-section"><p className="detail-index">INTERACTIVE WALKTHROUGH</p><h2>Try the hint-first learning flow</h2><p>This small portfolio walkthrough demonstrates the teaching pattern I designed: choose a problem, request one hint at a time, and reveal the approach only when you are ready. It is an illustrative interaction, not a live connection to the Mizou chatbot.</p>
    <div className="codecoach-lab">
     <div className="codecoach-lab-top"><span><Code2 size={15}/> PRACTICE LAB</span><span>HINT-FIRST MODE</span></div>
     <div className="codecoach-challenge-tabs">{challenges.map(item=><button key={item.id} type="button" className={challengeId===item.id?"active":""} onClick={()=>chooseChallenge(item.id)}>{item.label}</button>)}</div>
     <div className="codecoach-lab-body">
      <div className="codecoach-problem"><span className="codecoach-language">{active.language}</span><h3>{active.label}</h3><p>{active.prompt}</p></div>
      <div className="codecoach-hint-area">
       <div className="codecoach-hint-heading"><span><Lightbulb size={15}/> Guided hints</span><span>{hintLevel} / {active.hints.length}</span></div>
       {hintLevel===0?<p className="codecoach-empty">Try to solve it yourself first. Reveal a hint only when you need a nudge.</p>:<ol className="codecoach-hints">{active.hints.slice(0,hintLevel).map((hint,index)=><li key={index}><b>HINT 0{index+1}</b><span>{hint}</span></li>)}</ol>}
       <div className="codecoach-lab-actions">
        <button type="button" className="detail-primary" onClick={()=>setHintLevel(Math.min(hintLevel+1,active.hints.length))} disabled={hintLevel===active.hints.length}>{hintLevel===0?"Show first hint":"Next hint"}</button>
        <button type="button" className="codecoach-text-button" onClick={()=>setShowApproach(!showApproach)}>{showApproach?"Hide approach":"Show approach"}</button>
        <button type="button" className="codecoach-reset" onClick={resetPractice} aria-label="Reset hints and approach"><RotateCcw size={14}/> Reset</button>
       </div>
       {showApproach&&<div className="codecoach-approach"><b>Suggested approach</b><p>{active.approach}</p><span>{active.complexity}</span></div>}
      </div>
     </div>
    </div>
   </section>
   <section className="detail-section"><p className="detail-index">2.2 PROCESS</p><h2>How I designed, built and evaluated it</h2><div className="detail-step-grid">{steps.map(([n,title,desc])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
    <h3 className="detail-subhead">What I checked during testing</h3><ul className="detail-list"><li>Whether the chatbot gives a useful hint before revealing a complete answer.</li><li>Whether explanations are appropriate for a beginner-to-intermediate learner.</li><li>Whether the suggested solution and time/space complexity are logically consistent.</li><li>Whether the chatbot follows the requested programming language and explains its reasoning clearly.</li></ul>
   </section>
   <section className="detail-section"><p className="detail-index">2.3 TOOLS AND TECH USED</p><h2>Tools and technologies used</h2><div className="detail-tool-grid"><article><b>M</b><h3>Mizou</h3><p>Used Custom mode to build CodeCoach and configure its instructions, welcome message, and interaction style.</p></article><article><b>AI</b><h3>ChatGPT</h3><p>Used during the broader AI Lab activities and to help organize and revise assignment documentation.</p></article><article><b>J/P</b><h3>Java and Python</h3><p>Programming languages supported for interview practice and coding discussions.</p></article><article><b>DSA</b><h3>Data structures and algorithms</h3><p>Used as the subject matter for interview-style practice, explanations, and complexity discussions.</p></article></div></section>
   <section className="detail-section"><p className="detail-index">3. VALUE PROPOSITION</p><h2>Value Proposition of the Artifact</h2><p>CodeCoach gives learners a low-pressure place to practice technical interview questions while keeping the thinking process in their hands. Instead of immediately displaying a finished answer, it can guide a learner through progressive hints, explain why an approach works, and discuss time and space complexity. This makes it useful for learners who need both coding practice and support in explaining their reasoning.</p><div className="detail-highlight"><b>Core value</b><p>Move from answer-seeking to problem-solving: attempt first, ask for guidance when needed, and understand the reasoning before moving on.</p></div></section>
   <section className="detail-section"><p className="detail-index">3.1 UNIQUE VALUE</p><h2>3.1 Unique Value</h2><p>The distinctive feature of my design is its hint-first learning approach. It treats the learner as an active problem-solver rather than simply returning code. The combination of programming concepts, coding practice, constructive feedback, and complexity discussions supports both implementation skills and interview communication.</p>
    <div className="detail-two-col"><div><h3>Intended audience</h3><ul className="detail-list"><li>Beginner-to-intermediate programming learners</li><li>Students preparing for software engineering interviews</li><li>Learners practicing Java, Python, data structures, and algorithms</li></ul></div><div><h3>Skills demonstrated</h3><ul className="detail-list"><li>Prompt design and chatbot configuration</li><li>User-centered learning experience design</li><li>Technical explanation and problem decomposition</li><li>Reviewing response quality and complexity reasoning</li></ul></div></div>
    <h3 className="detail-subhead">3.2 Relevance</h3><p>CodeCoach is relevant to learners preparing for software engineering interviews because it combines coding practice with explanations of problem-solving decisions. The hint-first approach also supports independent learning that can transfer to coursework, technical assessments, and interview preparation.</p>
   </section>
   <section className="detail-section codecoach-feature-panel"><p className="detail-index">REFLECTION</p><h2>What I learned</h2><p>Building CodeCoach helped me understand that a useful educational chatbot needs more than correct answers. It needs clear instructions, an appropriate level of guidance, and a way to encourage learners to think independently. Designing the hint-first flow made me pay closer attention to how much information to reveal and when to reveal it.</p><p>Testing coding examples also reinforced the importance of checking the logic and complexity explanations rather than assuming an AI-generated response is correct. I would continue improving CodeCoach by expanding its question coverage and reviewing how consistently it adapts to different experience levels and programming languages.</p></section>
   <section className="detail-section"><p className="detail-index">4. REFERENCES</p><h2>References</h2><p>The following sources informed the platform review and responsible-use considerations documented in my CodeCoach project.</p><ol className="codecoach-reference-list"><li><span>Mizou. (n.d.). <em>Privacy policy.</em></span><a href="https://mizou.com/privacy" target="_blank" rel="noreferrer">Mizou Privacy Policy <ArrowUpRight size={13}/></a></li><li><span>Mizou. (2023, May 7). <em>Terms and conditions.</em></span><a href="https://school.mizou.com/p/terms" target="_blank" rel="noreferrer">Mizou Terms and Conditions <ArrowUpRight size={13}/></a></li></ol></section>
   <section className="detail-section codecoach-document-download"><p className="detail-index">5. PROJECT DOCUMENTATION</p><div className="codecoach-document-row"><div><h2>CodeCoach documentation</h2><p>Read the complete project report, including the design, development, testing, sample interactions, and evaluation.</p></div><a className="codecoach-download-link" href="/portfolio/documents/CodeCoach.pdf" download>Download project PDF <ArrowUpRight size={14}/></a></div></section>
   <section className="detail-section detail-original-evidence"><p className="detail-index">INTERFACE PREVIEW</p><h2>CodeCoach interface preview</h2><p>This visual gives a preview of the CodeCoach chatbot interface and how a learner will experience the tool before opening the live chatbot.</p><img className="detail-artifact-image" src="/portfolio/images/codecoach.png" alt="Visual preview of the CodeCoach chatbot interface" loading="lazy"/></section>
   <section className="detail-cta"><div><p className="detail-index">EXPLORE THE LIVE CHATBOT</p><h2>Continue with CodeCoach</h2><p>Open the interactive chatbot to try the original interview-practice experience.</p></div><div className="detail-actions"><a className="detail-primary" href="https://mizou.com/preview-bot?ID=164096" target="_blank" rel="noreferrer">Launch CodeCoach <ArrowUpRight size={14}/></a></div></section>
  </div>
  <footer className="detail-footer"><span>CodeCoach · Created by Anusha Kallempudi</span><Link href="/#artifacts">Return to Portfolio ↑</Link></footer>
 </main>;
}
