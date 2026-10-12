'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Story, Category, Settings } from '@/lib/types';
import { whatsapp } from '@/lib/settings';

export function Stories({stories,categories,settings}:{stories:Story[];categories:Category[];settings:Settings}) {
 const [active,setActive]=useState<Story|null>(null);
 const [index,setIndex]=useState(0);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement|null>(null);
 const touch=useRef<{x:number;y:number}|null>(null);
 const photo=active?.photos[index];
 useEffect(()=>{const id=new URLSearchParams(window.location.search).get('story');const found=stories.find(s=>s.id===id);if(found){setActive(found);setIndex(0);}},[stories]);
 useEffect(()=>{
  if(!active)return;
  const el=dialog.current;if(el&&!el.open)el.showModal();
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{el?.close();document.body.style.overflow=previous;trigger.current?.focus();};
 },[active]);
 function move(delta:number){if(active)setIndex(i=>(i+delta+active.photos.length)%active.photos.length);}
 return <><div className="photo-grid story-grid">{stories.map(s=><button key={s.id} className="photo-card story-card" onClick={e=>{trigger.current=e.currentTarget;setIndex(0);setActive(s);}}><div className="photo-image"><Image src={s.photos[0].image_url} alt={s.photos[0].alt_text||s.title} fill sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"/><span>Explore story <ArrowUpRight size={20}/></span><small className="story-count">{s.photos.length} photos</small></div><div className="photo-caption"><h3>{s.title}</h3><span>{categories.find(c=>c.id===s.category_id)?.name}</span></div><p className="story-caption">{s.caption}</p></button>)}</div>
 <dialog ref={dialog} className="lightbox story-viewer" aria-label={active?.title||'Story album'} onCancel={e=>{e.preventDefault();setActive(null);}} onClick={e=>{if(e.target===e.currentTarget)setActive(null);}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
 {active&&photo&&<div className="lightbox-inner"><button className="lightbox-close" onClick={()=>setActive(null)} aria-label="Close story"><X/></button><header className="story-heading"><p className="eyebrow">{categories.find(c=>c.id===active.category_id)?.name}</p><h2>{active.title}</h2><p>{active.caption}</p></header>
 <div className="story-stage" onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start)return;const dx=e.changedTouches[0].clientX-start.x;const dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);}}>
 <div className="story-picture" key={photo.id}><Image src={photo.image_url} alt={photo.alt_text||photo.title} fill sizes="90vw" style={{objectFit:'contain'}}/></div>
 {active.photos.length>1&&<><button className="story-prev" onClick={()=>move(-1)} aria-label="Previous story photo"><ChevronLeft/></button><button className="story-next" onClick={()=>move(1)} aria-label="Next story photo"><ChevronRight/></button></>}
 </div><div className="story-photo-info"><p>{photo.caption||photo.title}</p><span aria-live="polite">Photo {index+1} of {active.photos.length}</span></div>
 <div className="story-thumbnails" aria-label="Story photos">{active.photos.map((p,i)=><button key={p.id} aria-label={`Show photo ${i+1}: ${p.title}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><Image src={p.image_url} alt="" fill sizes="80px" style={{objectFit:'cover'}}/></button>)}</div>
 <div className="story-footer"><span>Swipe or use the arrow keys to explore</span><a className="button" href={whatsapp(settings,`Hi Zemisi Imagery! I'm interested in this story: ${active.title} — ${typeof window!=='undefined'?window.location.origin:''}/?story=${active.id}`)} target="_blank" rel="noreferrer">Chat about this story <ArrowUpRight size={16}/></a></div></div>}
 </dialog></>;
}
