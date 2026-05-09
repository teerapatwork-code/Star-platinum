# Campaign Star — Loyalty Program App · Implementation Plan

> **Stack:** Vite + React 18 · Tailwind CSS v3 · Framer Motion · Lucide-react · localStorage
> **Data source:** `Star.xlsx` — Sheet "May" (1,275 products, promotion 24 เม.ย.–23 พ.ค. 2569)

---

## 1. Data Analysis from Star.xlsx

### 1.1 Sheet: May (Primary Data)

| Column | Key | Description |
|--------|-----|-------------|
| A | `code` | 7-digit Product Code (numeric) |
| B | `name` | Thai product name (รายละเอียดสินค้า) |
| C | `promotion` | Promotion condition text |
| D | `period` | Date range e.g. "24 เม.ย. - 23 พ.ค. 2569" |
| E | `qtyUnit` | Purchase unit e.g. "1 ชิ้น", "2 ชิ้น", "1 ลัง" |
| F | `pricePerPiece` | Normal price per piece (THB) |
| G | `specialPrice` | Special bundle price (THB or '-') |
| H | `storeRebate` | Store compensation |
| I | `ambStars` | **AMB member** fixed stars per purchase unit |
| J | `tmwStars` | **TMW member** fixed stars per purchase unit |

### 1.2 Key Business Rules

- **Two member types:** `AMB` (Ambassador) and `TMW` — each has its own star rate per product
- **Star logic:** Stars are **fixed per product** (not price-calculated). Each product earns a predetermined number of stars per purchase unit.
- **Star formula:** `totalStars = memberStarRate × quantity`
  - Where `memberStarRate` = `ambStars` if member type is AMB, else `tmwStars`
  - `quantity` = number of purchase units the user buys
- **No stars (TMW = '-'):** Some products only reward AMB members; TMW gets 0
- **Promotion period:** `24 เม.ย. - 23 พ.ค. 2569` (April 24 – May 23, 2026)
- **Star ranges:** AMB: 2–144 stars/unit · TMW: 1–12 stars/unit

### 1.3 Sample Products (productMaster subset — representative 30 items)

```js
// Star.xlsx → May sheet → parsed into productMaster constant
// Full list has 1,275 products; app loads from a generated products.js file

export const productMaster = {
  "2901255": {
    name: "นมเปรี้ยว UHT ไอวี่ ผลไม้รวม 180 ลัง",
    qtyUnit: "1 ลัง", pricePerPiece: 446, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 12
  },
  "2901235": {
    name: "นม UHT ไฮคิวสตาร์ท สูตร3 จืด 110 ลัง",
    qtyUnit: "1 ลัง", pricePerPiece: 646, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 12
  },
  "3805340": {
    name: "น้ำด่างพีเอชพลัส 1000 มล.",
    qtyUnit: "4 ชิ้น", pricePerPiece: 30, specialPrice: null,
    promotion: "ซื้อ 2 ชิ้น รับดาวเพิ่ม", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 2
  },
  "5400057": {
    name: "ลอรีเอะซูเปอร์อัลตร้าสลิม 22.5ซม. 10ชิ้น",
    qtyUnit: "1 ชิ้น", pricePerPiece: 39, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 2
  },
  "3804897": {
    name: "วิตอะเดย์ ส้ม ซี1000 150 มล.",
    qtyUnit: "2 ชิ้น", pricePerPiece: 16, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 3
  },
  "2900075": {
    name: "ถั่วเหลือง UHT แลคตาซอยหวาน (พ.6) 125",
    qtyUnit: "2 แพ็ก", pricePerPiece: 36, specialPrice: null,
    promotion: "ซื้อ 2 ชิ้น รับดาวเพิ่ม", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 2
  },
  "4110302": {
    name: "เลย์เฟรนช์ฟราย รสโนริสาหร่าย 40 กรัม",
    qtyUnit: "1 ชิ้น", pricePerPiece: 30, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 100, tmwStars: 1
  },
  "4110428": {
    name: "บรูโน่บราวนี่อบกรอบรสมอคค่า 22 ก. X6",
    qtyUnit: "1 แพ็ก", pricePerPiece: 143, specialPrice: null,
    promotion: "ซื้อ 2 ชิ้น รับดาวเพิ่ม", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 16, tmwStars: 6
  },
  "4201246": {
    name: "แฟนต้าสับปะรด 1 ลิตร",
    qtyUnit: "2 ชิ้น", pricePerPiece: 26, specialPrice: null,
    promotion: "ซื้อ 2 ชิ้น รับดาวเพิ่ม", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 2
  },
  "4200032": {
    name: "บิ๊กโคล่า 322 มล.",
    qtyUnit: "2 ชิ้น", pricePerPiece: 10, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 3, tmwStars: 12
  },
  "3804899": {
    name: "วิตอะเดย์ เลมอน ซี1000 150 มล.",
    qtyUnit: "2 ชิ้น", pricePerPiece: 16, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 3
  },
  "3001309": {
    name: "นมแพลนท์เบสโปรตีนสูงแพลนท์เต้ 350 มล. ช็อกโกแลต",
    qtyUnit: "1 ชิ้น", pricePerPiece: 55, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 1
  },
  "3000086": {
    name: "โยเกิร์ตเมจิ 135 กรัม มิกซ์เบอร์รี่",
    qtyUnit: "2 ชิ้น", pricePerPiece: 15, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 15, tmwStars: 0
  },
  "3000238": {
    name: "โยเกิร์ตเมจิบัลแกเรีย รสโกลเด้นฮันนี่ 110 กรัม",
    qtyUnit: "2 ชิ้น", pricePerPiece: 22, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 15, tmwStars: 0
  },
  "5500298": {
    name: "ถูพื้นมาจิคลีนเบอรี่อโรมา 750 มล.",
    qtyUnit: "1 ชิ้น", pricePerPiece: 45, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 1
  },
  "4002928": {
    name: "เยลลี่เจเล่ชิววี่ผสมบุกกลิ่นลิ้นจี่ 108ก.",
    qtyUnit: "2 ชิ้น", pricePerPiece: 25, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 45, tmwStars: 0
  },
  "4003779": {
    name: "เยลลี่เจเล่ชิววี่ผสมบุกกลิ่นนมเปรี้ยว 108 ก. (พ6)",
    qtyUnit: "1 แพ็ก", pricePerPiece: 135, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 15, tmwStars: 0
  },
  "2900090": {
    name: "ตราหมีโกลด์ไวท์มอลต์ 140",
    qtyUnit: "2 ชิ้น", pricePerPiece: 15, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 2, tmwStars: 3
  },
  "4103045": {
    name: "แซนวิชคุกกี้ฟันโอ กลิ่นสตรอเบอร์รี่ 67.5ก.",
    qtyUnit: "2 ชิ้น", pricePerPiece: 12, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 1
  },
  "4000681": {
    name: "ลูกอมโอเล่กลิ่นซูปเปอร์สตรอเบอร์รี่ไลม์ 17.5 ก.",
    qtyUnit: "2 ชิ้น", pricePerPiece: 12, specialPrice: null,
    promotion: "ซื้อ 2 ชิ้น รับดาวเพิ่ม", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 2
  },
  "3203648": {
    name: "เนยถั่วลิสง ชนิดบดละเอียด ตราสกิปปี 18 กรัม",
    qtyUnit: "1 ชิ้น", pricePerPiece: 15, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 15, tmwStars: 1
  },
  "4001790": {
    name: "เม็ดอมโบตันตลับ 5.4 G",
    qtyUnit: "1 ชิ้น", pricePerPiece: 20, specialPrice: null,
    promotion: "ซื้อสินค้า โบตัน ครบ 79 บาท/ใบเสร็จ", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 1
  },
  "4002551": {
    name: "เดนทีนสแปลชหมากฝรั่งสตรอเบอร์รี่ไลม์ขวด45.6ก.",
    qtyUnit: "1 ชิ้น", pricePerPiece: 59, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 5, tmwStars: 1
  },
  "5012068": {
    name: "น้ำหอมทรอสแคชชวลเดนิม 50 มล.",
    qtyUnit: "1 ชิ้น", pricePerPiece: 56, specialPrice: null,
    promotion: "ซื้อสินค้า เอเวอร์เซ้นส์/วีไวต์/ทรอส ร่วมรายการ", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 45, tmwStars: 0
  },
  "3001071": {
    name: "โยเกิร์ตพร้อมดื่มเมจิบัลแกเรีย 150 มล. สตรอฯ",
    qtyUnit: "2 ชิ้น", pricePerPiece: 20, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 15, tmwStars: 0
  },
  "3805748": {
    name: "กาโตะไอซ์ทีลิ้นจี่ 350 มล.",
    qtyUnit: "1 ชิ้น", pricePerPiece: 25, specialPrice: null,
    promotion: "ซื้อสินค้า กาโตะ ครบ 99 บาท/ใบเสร็จ", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 8, tmwStars: 0
  },
  "3805709": {
    name: "กาโตะ คริสต์มาส แคนดี้ 250 กรัม",
    qtyUnit: "1 ชิ้น", pricePerPiece: 13, specialPrice: null,
    promotion: "ซื้อสินค้า กาโตะ ครบ 99 บาท/ใบเสร็จ", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 9, tmwStars: 0
  },
  "4109958": {
    name: "กูลิโกะป๊อกกี้รสริชช็อกโกแลตโกโก้นิบส์23ก.",
    qtyUnit: "1 ชิ้น", pricePerPiece: 39, specialPrice: null,
    promotion: "ซื้อสินค้า กูลิโกะ ครบ 99 บาท/ใบเสร็จ", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 8, tmwStars: 0
  },
  "5047011": {
    name: "แฮร์บอรีน เอ็กซ์ตร้า สเปเชียล แชมพู 200 มล.",
    qtyUnit: "1 ชิ้น", pricePerPiece: 75, specialPrice: null,
    promotion: "", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 12, tmwStars: 6
  },
  "3201838": {
    name: "ซุปผงรสหมู ตรารสดี 70 กรัม ขายแพ็ก 10",
    qtyUnit: "1 แพ็ก", pricePerPiece: 126, specialPrice: null,
    promotion: "ซื้อสินค้า อายิโนะโมะโต๊ะ ครบ 89 บาท/ใบเสร็จ", period: "24 เม.ย. - 23 พ.ค. 2569",
    ambStars: 10, tmwStars: 0
  },
};
```

> **Note:** The complete `productMaster` is extracted from `Star.xlsx` via a build script (`scripts/parseExcel.js`) and saved to `src/data/products.js`. All 1,275 products are included.

---

## 2. Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Vite | ^5.x | Build tool / dev server |
| React | ^18.x | UI framework |
| Tailwind CSS | ^3.x | Utility-first styling |
| Framer Motion | ^11.x | Animations & 3D effects |
| Lucide-react | ^0.400.x | Icon set |
| openpyxl (build) | ^3.x | One-time Excel → JS data conversion |

---

## 3. Project File Structure

```
website101/
├── Star.xlsx                    ← Source data
├── plan.md                      ← This file
├── scripts/
│   └── parseExcel.py            ← One-time: Excel → src/data/products.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx                  ← Root component + layout
│   ├── data/
│   │   └── products.js          ← Generated productMaster (all 1,275 items)
│   ├── components/
│   │   ├── MemberCard.jsx       ← Floating glass card for member info
│   │   ├── MemberTypeToggle.jsx ← AMB / TMW selector toggle
│   │   ├── PromoBadge.jsx       ← Promotion period badge
│   │   ├── ProductSearch.jsx    ← Code input + qty + live search
│   │   ├── LivePreviewCard.jsx  ← 3D animated purchase preview
│   │   ├── StarDisplay.jsx      ← Animated star count display
│   │   ├── DiarySection.jsx     ← Purchase history list
│   │   └── DiaryEntry.jsx       ← Single diary row
│   ├── hooks/
│   │   └── useDiary.js          ← localStorage read/write hook
│   └── utils/
│       └── starCalc.js          ← Star calculation helpers
```

---

## 4. Visual Design System

### 4.1 Color Palette & Theme

```js
// tailwind.config.js — extend theme
colors: {
  navy: {
    950: '#050A1A',   // deepest background
    900: '#0A1628',   // main bg
    800: '#0F2040',   // card surface
    700: '#1A2E55',   // elevated card
    600: '#243860',   // borders / dividers
  },
  gold: {
    400: '#FFD700',   // primary accent / stars
    500: '#FFC200',   // hover state
    600: '#E6A800',   // pressed
    glow: 'rgba(255,215,0,0.25)',  // glow halo
  },
  glass: {
    light: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.12)',
  }
}
```

### 4.2 3D Neumorphism + Glassmorphism Recipe

```css
/* Glass card base */
.glass-card {
  background: rgba(15, 32, 64, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 1px rgba(255,215,0,0.05);
}

/* Neumorphic raised element */
.neu-raised {
  box-shadow:
    6px 6px 16px rgba(0,0,0,0.5),
    -4px -4px 12px rgba(255,255,255,0.03);
}

/* Gold glow ring on focus/hover */
.gold-glow:hover, .gold-glow:focus {
  box-shadow:
    0 0 0 2px rgba(255,215,0,0.4),
    0 0 20px rgba(255,215,0,0.15);
}
```

### 4.3 Typography

- **Font:** Inter (system) or import `Sarabun` for Thai text support
- **Headings:** `font-bold tracking-tight text-gold-400`
- **Body:** `text-blue-100/80`
- **Labels:** `text-xs uppercase tracking-widest text-blue-300/60`

---

## 5. Component Specifications

### 5.1 `App.jsx` — Root Layout

```
┌─────────────────────────────────────────────────────┐
│  PromoBadge  (top center, floating pill)            │
│                                                     │
│  ┌──────────────────┐   ┌────────────────────────┐  │
│  │  MemberCard      │   │  LivePreviewCard       │  │
│  │  · Name input    │   │  · Product name        │  │
│  │  · MemberType    │   │  · Price per piece     │  │
│  │  · AMB / TMW     │   │  · Qty unit info       │  │
│  └──────────────────┘   │  · Stars this purchase │  │
│                          │  · ★ animated display  │  │
│  ┌──────────────────┐   └────────────────────────┘  │
│  │  ProductSearch   │                               │
│  │  · Code input    │   ┌────────────────────────┐  │
│  │  · Qty input     │   │  DiarySection          │  │
│  │  · Confirm btn   │   │  · Accumulated stars   │  │
│  └──────────────────┘   │  · History entries     │  │
│                          └────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**State managed in `App.jsx`:**
```js
const [memberName, setMemberName] = useState('')
const [memberType, setMemberType] = useState('AMB')   // 'AMB' | 'TMW'
const [productCode, setProductCode] = useState('')
const [quantity, setQuantity] = useState(1)
const [foundProduct, setFoundProduct] = useState(null)
const { diary, addEntry, clearDiary } = useDiary(memberName)
```

---

### 5.2 `MemberCard.jsx`

- Floating glassmorphic card (top-left)
- `<input>` for member name — shows placeholder "กรอกชื่อสมาชิก..."
- Below name: `MemberTypeToggle` (AMB / TMW pill selector)
- On name entered: animate-in a "Welcome {name} 👋" header
- Shows accumulated stars badge: `Σ diary.map(e => e.starsEarned).reduce(+, 0)`

**Framer Motion:** slide-in from left on mount, scale pulse on star update

---

### 5.3 `MemberTypeToggle.jsx`

```jsx
// Pill toggle: AMB ←→ TMW
// Active side highlights with gold glow
// Framer Motion layoutId="toggle-pill" for smooth slide
```

- `AMB` = Ambassador (ตัวแทน)
- `TMW` = Tomorrow (ลูกค้า TMW)
- Switching member type **re-calculates** stars on the current product instantly

---

### 5.4 `PromoBadge.jsx`

```jsx
// Fixed floating pill at top-center
// Content: "🗓 Campaign Star · 24 เม.ย. – 23 พ.ค. 2569"
// Gold border glow, glassmorphic background
// Framer Motion: float bob animation (y: -4 → 4 → -4 loop)
```

---

### 5.5 `ProductSearch.jsx`

**Inputs:**
- `productCode` — text input, numeric, maxLength 7
  - On change: look up `productMaster[productCode]`, set `foundProduct`
  - Show green checkmark icon (Lucide `CheckCircle2`) if found, red X if not
- `quantity` — number input, min 1, max 999
- "ยืนยันการซื้อ" confirm button — enabled only when `foundProduct && memberName`

**Auto-lookup behavior:**
```js
useEffect(() => {
  if (productCode.length === 7) {
    const p = productMaster[productCode]
    setFoundProduct(p || null)
  } else {
    setFoundProduct(null)
  }
}, [productCode])
```

**On Confirm:**
1. Calculate stars (see §6)
2. Add entry to diary via `useDiary.addEntry()`
3. Fire console.log payload (see §7)
4. Reset `productCode` and `quantity`
5. Animate confetti / star burst via Framer Motion

---

### 5.6 `LivePreviewCard.jsx`

Displays in real-time as user types. Shows:

| Field | Value |
|-------|-------|
| รหัสสินค้า | `productCode` |
| ชื่อสินค้า | `foundProduct.name` |
| หน่วยซื้อ | `foundProduct.qtyUnit` |
| ราคา/ชิ้น | `฿{foundProduct.pricePerPiece}` |
| จำนวน | `quantity` หน่วย |
| โปรโมชั่น | `foundProduct.promotion` (if any) |
| ดาวที่ได้ | **`StarDisplay`** component |

**3D tilt effect:** Framer Motion `useMotionValue` for mouse-tracking perspective tilt
```js
// On mouse move over card:
rotateX = map(mouseY, 0, cardH, 15, -15)
rotateY = map(mouseX, 0, cardW, -15, 15)
// CSS: transform: perspective(1000px) rotateX() rotateY()
```

**Empty state:** "ค้นหาสินค้าด้วยรหัส..." placeholder with animated dashed border

---

### 5.7 `StarDisplay.jsx`

```jsx
// Props: { stars: number, memberType: 'AMB'|'TMW' }
// Animated star icons using Framer Motion staggerChildren
// Gold ★ icons pulse and scale-in one by one (up to 10 shown + "x N" if > 10)
// Big number counter animates from 0 → stars using Framer Motion animate
```

Design:
```
  ★ ★ ★ ★ ★  ×2        (shows 5 stars then ×multiplier if > 5)
  [ 100 ดาว ]           (large gold counter)
  [ AMB rate ]          (badge showing rate per unit)
```

---

### 5.8 `DiarySection.jsx` + `DiaryEntry.jsx`

**DiarySection:**
- Shown only when `memberName` is set
- Title: "📖 บันทึกการซื้อของ {memberName}"
- Total accumulated stars banner (sum of all diary entries)
- List of `DiaryEntry` components, newest first
- "ล้างประวัติ" clear button with confirmation

**DiaryEntry:**
```
┌──────────────────────────────────────────────────────┐
│  {timestamp}              {memberType} badge         │
│  {productName}                                       │
│  รหัส: {code}  ·  จำนวน: {qty}  ·  ราคา: ฿{price}  │
│                              ★ +{starsEarned} ดาว   │
└──────────────────────────────────────────────────────┘
```

Framer Motion: `AnimatePresence` + slide-down on entry, slide-up on delete

---

## 6. Core Star Calculation Logic

### `src/utils/starCalc.js`

```js
/**
 * Calculate stars earned for a purchase.
 *
 * @param {object} product   - productMaster entry
 * @param {number} quantity  - number of purchase UNITS (not pieces)
 * @param {'AMB'|'TMW'} memberType
 * @returns {{ starsEarned: number, ratePerUnit: number, hasPromotion: boolean }}
 */
export function calculateStars(product, quantity, memberType) {
  const ratePerUnit = memberType === 'AMB'
    ? product.ambStars
    : product.tmwStars

  const starsEarned = ratePerUnit * quantity

  return {
    starsEarned,
    ratePerUnit,
    hasPromotion: Boolean(product.promotion),
    totalPrice: product.pricePerPiece * quantity,
  }
}

/**
 * Sum accumulated stars from diary entries.
 */
export function accumulatedStars(diary) {
  return diary.reduce((sum, entry) => sum + entry.starsEarned, 0)
}
```

**Key distinction from original prompt:** Stars are NOT calculated as "100 THB = 1 Star". Instead, each product has a **pre-set star rate per purchase unit** sourced directly from the Excel data. The formula is:

```
Total Stars = starRatePerUnit × quantityOfUnits
```

Where `starRatePerUnit` is:
- `ambStars` column (column I) for AMB members
- `tmwStars` column (column J) for TMW members

---

## 7. localStorage Persistence

### `src/hooks/useDiary.js`

```js
const STORAGE_KEY = (memberName) => `campaign_star_diary_${memberName}`

// Diary entry shape:
{
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  memberName: string,
  memberType: 'AMB' | 'TMW',
  productCode: string,
  productName: string,
  qtyUnit: string,
  quantity: number,
  pricePerPiece: number,
  totalPrice: number,
  ratePerUnit: number,
  starsEarned: number,
  cumulativeBalance: number,   // running total up to this entry
}

// Hook API:
const { diary, addEntry, clearDiary } = useDiary(memberName)
// diary: DiaryEntry[]
// addEntry(entry): void — prepends to diary, saves to localStorage
// clearDiary(): void — clears localStorage for this memberName
```

**Multi-member support:** Each member name has a separate localStorage key, so different members' diaries don't collide.

---

## 8. Backend Simulation (console.log Payload)

On confirm purchase, emit to console:

```js
console.log('[CampaignStar] PURCHASE CONFIRMED', JSON.stringify({
  timestamp: new Date().toISOString(),
  memberName: string,
  memberType: 'AMB' | 'TMW',
  productCode: string,
  productName: string,
  qtyUnit: string,                  // e.g. "2 ชิ้น"
  quantity: number,                 // units purchased
  pricePerPiece: number,
  totalPrice: number,               // pricePerPiece × quantity
  ratePerUnit: number,              // ambStars or tmwStars
  starsEarned: number,              // ratePerUnit × quantity
  currentTotalBalance: number,      // accumulated stars including this purchase
  promotion: string | null,
}, null, 2))
```

---

## 9. Animations with Framer Motion

| Element | Animation |
|---------|-----------|
| App mount | `staggerChildren` cascade all sections in |
| MemberCard | `x: -60 → 0, opacity: 0→1` slide from left |
| LivePreviewCard | 3D mouse-tracking tilt (`rotateX`, `rotateY`) |
| StarDisplay | `staggerChildren` — each star scales 0→1 with spring |
| Star counter | `animate={{ count: 0 → starsEarned }}` via custom hook |
| DiaryEntry in | `height: 0 → auto, opacity: 0→1` with `AnimatePresence` |
| PromoBadge | Infinite float bob `y: [0, -8, 0]` |
| Confirm button | `scale: 0.97 → 1` on press, gold shimmer sweep on success |
| Tab toggle (AMB/TMW) | `layoutId="pill"` shared layout animation |

---

## 10. Build Script: Excel → products.js

**`scripts/parseExcel.py`** (run once before dev):

```python
import openpyxl, json, sys, re

sys.stdout.reconfigure(encoding='utf-8')
wb = openpyxl.load_workbook('Star.xlsx')
ws = wb['May']

products = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    if not row[0] or not isinstance(row[0], float):
        continue
    code = str(int(row[0]))
    name = re.sub(r'^[HMVTpL@]+', '', (row[1] or '')).strip()
    
    def parse_stars(val):
        if not val or val == '-': return 0
        try: return int(str(val).replace(' ดาว', '').strip())
        except: return 0

    products[code] = {
        'code': code,
        'name': name,
        'promotion': (row[2] or '').strip(),
        'period': (row[3] or '').replace('ระยะเวลา : ', '').strip(),
        'qtyUnit': str(row[4] or '1 ชิ้น'),
        'pricePerPiece': float(row[5]) if row[5] and row[5] != '-' else 0,
        'specialPrice': float(row[6]) if row[6] and row[6] not in ['-', None] else None,
        'ambStars': parse_stars(row[8]),
        'tmwStars': parse_stars(row[9]),
    }

# Write as ES module
with open('src/data/products.js', 'w', encoding='utf-8') as f:
    f.write('// Auto-generated from Star.xlsx — do not edit manually\n')
    f.write(f'// Total products: {len(products)}\n\n')
    f.write('export const productMaster = ')
    f.write(json.dumps(products, ensure_ascii=False, indent=2))
    f.write(';\n')

print(f'Done. {len(products)} products written to src/data/products.js')
```

Run with: `python scripts/parseExcel.py`

---

## 11. `tailwind.config.js` — Full Config

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050A1A',
          900: '#0A1628',
          800: '#0F2040',
          700: '#1A2E55',
          600: '#243860',
        },
        gold: {
          300: '#FFE566',
          400: '#FFD700',
          500: '#FFC200',
          600: '#E6A800',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-navy':
          'radial-gradient(ellipse at 50% 0%, #1A2E55 0%, #050A1A 70%)',
        'gold-shimmer':
          'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'gold-glow': '0 0 0 2px rgba(255,215,0,0.4), 0 0 20px rgba(255,215,0,0.15)',
        neu: '6px 6px 16px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.03)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
```

---

## 12. `package.json` Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^5.3.0"
  }
}
```

---

## 13. Implementation Steps (Ordered)

### Phase 1 — Setup & Data
- [ ] `npm create vite@latest . -- --template react`
- [ ] Install deps: `npm install framer-motion lucide-react`
- [ ] Install Tailwind: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
- [ ] Configure `tailwind.config.js` (see §11)
- [ ] Add Google Fonts link for Sarabun in `index.html`
- [ ] Run `python scripts/parseExcel.py` → generates `src/data/products.js`

### Phase 2 — Core Logic
- [ ] Write `src/utils/starCalc.js` (calculateStars, accumulatedStars)
- [ ] Write `src/hooks/useDiary.js` (localStorage CRUD)

### Phase 3 — Components (bottom-up)
- [ ] `StarDisplay.jsx` — animated star icons + counter
- [ ] `PromoBadge.jsx` — floating promo pill
- [ ] `MemberTypeToggle.jsx` — AMB/TMW selector
- [ ] `MemberCard.jsx` — member name input + type toggle
- [ ] `ProductSearch.jsx` — code + qty inputs + confirm
- [ ] `LivePreviewCard.jsx` — 3D preview card with tilt
- [ ] `DiaryEntry.jsx` — single history row
- [ ] `DiarySection.jsx` — diary list + accumulated stars
- [ ] `App.jsx` — wire all components + global state

### Phase 4 — Polish
- [ ] Add Framer Motion animations to all components
- [ ] Implement 3D mouse-tilt on LivePreviewCard
- [ ] Add gold shimmer sweep on confirm
- [ ] Add `AnimatePresence` for diary entries
- [ ] Test localStorage persistence with multiple member names
- [ ] Test AMB vs TMW star calculation on 5+ products
- [ ] Verify console.log payload format

---

## 14. Edge Cases & Validation

| Case | Handling |
|------|---------|
| Product code not found | Show red border + "ไม่พบรหัสสินค้า" message |
| TMW stars = 0 for this product | Show "สินค้านี้ไม่มีดาวสำหรับ TMW" warning in preview |
| Quantity = 0 or negative | Disable confirm, show validation message |
| Member name empty | Disable confirm, show "กรุณากรอกชื่อสมาชิก" |
| localStorage unavailable | Graceful fallback: in-memory state only |
| Very large star values (e.g. 100+ stars/unit × 100 qty = 10,000 stars) | Format with `toLocaleString('th-TH')` |

---

## 15. Improvements Over Original Prompt

1. **Correct star logic:** Uses fixed star rates from Excel data (not "100 THB = 1 star") — matches real business rules
2. **Dual member type:** AMB and TMW each have their own star rates per product, selectable via toggle
3. **Full 1,275 product database:** Generated from actual Excel data, not a few hardcoded samples
4. **Promotion conditions display:** Shows the actual promotion text from Excel (e.g., "ซื้อ 2 ชิ้น รับดาวเพิ่ม")
5. **Multi-member localStorage:** Each member name gets a separate diary key
6. **Thai language support:** Sarabun font, Thai text throughout
7. **Unit-aware pricing:** Shows `qtyUnit` (e.g. "2 ชิ้น", "1 ลัง") alongside quantity for clarity
8. **Special price awareness:** Displays special bundle price when available from Excel column G
