import { useState, useRef } from "react";

const SUBJECTS = [
  { id: "matematik", label: "Matematik", emoji: "📐", color: "#F59E0B", light: "#FEF3C7" },
  { id: "fizik",     label: "Fizik",     emoji: "⚡", color: "#3B82F6", light: "#DBEAFE" },
  { id: "kimya",     label: "Kimya",     emoji: "🧪", color: "#10B981", light: "#D1FAE5" },
  { id: "biyoloji",  label: "Biyoloji",  emoji: "🌿", color: "#84CC16", light: "#ECFCCB" },
  { id: "tarih",     label: "Tarih",     emoji: "📜", color: "#EF4444", light: "#FEE2E2" },
  { id: "edebiyat",  label: "Edebiyat",  emoji: "📖", color: "#8B5CF6", light: "#EDE9FE" },
  { id: "diger",     label: "Diğer",     emoji: "📝", color: "#6B7280", light: "#F3F4F6" },
];

const INITIAL_NOTES = [
  {
    id: 1,
    title: "Newton'un Hareket Yasaları",
    content: "F = ma formülü, kuvvet ile ivme arasındaki ilişkiyi gösterir.\n\nBirinci yasa: Durağanlık ilkesi.\nİkinci yasa: F=ma.\nÜçüncü yasa: Etki-tepki.",
    subject: "fizik", images: [], date: "2026-05-20", tags: ["mekanik","kuvvet"],
  },
  {
    id: 2,
    title: "Türev Kuralları",
    content: "Temel türev kuralları:\n• Sabit: (c)' = 0\n• Kuvvet: (xⁿ)' = n·xⁿ⁻¹\n• Toplam: (f+g)' = f' + g'\n• Çarpım: (f·g)' = f'g + fg'",
    subject: "matematik", images: [], date: "2026-05-22", tags: ["türev"],
  },
];

const wb = (bg, color) => ({ padding:"8px 14px", borderRadius:8, border:"none", background:bg, color, cursor:"pointer", fontSize:13, fontWeight:600 });
const ip = { width:"100%", padding:"10px 13px", borderRadius:9, border:"1.5px solid #E5E7EB", background:"#F9FAFB", color:"#111827", fontSize:14, outline:"none", marginBottom:14, boxSizing:"border-box" };
const lb = { display:"block", fontSize:11, color:"#6B7280", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:5 };

function SidebarItem({ active, onClick, emoji, label, count, color }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", display:"flex", alignItems:"center", gap:10,
      padding:"9px 10px", borderRadius:9, border:"none",
      background: active ? color+"18" : "transparent",
      color: active ? color : "#374151",
      cursor:"pointer", fontWeight: active ? 700 : 500,
      fontSize:14, transition:"all .15s", marginBottom:2, textAlign:"left",
    }}>
      <span style={{fontSize:17,width:24,textAlign:"center"}}>{emoji}</span>
      <span style={{flex:1}}>{label}</span>
      {count > 0 && (
        <span style={{background:active?color:"#F3F4F6",color:active?"#fff":"#6B7280",borderRadius:20,padding:"1px 8px",fontSize:11,fontWeight:700}}>
          {count}
        </span>
      )}
    </button>
  );
}

function NoteCard({ note, subject, onClick, onDelete }) {
  const hasImg = note.images && note.images.length > 0;
  return (
    <div onClick={onClick} style={{
      background:"#fff",
      border:"1.5px solid #E5E7EB",
      borderRadius:14, cursor:"pointer", overflow:"hidden",
      boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
      transition:"all .2s",
    }}>
      {hasImg && (
        <div style={{height:120,overflow:"hidden",position:"relative"}}>
          <img src={note.images[0].src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
          {note.images.length > 1 && (
            <div style={{position:"absolute",bottom:6,right:8,background:"rgba(0,0,0,.5)",color:"#fff",borderRadius:8,padding:"2px 8px",fontSize:11}}>
              +{note.images.length-1}
            </div>
          )}
        </div>
      )}
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:11,color:subject.color,fontWeight:700,background:subject.light,padding:"2px 8px",borderRadius:6}}>
            {subject.emoji} {subject.label}
          </span>
          <button onClick={e=>{e.stopPropagation();onDelete();}} style={{background:"none",border:"none",color:"#D1D5DB",cursor:"pointer",fontSize:18,lineHeight:1,padding:0}}>×</button>
        </div>
        <h3 style={{margin:"0 0 5px",fontSize:15,fontWeight:700,color:"#111827",lineHeight:1.3}}>{note.title}</h3>
        <p style={{margin:0,fontSize:13,color:"#6B7280",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
          {note.content}
        </p>
        <div style={{display:"flex",gap:6,marginTop:10,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"#9CA3AF"}}>{note.date}</span>
          {hasImg && <span style={{fontSize:11,color:"#9CA3AF"}}>🖼 {note.images.length}</span>}
          {note.tags?.slice(0,2).map(t=>(
            <span key={t} style={{background:"#F3F4F6",color:"#6B7280",borderRadius:6,padding:"1px 7px",fontSize:11}}>#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* TAM EKRAN NOT DETAYI */
function NoteModal({ note, subject, onClose, onDelete, onAddImage, onRemoveImage, editFileRef }) {
  const [lightbox, setLightbox] = useState(null);
  return (
    <div
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn .2s ease"}}
    >
      {lightbox !== null && (
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src={note.images[lightbox].src} alt="" style={{maxWidth:"90vw",maxHeight:"90vh",borderRadius:12}} />
          <button onClick={()=>setLightbox(null)} style={{position:"fixed",top:18,right:22,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",fontSize:20,borderRadius:8,padding:"4px 12px",cursor:"pointer"}}>✕</button>
        </div>
      )}
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:780,maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.2)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",borderBottom:"1px solid #F3F4F6",flexShrink:0}}>
          <span style={{background:subject.light,color:subject.color,padding:"5px 13px",borderRadius:8,fontWeight:700,fontSize:13}}>
            {subject.emoji} {subject.label}
          </span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onDelete} style={wb("#FEE2E2","#EF4444")}>🗑 Sil</button>
            <button onClick={onClose} style={wb("#F3F4F6","#374151")}>✕ Kapat</button>
          </div>
        </div>
        {/* Body */}
        <div style={{overflowY:"auto",padding:"24px 28px",flex:1}}>
          <h2 style={{margin:"0 0 4px",fontSize:26,fontWeight:800,color:"#111827"}}>{note.title}</h2>
          <p style={{fontSize:12,color:"#9CA3AF",marginBottom:22}}>{note.date}</p>

          {note.images && note.images.length > 0 && (
            <div style={{marginBottom:22}}>
              <p style={{fontSize:11,color:"#9CA3AF",marginBottom:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>
                Görseller ({note.images.length})
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
                {note.images.map((img,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:12,overflow:"hidden",border:"1px solid #E5E7EB"}}>
                    <img src={img.src} alt={img.name} onClick={()=>setLightbox(i)}
                      style={{width:"100%",height:120,objectFit:"cover",cursor:"zoom-in",display:"block"}} />
                    <button onClick={()=>onRemoveImage(i)} style={{position:"absolute",top:5,right:5,background:"rgba(0,0,0,.55)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:14,lineHeight:1}}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={()=>editFileRef.current?.click()} style={{...wb("#EEF2FF","#4F46E5"),marginBottom:22,fontSize:13}}>
            📁 Klasörden Görsel Ekle
          </button>
          <input ref={editFileRef} type="file" accept="image/*" multiple hidden onChange={e=>onAddImage(e.target.files)} />

          <div style={{background:"#F9FAFB",borderRadius:14,padding:"18px 20px",lineHeight:1.9,fontSize:16,color:"#374151",whiteSpace:"pre-wrap",border:"1px solid #E5E7EB"}}>
            {note.content}
          </div>

          {note.tags && note.tags.length > 0 && (
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:18}}>
              {note.tags.map(t=>(
                <span key={t} style={{background:subject.light,color:subject.color,borderRadius:8,padding:"4px 12px",fontSize:13,fontWeight:600}}>#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* TAM EKRAN YENİ NOT */
function CreateModal({ form, setForm, onSave, onCancel, handleImageUpload, removeImage, dragOver, setDragOver, handleDrop, fileRef }) {
  return (
    <div
      onClick={e=>{ if(e.target===e.currentTarget) onCancel(); }}
      style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn .2s ease"}}
    >
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:640,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.2)",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",borderBottom:"1px solid #F3F4F6",flexShrink:0}}>
          <h3 style={{margin:0,fontSize:18,fontWeight:800,color:"#111827"}}>✏️ Yeni Not Oluştur</h3>
          <button onClick={onCancel} style={wb("#F3F4F6","#374151")}>✕</button>
        </div>
        <div style={{overflowY:"auto",padding:"20px 24px",flex:1}}>
          <label style={lb}>Ders</label>
          <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} style={ip}>
            {SUBJECTS.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
          </select>
          <label style={lb}>Başlık *</label>
          <input placeholder="Not başlığı..." value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={ip} />
          <label style={lb}>İçerik</label>
          <textarea placeholder="Ders notlarını buraya yaz..." value={form.content}
            onChange={e=>setForm(p=>({...p,content:e.target.value}))} rows={7}
            style={{...ip,resize:"vertical",lineHeight:1.7}} />
          <label style={lb}>Etiketler (virgülle ayır)</label>
          <input placeholder="örn: limit, türev, integral" value={form.tags}
            onChange={e=>setForm(p=>({...p,tags:e.target.value}))} style={ip} />
          <label style={lb}>Görseller</label>
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
            onClick={()=>fileRef.current?.click()}
            style={{border:`2px dashed ${dragOver?"#4F46E5":"#D1D5DB"}`,borderRadius:12,padding:"20px 16px",textAlign:"center",cursor:"pointer",background:dragOver?"#EEF2FF":"#F9FAFB",transition:"all .2s",marginBottom:14,color:"#9CA3AF",fontSize:14}}
          >
            📁 Klasörden görsel seç veya sürükle & bırak
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e=>handleImageUpload(e.target.files)} />
          </div>
          {form.images.length > 0 && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:8,marginBottom:16}}>
              {form.images.map((img,i)=>(
                <div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",border:"1px solid #E5E7EB"}}>
                  <img src={img.src} alt="" style={{width:"100%",height:80,objectFit:"cover"}} />
                  <button onClick={()=>removeImage(i)} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,.55)",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:12,lineHeight:1}}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button onClick={onSave} style={{flex:1,padding:"12px 0",borderRadius:10,border:"none",background:"#4F46E5",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>
              💾 Kaydet
            </button>
            <button onClick={onCancel} style={wb("#F3F4F6","#374151")}>İptal</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DersNotlari() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [activeSubject, setActiveSubject] = useState("tumu");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [form, setForm] = useState({title:"",content:"",subject:"fizik",tags:"",images:[]});
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const editFileRef = useRef();

  const getSubject = id => SUBJECTS.find(s=>s.id===id) || SUBJECTS[6];

  const filteredNotes = notes.filter(n => {
    const matchSubject = activeSubject==="tumu" || n.subject===activeSubject;
    const q = searchQuery.toLowerCase();
    return matchSubject && (!q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  });

  const handleImageUpload = (files, isEdit=false) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = e => {
        if (isEdit && selectedNote) {
          const updated = {...selectedNote, images:[...(selectedNote.images||[]),{src:e.target.result,name:file.name}]};
          setSelectedNote(updated);
          setNotes(prev=>prev.map(n=>n.id===selectedNote.id?updated:n));
        } else {
          setForm(prev=>({...prev,images:[...prev.images,{src:e.target.result,name:file.name}]}));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = e => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files); };

  const saveNote = () => {
    if (!form.title.trim()) return;
    setNotes(prev=>[{
      id:Date.now(), title:form.title, content:form.content, subject:form.subject,
      images:form.images, date:new Date().toISOString().split("T")[0],
      tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean),
    },...prev]);
    setForm({title:"",content:"",subject:"fizik",tags:"",images:[]});
    setIsCreating(false);
  };

  const deleteNote = id => {
    setNotes(prev=>prev.filter(n=>n.id!==id));
    if (selectedNote?.id===id) setSelectedNote(null);
  };

  const removeImage = (idx, isEdit=false) => {
    if (isEdit && selectedNote) {
      const updated = {...selectedNote, images:selectedNote.images.filter((_,i)=>i!==idx)};
      setSelectedNote(updated);
      setNotes(prev=>prev.map(n=>n.id===selectedNote.id?updated:n));
    } else {
      setForm(prev=>({...prev,images:prev.images.filter((_,i)=>i!==idx)}));
    }
  };

  return (
    <div style={{display:"flex",height:"100vh",background:"#F8F9FB",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:4px}
        input,textarea,select{font-family:inherit}
        @keyframes fadeIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
      `}</style>

      {/* MODALS */}
      {selectedNote && (
        <NoteModal
          note={selectedNote} subject={getSubject(selectedNote.subject)}
          onClose={()=>setSelectedNote(null)} onDelete={()=>deleteNote(selectedNote.id)}
          onAddImage={files=>handleImageUpload(files,true)} onRemoveImage={i=>removeImage(i,true)}
          editFileRef={editFileRef}
        />
      )}
      {isCreating && (
        <CreateModal
          form={form} setForm={setForm} onSave={saveNote} onCancel={()=>setIsCreating(false)}
          handleImageUpload={handleImageUpload} removeImage={removeImage}
          dragOver={dragOver} setDragOver={setDragOver} handleDrop={handleDrop} fileRef={fileRef}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{
        width:sidebarOpen?242:0, minWidth:sidebarOpen?242:0,
        background:"#fff", borderRight:"1px solid #E5E7EB",
        display:"flex", flexDirection:"column", overflow:"hidden",
        transition:"width .28s ease,min-width .28s ease",
        boxShadow:sidebarOpen?"2px 0 12px rgba(0,0,0,0.04)":"none",
        flexShrink:0,
      }}>
        <div style={{padding:"22px 18px 14px",borderBottom:"1px solid #F3F4F6",whiteSpace:"nowrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>📚</span>
            <div>
              <div style={{fontWeight:800,fontSize:16,color:"#111827"}}>Ders Notlarım</div>
              <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>{notes.length} not</div>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 14px 8px",whiteSpace:"nowrap"}}>
          <button onClick={()=>setIsCreating(true)} style={{width:"100%",padding:"10px 0",borderRadius:10,background:"#4F46E5",color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>
            + Yeni Not
          </button>
        </div>
        <div style={{padding:"4px 10px",overflowY:"auto",flex:1,whiteSpace:"nowrap"}}>
          <SidebarItem active={activeSubject==="tumu"} onClick={()=>setActiveSubject("tumu")}
            emoji="🗂️" label="Tümü" count={notes.length} color="#4F46E5" />
          <div style={{padding:"12px 8px 4px",fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:1.2}}>
            Dersler
          </div>
          {SUBJECTS.map(s=>(
            <SidebarItem key={s.id} active={activeSubject===s.id}
              onClick={()=>setActiveSubject(s.id)}
              emoji={s.emoji} label={s.label}
              count={notes.filter(n=>n.subject===s.id).length} color={s.color} />
          ))}
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid #F3F4F6",fontSize:11,color:"#9CA3AF",textAlign:"center",whiteSpace:"nowrap"}}>
          Görselli & Yazılı Notlar
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        {/* TOPBAR */}
        <header style={{background:"#fff",borderBottom:"1px solid #E5E7EB",padding:"0 22px",height:58,display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{background:"none",border:"none",cursor:"pointer",padding:"5px 3px",borderRadius:8,display:"flex",flexDirection:"column",gap:5,alignItems:"flex-start"}}>
            <span style={{display:"block",width:22,height:2.5,background:sidebarOpen?"#4F46E5":"#374151",borderRadius:2,transition:"all .25s"}} />
            <span style={{display:"block",width:sidebarOpen?14:22,height:2.5,background:sidebarOpen?"#4F46E5":"#374151",borderRadius:2,transition:"all .25s"}} />
            <span style={{display:"block",width:22,height:2.5,background:sidebarOpen?"#4F46E5":"#374151",borderRadius:2,transition:"all .25s"}} />
          </button>
          <div style={{fontWeight:700,fontSize:16,color:"#111827"}}>
            {activeSubject==="tumu" ? "Tüm Notlar" : (()=>{const s=getSubject(activeSubject);return `${s.emoji} ${s.label}`;})()}
          </div>
          <div style={{flex:1,maxWidth:340,marginLeft:"auto",position:"relative"}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#9CA3AF"}}>🔍</span>
            <input placeholder="Not ara..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              style={{width:"100%",padding:"8px 13px 8px 34px",borderRadius:10,border:"1.5px solid #E5E7EB",background:"#F9FAFB",color:"#111827",fontSize:14,outline:"none"}} />
          </div>
        </header>

        {/* NOTES GRID */}
        <div style={{flex:1,overflowY:"auto",padding:22}}>
          {filteredNotes.length===0 ? (
            <div style={{textAlign:"center",marginTop:80,color:"#9CA3AF"}}>
              <div style={{fontSize:52}}>📭</div>
              <p style={{fontSize:17,marginTop:12,color:"#6B7280",fontWeight:600}}>Henüz not yok</p>
              <p style={{fontSize:14}}>Sol menüden ders seç veya + ile not ekle</p>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
              {filteredNotes.map(note=>(
                <NoteCard key={note.id} note={note}
                  subject={getSubject(note.subject)}
                  onClick={()=>setSelectedNote(note)}
                  onDelete={()=>deleteNote(note.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
