import { useState, useRef } from "react";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["일","월","화","수","목","금","토"];

// Pastel colors per day-of-week
const DAY_COLORS = ["#FFB3BA","#FFDFBA","#FFFFBA","#BAFFC9","#BAE1FF","#E8BAFF","#FFC8E8"];

function generateDots(count) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      color: DAY_COLORS[Math.floor(Math.random() * DAY_COLORS.length)],
      delay: Math.random() * 2,
    });
  }
  return dots;
}
const BG_DOTS = generateDots(28);

// ─── Setting Screen ───────────────────────────────────────────────────────────
function SettingScreen({ settings, onSave }) {
  const [age, setAge] = useState(settings.age);
  const [name, setName] = useState(settings.name);
  const [style, setStyle] = useState(settings.style);

  const styles = [
    { id: "watercolor", label: "수채화 🎨", emoji: "🎨" },
    { id: "cartoon", label: "만화 🦊", emoji: "🦊" },
    { id: "crayon", label: "크레파스 ✏️", emoji: "✏️" },
    { id: "picture_book", label: "그림책 📚", emoji: "📚" },
  ];

  return (
    <div style={styles2.screen}>
      <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: 22, marginBottom: 24, color: "#5B4FCF" }}>
        ⚙️ 설정
      </h2>
      <label style={styles2.label}>아이 이름</label>
      <input
        style={styles2.input}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="예: 하늘이"
      />
      <label style={styles2.label}>나이</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {[5,6,7,8,9,10,11,12].map(a => (
          <button
            key={a}
            onClick={() => setAge(a)}
            style={{
              ...styles2.ageBtn,
              background: age === a ? "#5B4FCF" : "#EEE9FF",
              color: age === a ? "#fff" : "#5B4FCF",
            }}
          >
            {a}세
          </button>
        ))}
      </div>
      <label style={styles2.label}>그림 스타일</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
        {styles.map(s => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            style={{
              ...styles2.styleBtn,
              background: style === s.id ? "#5B4FCF" : "#F7F4FF",
              color: style === s.id ? "#fff" : "#5B4FCF",
              border: `2px solid ${style === s.id ? "#5B4FCF" : "#D4CAFF"}`,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <button
        style={styles2.primaryBtn}
        onClick={() => onSave({ age, name, style })}
      >
        저장하기 ✨
      </button>
    </div>
  );
}

// ─── Calendar Screen ──────────────────────────────────────────────────────────
function CalendarScreen({ entries, settings, onDateClick, onCamera, onSettings }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (cells.length % 7 !== 0) cells.push(null);

  const hasEntry = (d) => {
    if (!d) return false;
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return !!entries[key];
  };

  return (
    <div style={styles2.screen}>
      {/* floating dots */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 28 }}>
        {BG_DOTS.map((d, i) => (
          <div key={i} style={{
            position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
            width: d.size, height: d.size, borderRadius: "50%",
            background: d.color, opacity: 0.35,
            animation: `float ${3 + d.delay}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, position: "relative" }}>
        <span style={{ fontFamily: "'Jua', sans-serif", fontSize: 13, color: "#9B8EC4" }}>
          {settings.name ? `${settings.name}의 일기 🌟` : "내 일기 🌟"}
        </span>
        <button onClick={onSettings} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>⚙️</button>
      </div>

      {/* month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 14, position: "relative" }}>
        <button
          onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
          style={styles2.navBtn}
        >‹</button>
        <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: 26, color: "#5B4FCF", margin: 0 }}>
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
          style={styles2.navBtn}
        >›</button>
      </div>

      {/* day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6, position: "relative" }}>
        {DAY_NAMES.map((d, i) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700,
            color: i === 0 ? "#FF6B6B" : i === 6 ? "#5B8CFF" : "#9B8EC4",
            fontFamily: "'Jua', sans-serif" }}>
            {d}
          </div>
        ))}
      </div>

      {/* dates */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, position: "relative" }}>
        {cells.map((d, i) => {
          const dow = i % 7;
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const done = hasEntry(d);
          return (
            <button
              key={i}
              disabled={!d}
              onClick={() => d && onDateClick(year, month, d)}
              style={{
                aspectRatio: "1",
                borderRadius: 12,
                border: isToday ? "2.5px solid #5B4FCF" : "none",
                background: done
                  ? DAY_COLORS[dow]
                  : d ? "rgba(255,255,255,0.6)" : "transparent",
                cursor: d ? "pointer" : "default",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                fontSize: 13,
                fontFamily: "'Jua', sans-serif",
                color: dow === 0 ? "#FF6B6B" : dow === 6 ? "#5B8CFF" : "#555",
                fontWeight: isToday ? 700 : 400,
                boxShadow: done ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "transform 0.1s",
              }}
            >
              {d || ""}
              {done && <span style={{ fontSize: 9 }}>🖼️</span>}
            </button>
          );
        })}
      </div>

      {/* camera button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20, position: "relative" }}>
        <button onClick={onCamera} style={styles2.cameraBtn}>
          <span style={{ fontSize: 28 }}>📷</span>
          <span style={{ fontFamily: "'Jua', sans-serif", fontSize: 13, color: "#5B4FCF" }}>오늘 일기 찍기</span>
        </button>
      </div>
    </div>
  );
}

// ─── Diary Entry Screen ───────────────────────────────────────────────────────
function DiaryScreen({ dateKey, entry, settings, onBack, onSave, onDelete }) {
  const [photo, setPhoto] = useState(entry?.photo || null);
  const [text, setText] = useState(entry?.text || "");
  const [generatedImg, setGeneratedImg] = useState(entry?.generatedImg || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const fileRef = useRef();
  const cameraRef = useRef();

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
    setText("");
    setGeneratedImg(null);
  };

  const styleLabels = {
    watercolor: "수채화 스타일",
    cartoon: "귀여운 만화 스타일",
    crayon: "크레파스 그림 스타일",
    picture_book: "동화책 삽화 스타일",
  };

  const generateImage = async () => {
    if (!text && !photo) return;
    setLoading(true);
    setError(null);
    try {
      const VISION_KEY = import.meta.env.VITE_VISION_API_KEY;
      const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const styleLabel = styleLabels[settings.style] || "수채화 스타일";
      const ageLabel = settings.age ? `${settings.age}세 아이가 쓴` : "아이가 쓴";

      // Step 1: Google Vision으로 손글씨 인식
      let diaryText = text;
      if (photo && !text) {
        const visionRes = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requests: [{
                image: { content: photo.split(",")[1] },
                features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
              }],
            }),
          }
        );
        const visionData = await visionRes.json();
        diaryText = visionData.responses?.[0]?.fullTextAnnotation?.text || "";
        setText(diaryText);
      }

      // Step 2: Gemini로 SVG 그림 생성
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${ageLabel} 일기 내용을 바탕으로 ${styleLabel}의 따뜻하고 귀여운 그림을 SVG로 만들어줘.
일기 내용: "${diaryText || "오늘 즐거웠어요"}"
SVG 코드만 반환해줘. 다른 설명 없이 SVG 태그만. viewBox="0 0 300 300" width="300" height="300" 사용.
밝고 따뜻한 색상, 단순하고 귀여운 일러스트 스타일.`
              }]
            }],
            generationConfig: { maxOutputTokens: 1000 },
          }),
        }
      );
      const geminiData = await geminiRes.json();
      console.log("Gemini 응답:", JSON.stringify(geminiData));
      if (geminiData.error) {
        setError(`Gemini 오류: ${geminiData.error.message}`);
        setLoading(false);
        return;
      }
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("rawText:", rawText.slice(0, 200));
      // 마크다운 코드블록 제거 후 SVG 추출
      const cleaned = rawText
        .replace(/```svg|```xml|```html|```/gi, "")
        .trim();
      const svgMatch = cleaned.match(/<svg[\s\S]*?<\/svg>/i);
      setGeneratedImg(svgMatch ? svgMatch[0] : null);
      if (!svgMatch) setError(`SVG 추출 실패. 응답: ${rawText.slice(0, 80)}`);
    } catch (e) {
      setError("오류가 발생했어요: " + e.message);
    }
    setLoading(false);
  };

  const handleSave = () => {
    onSave(dateKey, { photo, text, generatedImg });
  };

  const [d] = dateKey.split("-").slice(2);
  const [y, m] = dateKey.split("-");

  return (
    <div style={styles2.screen}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={styles2.backBtn}>‹</button>
        <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: 19, color: "#5B4FCF", margin: 0 }}>
          {y}년 {m}월 {d}일 일기
        </h2>
      </div>

      {/* Photo area */}
      <div
        onClick={() => !photo && setShowPhotoMenu(true)}
        style={{
          width: "100%", height: 140, borderRadius: 16, overflow: "hidden",
          background: photo ? "transparent" : "linear-gradient(135deg,#EEE9FF,#FFE9F3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: photo ? "default" : "pointer", marginBottom: 12,
          border: "2px dashed #C4B5FF",
          position: "relative",
        }}
      >
        {photo
          ? <>
              <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="diary" />
              <button
                onClick={(e) => { e.stopPropagation(); setPhoto(null); }}
                style={{
                  position: "absolute", top: 6, right: 6,
                  background: "rgba(0,0,0,0.45)", color: "#fff",
                  border: "none", borderRadius: 8, padding: "2px 8px",
                  fontSize: 12, cursor: "pointer",
                }}
              >변경</button>
            </>
          : <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36 }}>📷</div>
              <div style={{ fontFamily: "'Jua', sans-serif", color: "#9B8EC4", fontSize: 13 }}>
                탭해서 사진 추가
              </div>
            </div>
        }
      </div>

      {/* Photo source menu */}
      {showPhotoMenu && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          zIndex: 100,
        }} onClick={() => setShowPhotoMenu(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: "20px 20px 0 0",
              padding: "20px 20px 36px", width: "100%", maxWidth: 360,
            }}
          >
            <div style={{ fontFamily: "'Jua', sans-serif", fontSize: 15, color: "#5B4FCF", marginBottom: 16, textAlign: "center" }}>
              사진을 어떻게 추가할까요?
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => { cameraRef.current?.click(); setShowPhotoMenu(false); }}
                style={{
                  flex: 1, padding: "16px 8px", borderRadius: 16,
                  background: "#EEE9FF", border: "none", cursor: "pointer",
                  fontFamily: "'Jua', sans-serif", fontSize: 14, color: "#5B4FCF",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 28 }}>📷</span>
                카메라 촬영
              </button>
              <button
                onClick={() => { fileRef.current?.click(); setShowPhotoMenu(false); }}
                style={{
                  flex: 1, padding: "16px 8px", borderRadius: 16,
                  background: "#F0FFF4", border: "none", cursor: "pointer",
                  fontFamily: "'Jua', sans-serif", fontSize: 14, color: "#3A9B6F",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 28 }}>🖼️</span>
                갤러리 선택
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카메라 전용 */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment"
        style={{ display: "none" }} onChange={handlePhoto} />
      {/* 갤러리 전용 */}
      <input ref={fileRef} type="file" accept="image/*"
        style={{ display: "none" }} onChange={handlePhoto} />

      {/* Text area */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="일기 내용을 입력하거나 사진을 찍어봐요 ✏️"
          style={{
            width: "100%", minHeight: 80, borderRadius: 14,
            border: "2px solid #D4CAFF", padding: "10px 12px",
            fontFamily: "'Jua', sans-serif", fontSize: 14, color: "#444",
            background: "#FAFAFF", resize: "none", boxSizing: "border-box",
            outline: "none",
          }}
        />
        <button
          onClick={generateImage}
          disabled={loading || (!text && !photo)}
          style={{
            position: "absolute", bottom: 8, right: 8,
            background: "#5B4FCF", color: "#fff",
            border: "none", borderRadius: 10, padding: "6px 14px",
            fontFamily: "'Jua', sans-serif", fontSize: 12, cursor: "pointer",
            opacity: loading || (!text && !photo) ? 0.5 : 1,
          }}
        >
          {loading ? "🎨 그리는 중..." : "AI 그림 만들기 ✨"}
        </button>
      </div>

      {error && (
        <div style={{ color: "#FF6B6B", fontSize: 12, fontFamily: "'Jua', sans-serif", marginBottom: 8 }}>
          {error}
        </div>
      )}

      {/* Generated image */}
      <div style={{
        width: "100%", minHeight: 180, borderRadius: 18,
        background: "linear-gradient(135deg,#FFF9F0,#F0F4FF)",
        border: "2px solid #E8E0FF",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14, overflow: "hidden", position: "relative",
      }}>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, animation: "spin 1s linear infinite" }}>🎨</div>
            <div style={{ fontFamily: "'Jua', sans-serif", color: "#9B8EC4", fontSize: 13, marginTop: 8 }}>
              그림 그리는 중...
            </div>
          </div>
        ) : generatedImg ? (
          <div dangerouslySetInnerHTML={{ __html: generatedImg }}
            style={{ width: "100%", display: "flex", justifyContent: "center" }} />
        ) : (
          <div style={{ textAlign: "center", opacity: 0.4 }}>
            <div style={{ fontSize: 40 }}>🖼️</div>
            <div style={{ fontFamily: "'Jua', sans-serif", color: "#9B8EC4", fontSize: 12 }}>
              AI 그림이 여기 나타나요
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleSave} style={{ ...styles2.primaryBtn, flex: 2, margin: 0 }}>
          💾 저장하기
        </button>
        <button onClick={() => { setGeneratedImg(null); setText(""); setPhoto(null); }}
          style={{ ...styles2.secondaryBtn, flex: 1 }}>
          ✕ 삭제
        </button>
        {entry && (
          <button onClick={() => onDelete(dateKey)}
            style={{ ...styles2.dangerBtn, flex: 1 }}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles2 = {
  screen: {
    width: "100%", maxWidth: 360, margin: "0 auto",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(16px)",
    borderRadius: 28, padding: 22,
    boxShadow: "0 8px 40px rgba(91,79,207,0.12)",
    minHeight: 580, position: "relative",
    boxSizing: "border-box",
  },
  label: {
    display: "block", fontFamily: "'Jua', sans-serif",
    fontSize: 13, color: "#7B6DB0", marginBottom: 6,
  },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 12,
    border: "2px solid #D4CAFF", fontFamily: "'Jua', sans-serif",
    fontSize: 14, marginBottom: 16, boxSizing: "border-box",
    outline: "none", background: "#FAFAFF",
  },
  ageBtn: {
    padding: "6px 12px", borderRadius: 10, border: "none",
    fontFamily: "'Jua', sans-serif", fontSize: 13, cursor: "pointer",
    transition: "all 0.15s",
  },
  styleBtn: {
    padding: "12px 8px", borderRadius: 14,
    fontFamily: "'Jua', sans-serif", fontSize: 13, cursor: "pointer",
    transition: "all 0.15s",
  },
  primaryBtn: {
    width: "100%", padding: "13px", borderRadius: 16,
    background: "linear-gradient(135deg,#5B4FCF,#8B7FEF)",
    color: "#fff", border: "none",
    fontFamily: "'Jua', sans-serif", fontSize: 15, cursor: "pointer",
    boxShadow: "0 4px 16px rgba(91,79,207,0.3)",
    marginTop: 4,
  },
  secondaryBtn: {
    padding: "13px", borderRadius: 16,
    background: "#F0EDFF", color: "#5B4FCF", border: "none",
    fontFamily: "'Jua', sans-serif", fontSize: 14, cursor: "pointer",
  },
  dangerBtn: {
    padding: "13px", borderRadius: 16,
    background: "#FFF0F0", color: "#FF6B6B", border: "none",
    fontFamily: "'Jua', sans-serif", fontSize: 14, cursor: "pointer",
  },
  navBtn: {
    background: "#EEE9FF", border: "none", borderRadius: 10,
    width: 34, height: 34, fontSize: 20, cursor: "pointer",
    color: "#5B4FCF", display: "flex", alignItems: "center", justifyContent: "center",
  },
  cameraBtn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 4, background: "linear-gradient(135deg,#EEE9FF,#FFE9F3)",
    border: "none", borderRadius: 20, padding: "14px 32px",
    cursor: "pointer", boxShadow: "0 4px 16px rgba(91,79,207,0.15)",
    transition: "transform 0.15s",
  },
  backBtn: {
    background: "#EEE9FF", border: "none", borderRadius: 10,
    width: 32, height: 32, fontSize: 20, cursor: "pointer",
    color: "#5B4FCF", display: "flex", alignItems: "center", justifyContent: "center",
  },
};

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("calendar"); // calendar | diary | settings
  const [settings, setSettings] = useState({ name: "", age: 8, style: "watercolor" });
  const [entries, setEntries] = useState({});
  const [activeDate, setActiveDate] = useState(null);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#F0ECFF 0%,#FFF0F8 50%,#EEF6FF 100%)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "20px 12px",
      fontFamily: "'Jua', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        @keyframes float { from { transform: translateY(0); } to { transform: translateY(-8px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        button:active { transform: scale(0.96); }
      `}</style>

      {screen === "settings" && (
        <SettingScreen
          settings={settings}
          onSave={(s) => { setSettings(s); setScreen("calendar"); }}
        />
      )}

      {screen === "calendar" && (
        <CalendarScreen
          entries={entries}
          settings={settings}
          onDateClick={(y, m, d) => {
            const key = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            setActiveDate(key);
            setScreen("diary");
          }}
          onCamera={() => { setActiveDate(todayKey); setScreen("diary"); }}
          onSettings={() => setScreen("settings")}
        />
      )}

      {screen === "diary" && activeDate && (
        <DiaryScreen
          dateKey={activeDate}
          entry={entries[activeDate]}
          settings={settings}
          onBack={() => setScreen("calendar")}
          onSave={(key, data) => {
            setEntries(prev => ({ ...prev, [key]: data }));
            setScreen("calendar");
          }}
          onDelete={(key) => {
            setEntries(prev => { const n = {...prev}; delete n[key]; return n; });
            setScreen("calendar");
          }}
        />
      )}
    </div>
  );
}