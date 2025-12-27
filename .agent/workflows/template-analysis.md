# JaiKod Professional Template Analysis
# ระบบวิเคราะห์ Field สำหรับทุกหมวดหมู่ - มุมมองคนขาย + คนซื้อ

## 🎯 หลักการออกแบบ Field

### สำหรับคนขาย (Seller Perspective):
1. **กรอกง่าย** - ใช้ dropdown แทน text เท่าที่เป็นไปได้
2. **กรอกเร็ว** - เฉพาะข้อมูลจำเป็น required, อื่นๆ optional
3. **AI ช่วยกรอก** - ดึงข้อมูลจาก OCR, รูปภาพ อัตโนมัติ
4. **ไม่ต้องคิด** - ตัวเลือกชัดเจน ไม่ต้องกังวลเขียนผิด

### สำหรับคนซื้อ (Buyer Perspective):
1. **ข้อมูลครบ** - มีทุกอย่างที่ต้องการรู้ก่อนตัดสินใจ
2. **เปรียบเทียบได้** - ข้อมูลมาตรฐานเดียวกัน เทียบกันง่าย
3. **Filter ได้** - ใช้ค้นหา กรอง ตามเงื่อนไขที่ต้องการ
4. **Trust ได้** - มีข้อมูลสภาพ ตำหนิ ชัดเจน ไม่ปกปิด

---

## 📱 MOBILE (iOS + Android) - Enhanced Fields

### Current Issues:
- ขาด: RAM, CPU/Chip, ขนาดหน้าจอ, กล้อง, รุ่น SIM (Lock/Unlock)
- ขาด: True/AIS ซื้อมา, เครื่องศูนย์/นอก, iCloud Status

### 🆕 Proposed Fields:

#### Section: Device Info (ข้อมูลเครื่อง)
| Field | TH | EN | Type | Required |
|-------|----|----|------|----------|
| brand | ยี่ห้อ | Brand | select | ✅ |
| model | รุ่น | Model | text | ✅ |
| variant | รุ่นย่อย | Variant | text | optional |
| storage | ความจุ | Storage | select: 32GB/64GB/128GB/256GB/512GB/1TB | ✅ |
| ram | RAM | RAM | select: 4GB/6GB/8GB/12GB/16GB/18GB | recommended |
| color | สี | Color | select: colors with emoji | ✅ |
| screen_size | ขนาดหน้าจอ | Screen Size | select: <5.5"/5.5-6.0"/6.1-6.5"/6.5-6.9"/>7" | optional |

#### Section: Origin & Status (ที่มาและสถานะ)
| Field | TH | EN | Type | Options |
|-------|----|----|------|---------|
| origin | ที่มาเครื่อง | Origin | select | ศูนย์ไทย, เครื่องนอก (Unlocked), เครื่องนอก (Locked), เครื่องเติมเงิน (AIS/True/Dtac) |
| activation_status | สถานะเครื่อง | Activation | select | พร้อมใช้งาน, รอปลด iCloud, รอปลด Samsung Account, เครื่อง Demo |
| sim_type | ประเภท SIM | SIM Type | select | 1 SIM, 2 SIM, eSIM + Physical, eSIM Only |
| network | รองรับเครือข่าย | Network | select | 5G, 4G LTE, 3G |

#### Section: Condition (สภาพเครื่อง)
| Field | TH | EN | Type | Scale |
|-------|----|----|------|-------|
| overall_grade | เกรดสภาพ | Condition Grade | select | S (99%), A (95%), B+ (90%), B (85%), C (75%), เครื่องเสีย |
| battery_health | สุขภาพแบต (%) | Battery Health % | select | 100-90%, 89-80%, 79-70%, <70%, ไม่ทราบ |
| screen_condition | สภาพหน้าจอ | Screen | select | สมบูรณ์, รอยเล็กน้อย, รอยเยอะ, แตก |
| body_condition | สภาพตัวเครื่อง | Body | select | สมบูรณ์, รอยเล็กน้อย, บุบ/แตก, งอ |

#### Section: Defects (ตำหนิ) - Multiselect
| Value | TH | EN |
|-------|----|----|
| none | ✨ ไม่มีตำหนิ | No defects |
| face_id | Face ID ไม่ทำงาน | Face ID broken |
| touch_id | ลายนิ้วมือไม่ทำงาน | Fingerprint broken |
| speaker | ลำโพงมีปัญหา | Speaker issues |
| mic | ไมค์มีปัญหา | Microphone issues |
| camera | กล้องมีปัญหา | Camera issues |
| charging | ช่องชาร์จมีปัญหา | Charging port |
| button | ปุ่มกดมีปัญหา | Button issues |
| wifi | WiFi/Bluetooth มีปัญหา | WiFi/BT issues |
| sensor | เซ็นเซอร์มีปัญหา | Sensor issues |
| ghost_touch | หน้าจอกดเอง | Ghost touch |

#### Section: Accessories (อุปกรณ์แถม) - Multiselect
| Value | TH | EN |
|-------|----|----|
| box | กล่องเดิม | Original box |
| charger | หัวชาร์จ | Charger |
| cable | สายชาร์จ | Cable |
| earphone | หูฟัง | Earphones |
| case | เคส | Case |
| screen_protector | ฟิล์มติดแล้ว | Screen protector |

#### Section: Payment (การชำระเงิน)
| Field | TH | EN | Type | Options |
|-------|----|----|------|---------|
| price | ราคา | Price | number | ✅ |
| negotiable | ต่อรองได้ | Negotiable | select | ได้, นิดหน่อย, ไม่ลด |
| installment | ผ่อนได้ | Installment | select | ไม่รับผ่อน, รับ Shopee/Lazada, รับบัตรเครดิต |
| warranty_seller | รับประกันจากผู้ขาย | Seller Warranty | select | ไม่รับ, 7 วัน, 1 เดือน, 3 เดือน |

---

## 🚗 CAR (Used Cars) - Already Enhanced ✅
(อยู่ใน demo page แล้ว)

---

## 🏍️ MOTORCYCLE - Enhanced Fields

### Proposed Additions:
| Field | TH | EN | Type | Options |
|-------|----|----|------|---------|
| cc | ขนาดเครื่อง (cc) | Engine Size | select | <125cc, 150cc, 250-300cc, 400cc, 650cc, 1000cc+ |
| bike_type | ประเภทรถ | Bike Type | select | สกู๊ตเตอร์, เกียร์ธรรมดา, BigBike, Superbike, Café Racer, ADV |
| gear_type | ระบบเกียร์ | Gear | select | ออโต้ (CVT), กึ่งออโต้, เกียร์ธรรมดา |
| abs | ระบบ ABS | ABS | select | ไม่มี, ABS ล้อหน้า, ABS 2 channel |
| tire_condition | สภาพยาง | Tire Condition | select | ใหม่ 100%, ดอกยางดี 70%+, ควรเปลี่ยน |
| modification | การแต่งเพิ่ม | Modifications | multiselect | ท่อแต่ง, แฮนด์แต่ง, โช้คแต่ง, ไฟแต่ง, เบาะแต่ง |
| spare_key | กุญแจสำรอง | Spare Key | select | มี 2 ดอก, มี 1 ดอก, ไม่มี |
| insurance | ประกัน | Insurance | select | ชั้น 1, ชั้น 2, ชั้น 3, พ.ร.บ. เท่านั้น |
| selling_reason | เหตุผลที่ขาย | Reason | select | เปลี่ยนรุ่น, ย้ายไปต่างประเทศ, ไม่ได้ใช้, ต้องการเงิน |

---

## 🏠 PROPERTY (House/Condo/Land) - Enhanced Fields

### House Section:
| Field | TH | EN | Type |
|-------|----|----|------|
| house_type | ประเภทบ้าน | House Type | select: บ้านเดี่ยว, ทาวน์โฮม, ทาวน์เฮาส์, บ้านแฝด |
| land_size | ขนาดที่ดิน | Land Size | text: ตร.วา |
| usable_area | พื้นที่ใช้สอย | Usable Area | text: ตร.ม. |
| bedrooms | ห้องนอน | Bedrooms | select: 1/2/3/4/5+ |
| bathrooms | ห้องน้ำ | Bathrooms | select: 1/2/3/4+ |
| parking | ที่จอดรถ | Parking | select: ไม่มี, 1 คัน, 2 คัน, 3+ คัน |
| floors | จำนวนชั้น | Floors | select: 1/2/3/4 |
| direction | หันทิศ | Facing | select: เหนือ, ใต้, ตะวันออก, ตะวันตก |
| road_access | ถนนหน้าบ้าน | Road Access | select: ซอยแคบ <4ม., ถนนกว้าง 4-6ม., ถนนใหญ่ >6ม. |
| utilities | สาธารณูปโภค | Utilities | multiselect: น้ำประปา, น้ำบาดาล, ไฟ 3 เฟส, อินเทอร์เน็ต |

### Condo Section:
| Field | TH | EN | Type |
|-------|----|----|------|
| room_type | ประเภทห้อง | Room Type | select: Studio, 1 Bed, 2 Bed, 3 Bed, Duplex, Penthouse |
| room_size | ขนาดห้อง (ตร.ม.) | Room Size | text |
| floor | ชั้นที่ | Floor | text |
| building | ตึก/อาคาร | Building | text |
| room_direction | วิว | View | select: สระว่ายน้ำ, เมือง, สวน, แม่น้ำ, ไม่มีวิว |
| facilities | ส่วนกลาง | Facilities | multiselect: สระว่ายน้ำ, ฟิตเนส, Co-working, สวน, โซนเด็ก |
| condo_pet | เลี้ยงสัตว์ | Pet Policy | select: ได้, ไม่ได้, แล้วแต่ตึก |
| common_fee | ค่าส่วนกลาง/เดือน | Monthly Fee | text |
| ownership | กรรมสิทธิ์ | Ownership | select: Freehold, Leasehold |
| transfer_fee | ค่าโอน | Transfer Fee | select: ผู้ขายออก, ผู้ซื้อออก, แบ่งจ่าย 50/50 |

---

## 💻 COMPUTER - Enhanced Fields

### Proposed Additions:
| Field | TH | EN | Type |
|-------|----|----|------|
| form_factor | รูปแบบ | Form Factor | select: Laptop, Desktop, AIO, Mini PC, Workstation |
| screen_size | ขนาดจอ | Screen Size | select: 13", 14", 15.6", 16", 17+", ไม่มี(Desktop) |
| screen_type | ประเภทจอ | Screen Type | select: LCD, IPS, OLED, Mini-LED, Retina |
| refresh_rate | Refresh Rate | Refresh Rate | select: 60Hz, 90Hz, 120Hz, 144Hz, 165Hz, 240Hz+ |
| battery_cycles | รอบแบต | Battery Cycles | select: <100, 100-300, 300-500, 500+, ไม่ทราบ |
| keyboard | แป้นพิมพ์ | Keyboard | select: TH/EN, EN Only, มีปัญหา |
| ports | พอร์ต | Ports | multiselect: USB-A, USB-C, Thunderbolt, HDMI, SD Card |

---

## 🎮 GAMING - Enhanced Fields

### Console Section:
| Field | TH | EN | Type |
|-------|----|----|------|
| console_type | ประเภท | Console | select: PS5, PS5 Digital, PS4 Pro, PS4, Xbox Series X, Xbox Series S, Nintendo Switch OLED, Switch V2, Switch Lite |
| storage | ความจุ | Storage | select: 500GB, 825GB, 1TB, 2TB |
| condition | สภาพ | Condition | select: ยังซีล, แกะใช้ <3 เดือน, 3-6 เดือน, 6-12 เดือน, >1 ปี |
| controllers | จอย | Controllers | select: 1 ตัว, 2 ตัว, 3+ ตัว |
| games | เกมแถม | Games Included | text |
| online_sub | สมาชิก Online | Online Sub | select: ไม่มี, PS Plus, Xbox Game Pass, Nintendo Online |

---

## 📸 CAMERA - Enhanced Fields

### Proposed Fields:
| Field | TH | EN | Type |
|-------|----|----|------|
| camera_type | ประเภท | Type | select: Mirrorless, DSLR, Compact, Action Cam, Film Camera |
| sensor_size | เซ็นเซอร์ | Sensor | select: Full Frame, APS-C, Micro 4/3, 1 inch, 1/2.3" |
| megapixels | ความละเอียด (MP) | Resolution | text |
| shutter_count | Shutter Count | Shutter Count | text |
| lens_mount | เมาท์ | Mount | select: Canon RF, Sony E, Nikon Z, Canon EF, Fuji X, M43 |
| video_capability | ถ่าย Video | Video | select: 4K 60fps, 4K 30fps, 1080p 120fps, 1080p 60fps |

---

## 📦 Future Categories to Consider:

1. **⌚ Smartwatch/Wearables** - Apple Watch, Galaxy Watch, Garmin
2. **🎧 Audio** - หูฟัง, ลำโพง, DAP, Amplifier
3. **🎸 Musical Instruments** - กีตาร์, ไวโอลิน, เปียโน
4. **🎿 Sports Equipment** - จักรยาน, อุปกรณ์กอล์ฟ, อุปกรณ์ฟิตเนส
5. **👶 Baby & Kids** - รถเข็น, คาร์ซีท, เปลโยก
6. **🧳 Travel & Bags** - กระเป๋า, กระเป๋าเดินทาง
7. **💍 Jewelry & Watches** - นาฬิกา Luxury, ทอง, เพชร
8. **🎨 Collectibles** - ของสะสม, ฟิกเกอร์, Trading Cards
9. **🏕️ Outdoor & Camping** - เต็นท์, อุปกรณ์แคมป์
10. **🛠️ Tools & Hardware** - เครื่องมือช่าง, อะไหล่

---

## 🔧 Technical Implementation Notes:

1. **Modular Template System** - แยก template ตาม category/subcategory
2. **AI Field Detection** - ระบุว่า field ไหน AI ตรวจจับได้
3. **OCR Integration** - สำหรับ ยานพาหนะ: อ่านสมุดทะเบียน, มือถือ: อ่านกล่อง/ใบเสร็จ
4. **Smart Defaults** - ค่า default ตาม subcategory (เช่น BigBike มักมี ABS)
5. **Conditional Fields** - แสดง field เฉพาะเมื่อเลือกบาง option
6. **Price Intelligence** - AI แนะนำราคาตาม market data
