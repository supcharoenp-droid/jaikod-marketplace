/**
 * COMPREHENSIVE CAMERA KEYWORDS - Category 8 (กล้องถ่ายรูป)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const CAMERA_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 801: DIGITAL CAMERAS / กล้องดิจิตอล
    // ========================================
    801: [
        // Types
        'กล้องดิจิตอล', 'digital camera', 'กล้องถ่ายรูป',
        'mirrorless', 'มิเรอร์เลส', 'กล้องเปลี่ยนเลนส์ได้',
        'dslr', 'กล้องโปร',
        'compact camera', 'กล้องคอมแพค', 'point and shoot',
        'action camera', 'แอคชั่นแคม', 'กล้องโกโปร',

        // Sensor Types & Specs
        'full frame', 'aps-c', 'm4/3', 'micro four thirds',
        'medium format', '1 inch sensor',
        'megapixel', 'mp', '24mp', '45mp', '61mp',
        'crop sensor', 'full-frame sensor',

        // Camera Features - Focus & Stabilization
        'autofocus', 'af', 'eye af', 'animal af', 'face detection',
        'continuous af', 'tracking af',
        'ibis', 'in-body stabilization', 'กันสั่น', '5-axis ibis',

        // Camera Features - Performance
        'iso', 'high iso', 'low light', 'iso range',
        'fps', 'burst mode', 'ถ่ายต่อเนื่อง', '20fps', '30fps',
        'buffer', 'continuous shooting',
        'shutter speed', 'electronic shutter',

        // Video Features
        '4k video', '4k 60fps', '4k 120fps',
        '8k video', '8k 30fps',
        'video camera', 'กล้องวิดีโอ', 'hybrid camera',
        'log profile', 'slog', 'clog', 'vlog',
        '10-bit', '422', '420', 'codec', 'h264', 'h265',
        'cinema camera', 'กล้องทำหนัง',

        // Sony - Cameras
        'sony camera', 'sony alpha', 'sony a7', 'a7iii', 'a7iv', 'a7rv', 'a7c', 'a7cii',
        'a7siii', 'a7r', 'a9', 'a9iii',
        'a6000', 'a6400', 'a6700', 'zv-e10', 'zv-1', 'zv-1f', 'fx3', 'fx30',
        'g master', 'gm lens',

        // Canon - Cameras
        'canon camera', 'canon eos', 'canon r', 'canon r5', 'canon r6', 'canon r8', 'canon r50',
        'canon rp', 'canon r10', 'canon r3',
        'canon m50', 'canon m200', 'canon 200d', 'canon 5d', 'canon 6d',
        'g7x', 'g7x mark ii', 'g7x mark iii',

        // Fujifilm - Cameras
        'fujifilm', 'fuji camera', 'fuji x series',
        'xt30', 'xt4', 'xt5', 'x100v', 'x100vi', 'xe4', 'xs10', 'xs20',
        'xh2', 'xh2s', 'x-pro3',
        'instax', 'กล้องโพลารอยด์', 'กล้องฟิล์มใช้แล้วทิ้ง',

        // Nikon - Cameras
        'nikon camera', 'nikon z', 'nikon zf', 'nikon zfc', 'nikon z50', 'nikon z30',
        'nikon z6', 'nikon z6iii', 'nikon z8', 'nikon z9',
        'd750', 'd850', 'd7500',

        // Other Premium Brands
        'leica', 'leica q2', 'leica q3', 'leica m11', 'leica sl2',
        'panasonic lumix', 'lumix s5', 'lumix s5ii', 'gh5', 'gh6', 'gh7',
        'olympus', 'om system', 'om-1', 'pen-f',
        'ricoh gr', 'ricoh gr iii', 'gr3', 'gr3x',
        'hasselblad', 'hasselblad x2d',

        // Video/Cinema Cameras
        'blackmagic', 'bmpcc', 'pocket cinema camera',
        'blackmagic 4k', 'blackmagic 6k',
        'z cam', 'zcam e2',

        // Action Cams
        'gopro', 'gopro 9', 'gopro 10', 'gopro 11', 'gopro 12', 'gopro hero',
        'dji osmo action', 'osmo action 4', 'osmo action 3',
        'insta360', 'insta360 x3', 'insta360 x4', 'insta360 ace pro',
        'pocket 3', 'dji pocket', 'dji pocket 2',

        // Conditions & Terms
        'กล้องมือสอง', 'กล้องมือ1', 'กล้องมือ2',
        'shutter count', 'ชัตเตอร์', 'sc', 'low shutter',
        'ครบกล่อง', 'full box', 'complete set',
        'ประกัน', 'warranty', 'ศูนย์ไทย', 'grey market',

        // Budget & Entry Level
        'entry level camera', 'กล้องเริ่มต้น',
        'budget camera', 'กล้องราคาถูก', 'กล้องงบน้อย',

        // Thai Camera Terms
        'กล้องถ่ายรูปมือสอง', 'กล้องราคาดี',
        'กล้องสำหรับมือใหม่', 'กล้อง vlog',
    ],

    // ========================================
    // 802: FILM CAMERAS / กล้องฟิล์ม
    // ========================================
    802: [
        // Types
        'กล้องฟิล์ม', 'film camera', 'film photography',
        'slr film', 'rangefinder', 'point & shoot film',
        'half frame', 'กล้องฮาล์ฟเฟรม',
        'toy camera', 'กล้องทอย', 'lomo',

        // Popular Film Cameras - Canon
        'canon ae-1', 'canon a-1', 'canon ae-1 program',
        'canon af35m', 'canon sure shot',

        // Popular Film Cameras - Olympus
        'olympus mju', 'mju ii', 'olympus trip 35',
        'olympus xa', 'olympus xa2', 'xa3',
        'olympus pen', 'pen f', 'pen ft',

        // Popular Film Cameras - Nikon
        'nikon fm2', 'nikon f3', 'nikon fe2', 'nikon fe',
        'nikon l35af', 'nikon f', 'nikon f4',

        // Popular Film Cameras - Other Brands
        'leica m3', 'leica m6', 'leica m7',
        'contax t2', 'contax t3', 'contax g1', 'contax g2',
        'yashica electro 35', 'yashica t4', 'yashica t5',
        'pentax k1000', 'pentax 67', 'pentax mx', 'pentax espio',
        'minolta x700', 'minolta tc-1', 'minolta cle',
        'rollei 35', 'rollei 35s',
        'kodak m35', 'kodak ektar', 'kodak retina',

        // Medium & Large Format
        'medium format film', '120 film', '220 film',
        'large format', '4x5', '8x10', 'sheet film',
        'tlr', 'twin lens reflex',
        'hasselblad 500cm', 'hasselblad 501cm',
        'rolleiflex', 'yashica mat', 'yashica mat 124g',
        'mamiya 7', 'mamiya rz67', 'mamiya 645',

        // Instant / Polaroid
        'polaroid camera', 'โพลารอยด์',
        'polaroid sx-70', 'polaroid 600', 'polaroid one step',
        'instax mini', 'instax wide', 'instax square',
        'instant film', 'ฟิล์มโพลา', 'film polaroid',

        // Films - Types
        'ฟิล์มถ่ายรูป', 'film roll', 'film 35mm', 'film 120',
        'negative film', 'reversal film', 'slide film',
        'iso 200', 'iso 400', 'iso 800',
        'expired film', 'ฟิล์มหมดอายุ',

        // Films - Brands
        'kodak gold', 'kodak colorplus', 'kodak portra', 'ultramax',
        'fuji c200', 'fuji color 100', 'fujicolor',
        'cinestill', 'cinestill 800t',
        'ilford', 'ilford hp5', 'ฟิล์มขาวดำ', 'black and white film',

        // Film Processing
        'film developing', 'อัดล้าง', 'ล้างฟิล์ม',
        'film scanning', 'สแกนฟิล์ม', 'scan negative',
        'lab', 'ร้านล้างฟิล์ม', 'film lab',

        // Conditions & Terms
        'กล้องฟิล์มมือสอง', 'กล้องฟิล์มราคา',
        'กล้องวินเทจ', 'vintage camera',
        'กล้องสะสม', 'collector camera',
        'mint condition', 'near mint',
        'working condition', 'ใช้งานได้',
        'as is', 'ต้องซ่อม',
    ],

    // ========================================
    // 803: LENSES / เลนส์
    // ========================================
    803: [
        // Types
        'เลนส์', 'lens', 'camera lens', 'เลนส์กล้อง',
        'เลนส์ฟิก', 'prime lens', 'fixed lens',
        'เลนส์ซูม', 'zoom lens', 'kit lens',
        'เลนส์มือหมุน', 'manual lens', 'manual focus',
        'เลนส์ไวด์', 'wide angle', 'ultra wide',
        'เลนส์เทเล', 'telephoto', 'lens zoom',
        'เลนส์มาโคร', 'macro lens', '1:1 macro',
        'เลนส์พอร์ตเทรต', 'portrait lens', 'เลนส์ละลายหลัง',

        // Lens Specs & Features
        'f1.4', 'f1.8', 'f2.8', 'f4', 'f5.6', 'f1.2',
        'aperture', 'ความสว่าง', 'max aperture',
        'bokeh', 'ความเบลอ', 'out of focus',
        'sharpness', 'ความคม', 'sharp lens',
        'chromatic aberration', 'ca',
        'image stabilization', 'is', 'vr', 'oss', 'vc',
        'weather sealed', 'กันน้ำ',

        // Mounts
        'e-mount', 'fe-mount', // Sony
        'rf-mount', 'ef-mount', 'ef-s', // Canon
        'x-mount', 'xf-mount', // Fuji
        'z-mount', 'f-mount', // Nikon
        'l-mount', // Leica/Panasonic/Sigma
        'm-mount', // Leica M
        'm43', 'micro 4/3', 'mft',

        // Focal Lengths
        '16-35mm', '24-70mm', '70-200mm', '24-105mm',
        '35mm f1.4', '50mm f1.8', '85mm f1.4', '24mm f1.4',
        '50mm f1.2', '135mm f1.8',
        'wide lens', 'tele lens', 'standard zoom',

        // Popular Sony Lenses (GM & G)
        'gm lens', 'g master',
        'sony 24-70 gm', 'sony 70-200 gm', 'sony 16-35 gm',
        'sony 35mm f1.4 gm', 'sony 50mm f1.2 gm',
        'sony 85mm f1.4 gm', 'sony 24mm f1.4 gm',
        'sony 135mm f1.8 gm',

        // Popular Canon Lenses (RF & EF)
        'rf lens', 'ef lens', 'l lens', 'เลนส์ l',
        'canon 24-105', 'canon 70-200',
        'canon 50mm f1.8 stm', 'nifty fifty',
        'canon 24-70 f2.8', 'canon rf 24-70',

        // Popular Fuji Lenses
        'fujinon', 'xf lens',
        'fuji 18-55', 'fuji 56mm f1.2',
        'fuji 23mm f1.4', 'fuji 35mm f1.4',

        // Popular Nikon Lenses
        'nikkor', 'z lens', 'nikkor z',
        'nikon 24-70 z', 'nikon 70-200 z',
        'nikon 50mm f1.8', 'nikon z 85mm',

        // 3rd Party Brands
        'sigma', 'sigma art', 'sigma contemporary', 'sigma sports',
        'tamron', 'tamron 28-75', 'tamron 17-28', 'tamron 70-180',
        'samyang', 'rokinon', 'viltrox', 'viltrox 85mm',
        'laowa', 'ttartisan', '7artisans',
        'voigtlander', 'zeiss', 'zeiss batis',

        // Specialty Lenses
        'fisheye', 'เลนส์ตาปลา', 'fisheye lens',
        'tilt-shift', 'tilt shift lens',
        'cine lens', 'เลนส์หนัง', 'cinema lens',

        // Lens Adapters
        'adapter', 'อแดปเตอร์', 'lens adapter',
        'ef to rf', 'ef to e-mount', 'ef to z',
        'manual adapter', 'smart adapter',

        // Lens Conditions
        'เลนส์มือสอง', 'เลนส์มือ1',
        'fungus', 'เชื้อรา', 'ราในเลนส์',
        'dust', 'ฝุ่น', 'ฝุ่นในเลนส์',
        'scratch', 'รอย', 'รอยขีดข่วน',
        'haze', 'คราบ',

        // Thai Lens Terms
        'เลนส์ราคาดี', 'เลนส์งบน้อย',
        'เลนส์หลักสิบ', 'เลนส์ 50mm',
    ],

    // ========================================
    // 804: STUDIO EQUIPMENT / อุปกรณ์สตูดิโอ
    // ========================================
    804: [
        // Lighting - Main Lights
        'ไฟสตูดิโอ', 'studio light', 'softbox', 'ซอฟบ็อกซ์',
        'ไฟ led', 'led panel', 'cob light', 'ring light', 'ไฟวงแหวน',
        'ไฟต่อเนื่อง', 'continuous light',
        'แฟลช', 'flash', 'speedlite', 'trigger', 'flash trigger',

        // Lighting - Details
        'key light', 'fill light', 'ไฟหลัก',
        'back light', 'rim light', 'hair light',
        'ไฟสองสี', 'bi-color', 'rgb light', 'tunable white',
        'portable light', 'ไฟพกพา',

        // Lighting Brands
        'nanlite', 'aputure', 'godox', 'amaran',
        'aputure 300d', 'aputure 600d', 'aputure mc',
        'godox sl60', 'godox vl150',

        // Lighting Modifiers
        'umbrella', 'ร่มสตูดิโอ', 'softbox umbrella',
        'reflector', 'บอร์ดสะท้อนแสง', '5-in-1 reflector',
        'diffuser', 'กระจายแสง', 'diffusion',
        'grid', 'honeycomb', 'egg crate',
        'beauty dish', 'snoot',

        // Stands & Supports
        'ขาตั้งกล้อง', 'tripod', 'carbon tripod', 'aluminum tripod',
        'ขาตั้งไฟ', 'light stand', 'c-stand',
        'monopod', 'boom arm', 'extension arm',

        // Gimbals & Stabilizers
        'gimbal', 'ไม้กันสั่น', 'stabilizer', '3-axis gimbal',
        'dji ronin', 'rs3', 'rs4', 'rs3 pro', 'rs2',
        'zhiyun', 'zhiyun crane', 'feiyutech',
        'slider', 'รางสไลด์', 'motorized slider',

        // Video Monitors
        'field monitor', 'external monitor', 'monitor 5 inch', 'monitor 7 inch',
        'atomos', 'ninja v', 'shogun', 'atomos ninja v+',
        'feelworld', 'feelworld f6', 'smallhd',
        'hdmi monitor', 'sdi monitor',

        // Camera Rigs & Cages
        'camera cage', 'เคจกล้อง', 'rig',
        'smallrig', 'smallrig cage', 'tilta', 'tilta cage',
        'follow focus', 'focus puller',
        'matte box', 'lens hood box',
        'top handle', 'side handle',

        // Audio - Wireless Mic
        'mic wireless', 'ไมค์ไวเลส', 'wireless microphone',
        'dji mic', 'dji mic 2', 'rode wireless go', 'rode wireless go 2',
        'saramonic', 'hollyland lark',

        // Audio - Wired Mic
        'shotgun mic', 'ไมค์บูม', 'boom mic',
        'lavalier mic', 'ไมค์คลิป', 'lav mic',
        'xlr cable', 'audio cable', 'xlr mic',

        // Audio - Recorders
        'recorder', 'audio recorder',
        'zoom h5', 'zoom h6', 'zoom f6',
        'boom pole', 'ไม้บูม', 'mic boom',

        // Content Creator Gear
        'teleprompter', 'autocue',
        'overhead camera rig', 'overhead mount',
        'product photography setup',

        // Storage & Cards
        'memory card', 'sd card', 'cfexpress', 'cf express',
        'card reader', 'ตัวอ่านการ์ด', 'usb-c card reader',
        'memory card case', 'sd card case',
        'hard drive', 'external ssd', 'portable ssd',

        // Accessories
        'กระเป๋ากล้อง', 'camera bag', 'peak design', 'peak design backpack',
        'สายคล้องกล้อง', 'camera strap', 'peak design strap',
        'filter', 'uv filter', 'cpl', 'nd filter', 'mist filter', 'variable nd',
        'dry box', 'ตู้กันชื้น', 'dehumidifier',

        // Backgrounds & Props
        'backdrop', 'ฉากถ่ายรูป', 'green screen', 'chroma key',
        'muslin backdrop', 'paper backdrop', 'ฉากกระดาษ',
        'vinyl backdrop', 'collapsible backdrop',
        'props', 'อุปกรณ์ประกอบ',

        // Thai Studio Terms
        'อุปกรณ์สตูดิโอมือสอง',
        'ชุดไฟสตูดิโอ', 'lighting kit',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_CAMERAS_KEYWORDS = Object.values(CAMERA_SUBCATEGORY_KEYWORDS).flat()
