"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, BrainCircuit, ChevronDown, ChevronLeft, ChevronRight, Database, Lightbulb, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const stages = [
 {name:"Be the Model",title:"Predict the next word"},
 {name:"Reveal the Mechanism",title:"What is the model actually doing?"},
 {name:"Guess the Training Mix",title:"What might be in the training data?"},
 {name:"Good Fit / Danger Zone",title:"Where is an LLM a good fit?"},
 {name:"Completion Summary",title:"What changed in my understanding?"}
];
const batches = [
 {name:"Batch 1",rows:[["Wikipedia article","A lot"],["GitHub repository README","A lot"],["Public Reddit thread","A little"],["Full text of a peer-reviewed academic paper","A little"]]},
 {name:"Batch 2",rows:[["Private text-message conversation","Basically none"],["Company's internal confidential memo","Basically none"],["Public blog post or news article","A lot"],["Publicly available legal-contract template","A little"]]},
 {name:"Batch 3",rows:[["Public-domain or licensed poem or novel","A little"],["Conversation in a rare or low-resource language","A little"],["Real-time stock price or today's weather","Basically none"]]}
];
const tasks = [
 ["Drafting a cover letter","Good Fit","A language model can organize relevant experience and create a professional first draft. The applicant should still verify that the details are accurate."],
 ["Explaining binary search","Good Fit","Binary search is a well-documented computer science concept that a language model can explain step by step."],
 ["Current stock price","Danger Zone","Training information may be outdated, so a live financial source is needed."],
 ["Translating a very low-resource indigenous language","Danger Zone","The model may have limited training examples and could produce an inaccurate translation."],
 ["Exact multi-digit multiplication","Danger Zone","A language model predicts text rather than functioning as a dedicated calculator. A calculator is more reliable for exact results."],
 ["Summarizing research published last week","Danger Zone","The research may be newer than the model's training information. The actual paper or a reliable source is needed."],
 ["Legal advice for one person's exact situation","Danger Zone","Legal advice depends on specific facts and applicable laws. A qualified legal professional should review the situation."],
 ["Writing a poem inspired by a long-deceased or public-domain poet","Good Fit","A language model can generate creative writing based on learned literary patterns."],
 ["Brainstorming new product names","Good Fit","A language model can quickly generate creative ideas and alternatives."],
 ["Recalling a private conversation between named individuals","Danger Zone","The model cannot be assumed to know or access a private conversation that was never provided to it."]
];
const suitabilityClass = (value) => value === "Good Fit" ? "good-fit" : "danger-zone";

function StageOne(){
 const data=[
  ["The capital of France is ___","Paris","Correct","correct"],
  ["Once upon a ___","Time","Correct","correct"],
  ["The current president of the small island nation of Velmora, founded in 1998, is ___","Don't know","Correct decision","decision"]
 ];
 return <div className="ati-stage-content">
  <p className="ati-intro">I completed three next-word prediction exercises. The first two were familiar phrases. The third tested whether I would fill an unfamiliar prompt with a made-up answer.</p>
  <div className="ati-prediction-table">
   <div className="ati-table-head"><span>THE PROMPT</span><span>MY RESPONSE</span><span>RESULT</span></div>
   {data.map(([prompt,response,result,status])=><div className="ati-prediction-row" key={prompt}><p>{prompt}</p><strong>{response}</strong><span className={"ati-result "+status}>{result}</span></div>)}
  </div>
  <div className="ati-insight"><div className="ati-insight-icon"><Lightbulb size={19}/></div><div><strong>The moment that mattered: Velmora</strong><p>I had never heard of Velmora and suspected it might be fictional. I chose not to guess a president's name. That decision demonstrated why a model should recognize uncertainty rather than invent information.</p></div></div>
 </div>;
}
function StageTwo(){
 return <div className="ati-stage-content">
  <p className="ati-intro">A language model predicts the most likely next words based on patterns it learned during training. It may produce an answer that sounds correct even when the information is made up, because it does not automatically verify facts.</p>
  <div className="ati-mechanism">
   <article><span>01 / PRETRAINING</span><BrainCircuit size={23}/><h3>Learn patterns</h3><p>The model learns from large amounts of text by predicting the next token.</p></article>
   <div className="ati-flow-arrow">→</div>
   <article><span>02 / POST-TRAINING</span><Sparkles size={23}/><h3>Shape responses</h3><p>Additional training helps it follow instructions, provide helpful responses, and express uncertainty when appropriate.</p></article>
   <div className="ati-flow-arrow">→</div>
   <article><span>03 / USE WITH CARE</span><ShieldCheck size={23}/><h3>Verify when needed</h3><p>Neither training stage guarantees that every response is factually correct.</p></article>
  </div>
  <div className="ati-insight"><div className="ati-insight-icon"><Database size={19}/></div><div><strong>Predicting likely text is not the same as verifying truth</strong><p>Search engines and calculators can support tasks that require current information or precise calculations.</p></div></div>
 </div>;
}
function StageThree({batch,setBatch}){
 const current=batches[batch];
 return <div className="ati-stage-content">
  <p className="ati-intro">I classified each information type by how likely it is to be represented in a general language model's training data. These are general tendencies; datasets differ between models.</p>
  <div className="ati-batch-tabs" role="tablist" aria-label="Training data batches">
   {batches.map((item,index)=><button key={item.name} type="button" role="tab" aria-selected={batch===index} className={batch===index?"active":""} onClick={()=>setBatch(index)}>{item.name}</button>)}
  </div>
  <div className="ati-data-table"><div className="ati-table-head"><span>INFORMATION TYPE</span><span>MY CLASSIFICATION</span></div>
   {current.rows.map(([name,amount])=><div className="ati-data-row" key={name}><span>{name}</span><strong className={"ati-amount "+amount.toLowerCase().replaceAll(" ","-")}>{amount}</strong></div>)}
  </div>
  <div className="ati-insight"><div className="ati-insight-icon"><Lightbulb size={19}/></div><div><strong>What surprised me most: real-time information</strong><p>I initially assumed that AI training data included current information. I learned that training data is generally static, so a model needs an external source to retrieve accurate, up-to-date stock prices or weather.</p></div></div>
 </div>;
}
function StageFour({filter,setFilter}){
 const shown=tasks.filter((item)=>filter==="All"||item[1]===filter);
 return <div className="ati-stage-content">
  <p className="ati-intro">I evaluated these tasks without assuming access to web search, calculators, private databases, or additional documents. “Good Fit” does not guarantee correctness; human review still matters when accuracy is important.</p>
  <div className="ati-filter-row" role="group" aria-label="Filter tasks by suitability">
   {["All","Good Fit","Danger Zone"].map((item)=><button key={item} type="button" className={filter===item?(item==="All"?"active":"active "+suitabilityClass(item)):""} onClick={()=>setFilter(item)}>{item}<span>{item==="All"?tasks.length:tasks.filter((task)=>task[1]===item).length}</span></button>)}
  </div>
  <div className="ati-task-list">{shown.map(([task,decision,reason])=><article className="ati-task" key={task}>
   <div><span className={"ati-decision "+suitabilityClass(decision)}>{decision}</span><h3>{task}</h3></div><p>{reason}</p>
  </article>)}</div>
 </div>;
}
function StageFive(){
 return <div className="ati-stage-content">
  <div className="ati-completion-badge"><span><BadgeCheck size={28}/></span><div><small>BADGE UNLOCKED</small><strong>Hallucination Spotter</strong><p>Recognize uncertainty. Question the premise. Verify what matters.</p></div></div>
  <p className="ati-intro">Throughout the activity, I explored how large language models learn through next-token prediction and why fluent responses are not always factually correct.</p>
  <div className="ati-summary-grid">
   <article><span>01</span><h3>Training shapes capability</h3><p>Pretraining, post-training, supplied context, and external tools influence what an AI model can do.</p></article>
   <article><span>02</span><h3>Data has boundaries</h3><p>Private information, low-resource languages, and real-time information have different levels of availability.</p></article>
   <article><span>03</span><h3>Choose the right support</h3><p>Current prices, exact calculations, personalized legal advice, and private conversations require additional verification, tools, or professional review.</p></article>
  </div>
 </div>;
}
export default function AITrainingInteractionPage(){
 const [menuOpen,setMenuOpen]=useState(false);
 const [activeStage,setActiveStage]=useState(0);
 const [batch,setBatch]=useState(0);
 const [filter,setFilter]=useState("All");
 const active=stages[activeStage];
 useEffect(()=>{
  const nodes=document.querySelectorAll(".ati-reveal");
  const observer=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.08});
  nodes.forEach((node)=>observer.observe(node));
  return ()=>observer.disconnect();
 },[]);
 const move=(delta)=>setActiveStage((value)=>Math.max(0,Math.min(stages.length-1,value+delta)));
 return <main className="detail-page ati-page">
  <header className="detail-nav">
   <div className="nav-dropdown detail-nav-dropdown">
    <button className="nav-dropdown-trigger" type="button" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Artifacts <ChevronDown size={15}/></button>
    {menuOpen&&<div className="nav-dropdown-menu">
     <Link href="/artifacts/codecoach/" onClick={()=>setMenuOpen(false)}>CodeCoach <ArrowUpRight size={13}/></Link>
     <Link href="/artifacts/ml-vs-dl/" onClick={()=>setMenuOpen(false)}>Machine Learning vs. Deep Learning <ArrowUpRight size={13}/></Link>
     <Link href="/artifacts/ai-training-interaction/" onClick={()=>setMenuOpen(false)}>AI Training Interaction <ArrowUpRight size={13}/></Link>
     <Link href="/artifacts/responsible-ai/" onClick={()=>setMenuOpen(false)}>Responsible AI/ML Development <ArrowUpRight size={13}/></Link>
    </div>}
   </div>
   <Link href="/#top">← Back to Portfolio</Link>
  </header>
  <section className="detail-hero ati-hero"><div className="detail-wrap">
   <p className="detail-eyebrow">ACADEMIC ARTIFACT 03 · MACHINE LEARNING FUNDAMENTALS</p>
   <h1>AI Training<br/><em>Interaction</em></h1>
   <p className="detail-lead">A five-stage exploration of how language models learn, what their training data may contain, and why confident-sounding answers still need judgment and verification.</p>
   <div className="detail-tags"><span>Next-token prediction</span><span>Training data</span><span>Hallucination awareness</span><span>Responsible AI use</span></div>
   <div className="ati-hero-note"><BadgeCheck size={17}/><span><b>Hallucination Spotter</b><small>Completion badge earned during the activity</small></span></div>
   <div className="detail-snapshot-grid ati-snapshot">
    <div><span>01 / EXERCISE</span><strong>5 stages</strong><small>From prediction to reflection</small></div>
    <div><span>02 / FOCUS</span><strong>Model limits</strong><small>Data, context and verification</small></div>
    <div><span>03 / OUTCOME</span><strong>Critical use</strong><small>Know when to seek extra support</small></div>
   </div>
  </div></section>
  <div className="detail-wrap detail-content ati-content">
   <section className="detail-section ati-reveal">
    <p className="detail-index">01 / INTRODUCTION</p><h2>Introduction</h2>
    <p>AI Training Interaction is a learning activity that helped me examine how large language models learn and respond. By working through the Professor Predict exercises, I explored why an answer can sound convincing without being verified and why responsible AI use requires questioning assumptions and checking important information.</p>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">02 / DESCRIPTION</p><h2>About the activity</h2>
    <p>The activity moves through five stages: predicting the next word, examining how a language model works, considering what may be represented in training data, deciding which tasks are suitable for an LLM, and reflecting on what I learned. The interactive walkthrough below presents the exercises and the reasoning behind my responses.</p>
    <h3 className="detail-subhead">Objective</h3>
    <p>Understand the difference between predicting likely text and verifying information, recognize limits in training-data coverage, and identify when a task needs an external source, a specialized tool, or professional review.</p>
   </section>
<section className="detail-section ati-reveal" id="stages">
    <p className="detail-index">03 / INTERACTIVE WALKTHROUGH</p><h2>Explore the five stages</h2>
    <p>Select a stage to revisit the exercise, see my original classifications, and understand the reasoning behind the decisions.</p>
    <div className="ati-stage-nav" role="tablist" aria-label="Five learning stages">
     {stages.map((stage,index)=><button key={stage.name} type="button" role="tab" aria-selected={activeStage===index} className={activeStage===index?"active":""} onClick={()=>setActiveStage(index)}>
      <span>STAGE 0{index+1}</span><strong>{stage.name}</strong><i>{activeStage===index?"NOW EXPLORING":"OPEN STAGE"}</i>
     </button>)}
    </div>
    <div className="ati-stage-panel" role="tabpanel">
     <div className="ati-stage-panel-head"><div><span>STAGE 0{activeStage+1}</span><h3>{active.title}</h3></div><span className="ati-counter">0{activeStage+1} <i>/ 05</i></span></div>
     {activeStage===0&&<StageOne/>}
     {activeStage===1&&<StageTwo/>}
     {activeStage===2&&<StageThree batch={batch} setBatch={setBatch}/>}
     {activeStage===3&&<StageFour filter={filter} setFilter={setFilter}/>}
     {activeStage===4&&<StageFive/>}
     <div className="ati-stage-controls">
      <button type="button" className="ati-prev" onClick={()=>move(-1)} disabled={activeStage===0}><ChevronLeft size={15}/> Previous stage</button>
      <button type="button" className="ati-next" onClick={()=>activeStage===4?(setActiveStage(0),setBatch(0),setFilter("All")):move(1)}>{activeStage===4?<><RotateCcw size={14}/> Restart walkthrough</>:<>Next stage <ChevronRight size={15}/></>}</button>
     </div>
    </div>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">04 / PROCESS</p><h2>My decision-making approach</h2>
    <div className="ati-process-list">
     <article><span>01</span><div><h3>Question the premise</h3><p>When I encountered Velmora, I did not assume the country or its president was real. I chose not to guess.</p></div></article>
     <article><span>02</span><div><h3>Think about data coverage</h3><p>I classified information types by likely representation and considered why private, rare-language, and real-time information may be limited.</p></div></article>
     <article><span>03</span><div><h3>Match the task to the capability</h3><p>I separated drafting, explaining, and brainstorming from tasks that depend on current facts, exact calculations, private data, or personalized legal judgment.</p></div></article>
     <article><span>04</span><div><h3>Keep human review in the loop</h3><p>I treated “Good Fit” as a general suitability judgment, not a guarantee. Important details still need checking.</p></div></article>
    </div>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">05 / TOOLS AND TECHNOLOGIES USED</p><h2>Tools and Technologies Used</h2>
    <div className="ati-source-note"><span>TOOL USED</span><strong>ChatGPT</strong><small>Used to interact with the AI chatbot, explore training concepts, receive feedback, organize observations, and improve clarity and grammar. I reviewed the final work and retained responsibility for my responses and reflections.</small></div>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">06 / EVALUATION & LEARNING OUTCOMES</p><h2>Fluency is not proof</h2>
    <div className="ati-takeaway-grid">
     <article><span>01 / PREDICTION</span><h3>Likely words are not verified facts</h3><p>A language model can produce a plausible response from learned patterns. That does not mean it has checked whether the details are true.</p></article>
     <article><span>02 / COVERAGE</span><h3>Training data is not everything</h3><p>Public material may be represented differently across datasets. Private conversations and confidential documents should not be assumed to be available to a general model.</p></article>
     <article><span>03 / RESPONSIBILITY</span><h3>Use the right source or tool</h3><p>Current information, precise calculations, and high-stakes decisions call for reliable sources, specialized tools, or qualified review.</p></article>
    </div>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">07 / VALUE PROPOSITION</p><h2>Why this learning artifact matters</h2>
    <h3 className="ati-subsection-title">Unique Value</h3>
    <div className="ati-unique-card"><p>The value of this activity is the shift from simply accepting an answer to evaluating how it was produced and what support it needs. The exercise connects basic language-model concepts to practical decisions about information quality, privacy, and responsible use.</p></div>
    <h3>Relevance</h3>
    <div className="ati-audience-grid">
     <article><strong>For AI learners</strong><span>Build a practical mental model of next-token prediction and training-data limits.</span></article>
     <article><strong>For everyday users</strong><span>Recognize when a fluent response should be checked before acting on it.</span></article>
     <article><strong>For teams using AI</strong><span>Know when to bring in trusted data, external tools, or qualified expertise.</span></article>
    </div>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">08 / REFERENCES</p><h2>References</h2>
    <p>No external references were used or cited in this activity. The artifact documents my responses and reflections from the interactive learning exercise.</p>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">09 / PROJECT DOCUMENTATION</p><h2>AI Training Interaction activity record</h2>
    <p>This original activity document records my work through the Professor Predict stages, including my responses, classifications, reasoning, completion summary, personal reflection, and AI disclosure.</p>
    <div className="detail-document-frame detail-html-document-frame"><iframe src="https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fanushakallempudi12.github.io%2Fportfolio%2Fdocuments%2FAI%2520Training%2520Interaction.docx" title="Embedded AI Training Interaction original Word activity record" loading="lazy" allowFullScreen/></div>
    <p className="detail-document-fallback">If the preview does not load, <a href="/portfolio/documents/AI%20Training%20Interaction.docx" target="_blank" rel="noreferrer">open the original activity document</a>.</p>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">10 / PERSONAL REFLECTION</p><h2>How the exercise changed my approach</h2>
    <p>This activity helped me understand how large language models work and why their answers are not always accurate. The Velmora example was particularly interesting because I recognized the unfamiliar country name and questioned whether the information was real instead of making up an answer.</p>
    <p>I also learned that the quality of an AI response depends on its training data and access to external tools. An LLM can help draft cover letters, explain algorithms, and brainstorm product names, but it needs reliable sources for current stock prices and recent research. I also understood why calculators and professional experts are important for exact calculations and legal questions.</p>
    <div className="ati-reflection-quote"><Sparkles size={18}/><p>Going forward, I would use AI as a supporting tool, verify important information, and recognize when a task requires external sources or expert knowledge.</p></div>
   </section>
<section className="detail-section ati-reveal ati-portfolio-reflection">
    <p className="detail-index">11 / FEEDBACK & PORTFOLIO DEVELOPMENT</p><h2>How feedback and new experiences shaped my vision</h2>
    <p>One specific piece of feedback I received on Artifact 2 was that my reflection needed to be more complete: I should identify the feedback I received and explain how it influenced my vision. That comment made me think beyond describing what I had completed and consider how feedback and new experiences shape the direction of my work.</p>
    <p>At the beginning of the program, I used Google Sites as a basic way to present my assignments. During the residency, meeting others and exploring the tools, platforms, and approaches I was introduced to expanded my understanding of what a professional portfolio could be. I became interested in creating a portfolio that did more than display submissions. I wanted it to present my work in a more organized and interactive way, while giving me room to add future projects, documentation, and reflections.</p>
    <p>This experience influenced my decision to move from the basic Google Sites format to the portfolio website I have developed. I now see the portfolio as an evolving professional space where I can communicate my technical interests, learning progress, and the way I respond to feedback. The professor's comment reinforced that my work should show not only what I create, but also how I learn and grow from feedback.</p>
   </section>
<section className="detail-section ati-reveal">
    <p className="detail-index">12 / AI DISCLOSURE</p><h2>How AI supported this activity</h2>
    <p>I used ChatGPT during the Professor Predict activity to interact with the AI chatbot, explore the training concepts, and receive feedback on my responses. I also used ChatGPT to organize my observations, improve the structure and clarity of my responses, and correct grammar. The activity responses, classifications, decisions, and personal reflections reflect my own understanding and reasoning. I reviewed the final document to ensure it accurately represents my learning from the assignment.</p>
    <div className="ati-source-note"><span>DOCUMENTED IN</span><strong>AI Training Interaction</strong><small>Machine Learning Fundamentals · Original eight-page activity record</small></div>
   </section>
   <section className="detail-cta ati-reveal">
    <div><p className="detail-index">RETURN TO THE COLLECTION</p><h2>One more way to think critically about AI.</h2><p>Explore the other academic artifacts to see how I approach AI learning assistants and model selection.</p></div>
    <Link className="detail-primary" href="/#artifacts">Back to all artifacts <ArrowUpRight size={14}/></Link>
   </section>
  </div>
  <footer className="detail-footer"><span>AI Training Interaction · Anusha Kallempudi</span><Link href="/#artifacts">Return to Portfolio ↑</Link></footer>
 </main>;
}
