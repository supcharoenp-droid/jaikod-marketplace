/**
 * 🏍️ COMPREHENSIVE MOTORCYCLE DATABASE
 * ฐานข้อมูลมอเตอร์ไซค์ครบทุกยี่ห้อ/รุ่นในประเทศไทย
 * 
 * การอัพเดท: เพิ่มรุ่นใหม่ได้ที่ไฟล์นี้โดยตรง
 * Last Updated: 2024-12
 */

// ============================================
// TYPES
// ============================================
export interface MotorcycleModel {
    name: string
    cc: number
    type: MotorcycleType
    years: number[]
    variants?: string[]  // สี/รุ่นย่อย เช่น ABS, CBS
}

export interface MotorcycleBrand {
    name_th: string
    name_en: string
    country: string
    logo?: string
    models: MotorcycleModel[]
}

export type MotorcycleType =
    | 'scooter'       // สกู๊ตเตอร์
    | 'underbone'     // รถครอบครัว (Wave, Dream)
    | 'sport'         // สปอร์ต
    | 'naked'         // เนคเก็ด
    | 'cruiser'       // ครุยเซอร์
    | 'touring'       // ทัวริ่ง
    | 'adventure'     // แอดเวนเจอร์
    | 'offroad'       // ออฟโรด/วิบาก
    | 'classic'       // คลาสสิก/เรโทร
    | 'maxiscooter'   // แม็กซี่สกู๊ตเตอร์
    | 'electric'      // ไฟฟ้า

// ============================================
// TYPE LABELS (Thai/English)
// ============================================
export const MOTORCYCLE_TYPE_LABELS: Record<MotorcycleType, { th: string; en: string; emoji: string }> = {
    scooter: { th: 'สกู๊ตเตอร์', en: 'Scooter', emoji: '🛵' },
    underbone: { th: 'รถครอบครัว', en: 'Underbone', emoji: '🏍️' },
    sport: { th: 'สปอร์ตไบค์', en: 'Sport Bike', emoji: '🏎️' },
    naked: { th: 'เนคเก็ด', en: 'Naked', emoji: '🔥' },
    cruiser: { th: 'ครุยเซอร์', en: 'Cruiser', emoji: '🛣️' },
    touring: { th: 'ทัวริ่ง', en: 'Touring', emoji: '🗺️' },
    adventure: { th: 'แอดเวนเจอร์', en: 'Adventure', emoji: '🏔️' },
    offroad: { th: 'ออฟโรด/วิบาก', en: 'Off-road', emoji: '🏁' },
    classic: { th: 'คลาสสิก/เรโทร', en: 'Classic/Retro', emoji: '🕰️' },
    maxiscooter: { th: 'แม็กซี่สกู๊ตเตอร์', en: 'Maxi Scooter', emoji: '🛴' },
    electric: { th: 'ไฟฟ้า', en: 'Electric', emoji: '⚡' },
}

// ============================================
// HELPER: Generate year range
// ============================================
const yearRange = (start: number, end: number = 2024): number[] => {
    const years = []
    for (let y = start; y <= end; y++) years.push(y)
    return years
}

// ============================================
// MOTORCYCLE DATABASE
// ============================================
export const MOTORCYCLE_DATABASE: Record<string, MotorcycleBrand> = {
    // ========================================
    // HONDA (Japan) - #1 in Thailand
    // ========================================
    honda: {
        name_th: 'ฮอนด้า',
        name_en: 'Honda',
        country: 'Japan',
        models: [
            // === SCOOTER ===
            { name: 'Click 125i', cc: 125, type: 'scooter', years: yearRange(2018), variants: ['Standard', 'LED'] },
            { name: 'Click 160', cc: 160, type: 'scooter', years: yearRange(2022), variants: ['Standard'] },
            { name: 'Scoopy i', cc: 110, type: 'scooter', years: yearRange(2015), variants: ['Club 12', 'Prestige'] },
            { name: 'Moove', cc: 110, type: 'scooter', years: yearRange(2014, 2020) },
            { name: 'Zoomer-X', cc: 110, type: 'scooter', years: yearRange(2012, 2019) },
            { name: 'PCX 125', cc: 125, type: 'scooter', years: yearRange(2010, 2021) },
            { name: 'PCX 150', cc: 150, type: 'scooter', years: yearRange(2014, 2021) },
            { name: 'PCX 160', cc: 160, type: 'scooter', years: yearRange(2021), variants: ['Standard', 'eHEV'] },
            { name: 'ADV 150', cc: 150, type: 'adventure', years: yearRange(2019, 2022) },
            { name: 'ADV 160', cc: 160, type: 'adventure', years: yearRange(2022), variants: ['Standard', 'ABS'] },
            { name: 'Lead 125', cc: 125, type: 'scooter', years: yearRange(2013) },
            { name: 'Giorno+', cc: 50, type: 'scooter', years: yearRange(2020) },

            // === UNDERBONE (Family) ===
            { name: 'Wave 110i', cc: 110, type: 'underbone', years: yearRange(2011), variants: ['Standard', 'LED'] },
            { name: 'Wave 125i', cc: 125, type: 'underbone', years: yearRange(2005), variants: ['Standard', 'LED', 'Disc'] },
            { name: 'Dream 110i', cc: 110, type: 'underbone', years: yearRange(2012), variants: ['Standard'] },
            { name: 'Dream 125', cc: 125, type: 'underbone', years: yearRange(2022) },
            { name: 'Super Cub', cc: 110, type: 'classic', years: yearRange(2018), variants: ['Standard', 'C125'] },
            { name: 'CT125', cc: 125, type: 'classic', years: yearRange(2020) },

            // === SPORT ===
            { name: 'CBR150R', cc: 150, type: 'sport', years: yearRange(2011), variants: ['Standard', 'ABS'] },
            { name: 'CBR250RR', cc: 250, type: 'sport', years: yearRange(2017), variants: ['Standard', 'ABS'] },
            { name: 'CBR300R', cc: 300, type: 'sport', years: yearRange(2015, 2020) },
            { name: 'CBR500R', cc: 500, type: 'sport', years: yearRange(2013), variants: ['Standard', 'ABS'] },
            { name: 'CBR650R', cc: 650, type: 'sport', years: yearRange(2019), variants: ['Standard'] },
            { name: 'CBR1000RR-R', cc: 1000, type: 'sport', years: yearRange(2020), variants: ['Standard', 'SP'] },

            // === NAKED ===
            { name: 'MSX125 (GROM)', cc: 125, type: 'naked', years: yearRange(2013) },
            { name: 'Monkey 125', cc: 125, type: 'classic', years: yearRange(2018) },
            { name: 'Dax 125', cc: 125, type: 'classic', years: yearRange(2022) },
            { name: 'CB150R', cc: 150, type: 'naked', years: yearRange(2019) },
            { name: 'CB300R', cc: 300, type: 'naked', years: yearRange(2018) },
            { name: 'CB500F', cc: 500, type: 'naked', years: yearRange(2013) },
            { name: 'CB650R', cc: 650, type: 'naked', years: yearRange(2019) },

            // === CRUISER ===
            { name: 'Rebel 300', cc: 300, type: 'cruiser', years: yearRange(2017, 2020) },
            { name: 'Rebel 500', cc: 500, type: 'cruiser', years: yearRange(2017), variants: ['Standard', 'ABS'] },
            { name: 'Rebel 1100', cc: 1100, type: 'cruiser', years: yearRange(2021), variants: ['Standard', 'DCT'] },

            // === ADVENTURE ===
            { name: 'CB500X', cc: 500, type: 'adventure', years: yearRange(2013) },
            { name: 'NC750X', cc: 750, type: 'adventure', years: yearRange(2014), variants: ['Standard', 'DCT'] },
            { name: 'CRF250L', cc: 250, type: 'offroad', years: yearRange(2012) },
            { name: 'CRF300L', cc: 300, type: 'offroad', years: yearRange(2021) },
            { name: 'CRF300 Rally', cc: 300, type: 'adventure', years: yearRange(2021) },
            { name: 'Africa Twin CRF1100L', cc: 1100, type: 'adventure', years: yearRange(2020), variants: ['Standard', 'Adventure Sports'] },

            // === MAXI SCOOTER ===
            { name: 'Forza 300', cc: 300, type: 'maxiscooter', years: yearRange(2018, 2020) },
            { name: 'Forza 350', cc: 350, type: 'maxiscooter', years: yearRange(2021), variants: ['Standard'] },
            { name: 'X-ADV 750', cc: 750, type: 'maxiscooter', years: yearRange(2017), variants: ['Standard'] },

            // === TOURING ===
            { name: 'Gold Wing', cc: 1833, type: 'touring', years: yearRange(2018), variants: ['Standard', 'Tour', 'DCT'] },
        ]
    },

    // ========================================
    // YAMAHA (Japan)
    // ========================================
    yamaha: {
        name_th: 'ยามาฮ่า',
        name_en: 'Yamaha',
        country: 'Japan',
        models: [
            // === SCOOTER ===
            { name: 'Mio 125', cc: 125, type: 'scooter', years: yearRange(2018) },
            { name: 'Fino 125', cc: 125, type: 'scooter', years: yearRange(2015) },
            { name: 'Filano', cc: 125, type: 'scooter', years: yearRange(2012) },
            { name: 'Grand Filano', cc: 125, type: 'scooter', years: yearRange(2014), variants: ['Standard', 'Hybrid'] },
            { name: 'Fazzio', cc: 125, type: 'scooter', years: yearRange(2022), variants: ['Standard', 'Hybrid'] },
            { name: 'QBIX', cc: 125, type: 'scooter', years: yearRange(2016) },
            { name: 'FreeGo 125', cc: 125, type: 'scooter', years: yearRange(2018) },
            { name: 'Aerox 155', cc: 155, type: 'scooter', years: yearRange(2017), variants: ['Standard', 'ABS', 'Connected'] },
            { name: 'NMAX 155', cc: 155, type: 'scooter', years: yearRange(2015), variants: ['Standard', 'ABS', 'Connected'] },
            { name: 'XMAX 300', cc: 300, type: 'maxiscooter', years: yearRange(2017), variants: ['Standard', 'ABS'] },
            { name: 'TMAX 560', cc: 560, type: 'maxiscooter', years: yearRange(2020), variants: ['Standard', 'Tech Max'] },

            // === UNDERBONE ===
            { name: 'Finn', cc: 115, type: 'underbone', years: yearRange(2019) },
            { name: 'Spark 115i', cc: 115, type: 'underbone', years: yearRange(2011, 2020) },
            { name: 'Exciter 155', cc: 155, type: 'underbone', years: yearRange(2021), variants: ['Standard', 'ABS'] },

            // === SPORT ===
            { name: 'YZF-R15', cc: 155, type: 'sport', years: yearRange(2014), variants: ['V3', 'V4', 'M'] },
            { name: 'YZF-R3', cc: 321, type: 'sport', years: yearRange(2015), variants: ['Standard', 'ABS'] },
            { name: 'YZF-R6', cc: 600, type: 'sport', years: yearRange(2006, 2021) },
            { name: 'YZF-R7', cc: 689, type: 'sport', years: yearRange(2022) },
            { name: 'YZF-R1', cc: 998, type: 'sport', years: yearRange(2015), variants: ['Standard', 'M'] },

            // === NAKED ===
            { name: 'MT-03', cc: 321, type: 'naked', years: yearRange(2016) },
            { name: 'MT-07', cc: 689, type: 'naked', years: yearRange(2014) },
            { name: 'MT-09', cc: 890, type: 'naked', years: yearRange(2014), variants: ['Standard', 'SP'] },
            { name: 'MT-10', cc: 998, type: 'naked', years: yearRange(2016), variants: ['Standard', 'SP'] },
            { name: 'XSR155', cc: 155, type: 'classic', years: yearRange(2019) },
            { name: 'XSR700', cc: 689, type: 'classic', years: yearRange(2018) },
            { name: 'XSR900', cc: 890, type: 'classic', years: yearRange(2016) },

            // === ADVENTURE ===
            { name: 'WR155R', cc: 155, type: 'offroad', years: yearRange(2020) },
            { name: 'Tenere 700', cc: 689, type: 'adventure', years: yearRange(2019) },
            { name: 'Super Tenere 1200', cc: 1199, type: 'adventure', years: yearRange(2010, 2021) },
            { name: 'Tracer 9', cc: 890, type: 'touring', years: yearRange(2021), variants: ['Standard', 'GT'] },
        ]
    },

    // ========================================
    // KAWASAKI (Japan)
    // ========================================
    kawasaki: {
        name_th: 'คาวาซากิ',
        name_en: 'Kawasaki',
        country: 'Japan',
        models: [
            // === SPORT ===
            { name: 'Ninja 125', cc: 125, type: 'sport', years: yearRange(2019) },
            { name: 'Ninja 250', cc: 250, type: 'sport', years: yearRange(2008, 2018) },
            { name: 'Ninja 300', cc: 300, type: 'sport', years: yearRange(2013, 2017) },
            { name: 'Ninja 400', cc: 400, type: 'sport', years: yearRange(2018), variants: ['Standard', 'ABS'] },
            { name: 'Ninja 650', cc: 650, type: 'sport', years: yearRange(2017), variants: ['Standard', 'ABS'] },
            { name: 'Ninja 1000SX', cc: 1000, type: 'sport', years: yearRange(2020) },
            { name: 'Ninja ZX-6R', cc: 636, type: 'sport', years: yearRange(2013) },
            { name: 'Ninja ZX-10R', cc: 998, type: 'sport', years: yearRange(2011), variants: ['Standard', 'KRT'] },
            { name: 'Ninja H2', cc: 998, type: 'sport', years: yearRange(2015), variants: ['Standard', 'Carbon', 'SX'] },

            // === NAKED ===
            { name: 'Z125 Pro', cc: 125, type: 'naked', years: yearRange(2016) },
            { name: 'Z250', cc: 250, type: 'naked', years: yearRange(2013, 2018) },
            { name: 'Z300', cc: 300, type: 'naked', years: yearRange(2015, 2018) },
            { name: 'Z400', cc: 400, type: 'naked', years: yearRange(2019), variants: ['Standard', 'ABS'] },
            { name: 'Z650', cc: 650, type: 'naked', years: yearRange(2017), variants: ['Standard', 'ABS'] },
            { name: 'Z900', cc: 948, type: 'naked', years: yearRange(2017), variants: ['Standard', 'ABS', 'SE'] },
            { name: 'Z H2', cc: 998, type: 'naked', years: yearRange(2020), variants: ['Standard', 'SE'] },

            // === CLASSIC ===
            { name: 'Z900RS', cc: 948, type: 'classic', years: yearRange(2018), variants: ['Standard', 'Cafe'] },
            { name: 'W800', cc: 773, type: 'classic', years: yearRange(2019), variants: ['Standard', 'Cafe', 'Street'] },

            // === CRUISER ===
            { name: 'Vulcan S', cc: 650, type: 'cruiser', years: yearRange(2015), variants: ['Standard', 'ABS', 'Cafe'] },
            { name: 'Vulcan 900', cc: 903, type: 'cruiser', years: yearRange(2006) },

            // === ADVENTURE ===
            { name: 'KLX 150', cc: 150, type: 'offroad', years: yearRange(2015) },
            { name: 'KLX 230', cc: 230, type: 'offroad', years: yearRange(2020), variants: ['Standard', 'S', 'SE'] },
            { name: 'KLX 300', cc: 300, type: 'offroad', years: yearRange(2021) },
            { name: 'Versys 650', cc: 650, type: 'adventure', years: yearRange(2015), variants: ['Standard', 'ABS'] },
            { name: 'Versys 1000', cc: 1000, type: 'adventure', years: yearRange(2015), variants: ['Standard', 'SE', 'S'] },

            // === TOURING ===
            { name: 'Ninja 1000SX', cc: 1000, type: 'touring', years: yearRange(2020) },
        ]
    },

    // ========================================
    // SUZUKI (Japan)
    // ========================================
    suzuki: {
        name_th: 'ซูซูกิ',
        name_en: 'Suzuki',
        country: 'Japan',
        models: [
            // === SCOOTER ===
            { name: 'Address 110', cc: 110, type: 'scooter', years: yearRange(2015) },
            { name: 'Burgman 125', cc: 125, type: 'scooter', years: yearRange(2018) },
            { name: 'Burgman 200', cc: 200, type: 'scooter', years: yearRange(2014) },
            { name: 'Burgman 400', cc: 400, type: 'maxiscooter', years: yearRange(2017) },
            { name: 'Burgman 650', cc: 650, type: 'maxiscooter', years: yearRange(2013, 2018) },

            // === UNDERBONE ===
            { name: 'Smash 115', cc: 115, type: 'underbone', years: yearRange(2017) },
            { name: 'Raider 150', cc: 150, type: 'underbone', years: yearRange(2015) },

            // === SPORT ===
            { name: 'GSX-R150', cc: 150, type: 'sport', years: yearRange(2017) },
            { name: 'GSX-R1000', cc: 1000, type: 'sport', years: yearRange(2017), variants: ['Standard', 'R'] },
            { name: 'GSX-S750', cc: 750, type: 'sport', years: yearRange(2017) },
            { name: 'GSX-S1000', cc: 1000, type: 'sport', years: yearRange(2015), variants: ['Standard', 'GT'] },
            { name: 'Hayabusa', cc: 1340, type: 'sport', years: yearRange(2021) },

            // === NAKED ===
            { name: 'GSX-S150', cc: 150, type: 'naked', years: yearRange(2017) },
            { name: 'SV650', cc: 650, type: 'naked', years: yearRange(2016), variants: ['Standard', 'X'] },
            { name: 'Katana', cc: 1000, type: 'naked', years: yearRange(2019) },

            // === ADVENTURE ===
            { name: 'V-Strom 250', cc: 250, type: 'adventure', years: yearRange(2017) },
            { name: 'V-Strom 650', cc: 650, type: 'adventure', years: yearRange(2017), variants: ['Standard', 'XT'] },
            { name: 'V-Strom 1050', cc: 1050, type: 'adventure', years: yearRange(2020), variants: ['Standard', 'XT', 'DE'] },

            // === OFFROAD ===
            { name: 'DR-Z400', cc: 400, type: 'offroad', years: yearRange(2000), variants: ['S', 'SM'] },
            { name: 'RM-Z250', cc: 250, type: 'offroad', years: yearRange(2010) },
            { name: 'RM-Z450', cc: 450, type: 'offroad', years: yearRange(2010) },
        ]
    },

    // ========================================
    // GPX (Thailand)
    // ========================================
    gpx: {
        name_th: 'จีพีเอ็กซ์',
        name_en: 'GPX',
        country: 'Thailand',
        models: [
            // === CLASSIC/RETRO ===
            { name: 'Legend 150S', cc: 150, type: 'classic', years: yearRange(2018) },
            { name: 'Legend 200', cc: 200, type: 'classic', years: yearRange(2019) },
            { name: 'Gentleman 200', cc: 200, type: 'classic', years: yearRange(2018) },
            { name: 'Gentleman Racer 200', cc: 200, type: 'classic', years: yearRange(2020) },

            // === NAKED ===
            { name: 'Demon 125', cc: 125, type: 'naked', years: yearRange(2016) },
            { name: 'Demon 150GN', cc: 150, type: 'naked', years: yearRange(2018) },
            { name: 'Demon 150GR', cc: 150, type: 'naked', years: yearRange(2017) },
            { name: 'Demon X 125', cc: 125, type: 'naked', years: yearRange(2020) },
            { name: 'MAD 300', cc: 300, type: 'naked', years: yearRange(2020) },

            // === SPORT ===
            { name: 'Raptor 180', cc: 180, type: 'sport', years: yearRange(2019) },
            { name: 'Drone 150', cc: 150, type: 'sport', years: yearRange(2020) },

            // === ADVENTURE ===
            { name: 'Rock 110', cc: 110, type: 'offroad', years: yearRange(2020) },

            // === CRUISER ===
            { name: 'Popz 110', cc: 110, type: 'underbone', years: yearRange(2019) },
        ]
    },

    // ========================================
    // VESPA / PIAGGIO (Italy)
    // ========================================
    vespa: {
        name_th: 'เวสป้า',
        name_en: 'Vespa',
        country: 'Italy',
        models: [
            // === SCOOTER ===
            { name: 'Primavera 150', cc: 150, type: 'scooter', years: yearRange(2014), variants: ['Standard', 'S', 'RED', 'Racing Sixties'] },
            { name: 'Sprint 150', cc: 150, type: 'scooter', years: yearRange(2014), variants: ['Standard', 'S', 'Racing Sixties'] },
            { name: 'GTS 300', cc: 300, type: 'scooter', years: yearRange(2008), variants: ['Standard', 'Super', 'Super Tech', 'GTV', 'Sei Giorni'] },
            { name: 'GTS 150', cc: 150, type: 'scooter', years: yearRange(2017), variants: ['Standard', 'Super'] },
            { name: 'LX 125', cc: 125, type: 'scooter', years: yearRange(2005, 2014) },
            { name: 'S 125', cc: 125, type: 'scooter', years: yearRange(2010) },
            { name: '946', cc: 125, type: 'scooter', years: yearRange(2013), variants: ['Standard', 'RED', 'Emporio Armani', 'Christian Dior'] },
            { name: 'Elettrica', cc: 0, type: 'electric', years: yearRange(2019) },
        ]
    },

    // ========================================
    // BMW Motorrad (Germany)
    // ========================================
    bmw: {
        name_th: 'บีเอ็มดับเบิลยู',
        name_en: 'BMW Motorrad',
        country: 'Germany',
        models: [
            // === NAKED ===
            { name: 'G 310 R', cc: 313, type: 'naked', years: yearRange(2017) },
            { name: 'F 900 R', cc: 895, type: 'naked', years: yearRange(2020) },
            { name: 'S 1000 R', cc: 999, type: 'naked', years: yearRange(2014) },

            // === SPORT ===
            { name: 'S 1000 RR', cc: 999, type: 'sport', years: yearRange(2010), variants: ['Standard', 'M'] },
            { name: 'M 1000 RR', cc: 999, type: 'sport', years: yearRange(2021) },

            // === ADVENTURE ===
            { name: 'G 310 GS', cc: 313, type: 'adventure', years: yearRange(2017) },
            { name: 'F 750 GS', cc: 853, type: 'adventure', years: yearRange(2018) },
            { name: 'F 850 GS', cc: 853, type: 'adventure', years: yearRange(2018), variants: ['Standard', 'Adventure'] },
            { name: 'F 900 GS', cc: 895, type: 'adventure', years: yearRange(2024) },
            { name: 'R 1250 GS', cc: 1254, type: 'adventure', years: yearRange(2019), variants: ['Standard', 'Adventure'] },
            { name: 'R 1300 GS', cc: 1300, type: 'adventure', years: yearRange(2024) },

            // === TOURING ===
            { name: 'R 1250 RT', cc: 1254, type: 'touring', years: yearRange(2019) },
            { name: 'K 1600 GTL', cc: 1649, type: 'touring', years: yearRange(2011) },
            { name: 'K 1600 B', cc: 1649, type: 'touring', years: yearRange(2017) },
            { name: 'K 1600 Grand America', cc: 1649, type: 'touring', years: yearRange(2018) },

            // === CLASSIC ===
            { name: 'R nineT', cc: 1170, type: 'classic', years: yearRange(2014), variants: ['Standard', 'Pure', 'Scrambler', 'Urban G/S', 'Racer'] },
            { name: 'R 18', cc: 1802, type: 'cruiser', years: yearRange(2020), variants: ['Standard', 'Classic', 'Transcontinental', 'Roctane'] },

            // === SCOOTER ===
            { name: 'C 400 X', cc: 350, type: 'scooter', years: yearRange(2019) },
            { name: 'C 400 GT', cc: 350, type: 'scooter', years: yearRange(2019) },
            { name: 'C Evolution', cc: 0, type: 'electric', years: yearRange(2014, 2020) },
            { name: 'CE 04', cc: 0, type: 'electric', years: yearRange(2022) },
        ]
    },

    // ========================================
    // DUCATI (Italy)
    // ========================================
    ducati: {
        name_th: 'ดูคาติ',
        name_en: 'Ducati',
        country: 'Italy',
        models: [
            // === SPORT ===
            { name: 'Panigale V2', cc: 955, type: 'sport', years: yearRange(2020) },
            { name: 'Panigale V4', cc: 1103, type: 'sport', years: yearRange(2018), variants: ['Standard', 'S', 'R', 'SP', 'SP2'] },
            { name: 'SuperSport 950', cc: 937, type: 'sport', years: yearRange(2021), variants: ['Standard', 'S'] },

            // === NAKED ===
            { name: 'Monster', cc: 937, type: 'naked', years: yearRange(2021), variants: ['Standard', 'Plus'] },
            { name: 'Monster SP', cc: 937, type: 'naked', years: yearRange(2023) },
            { name: 'Streetfighter V2', cc: 955, type: 'naked', years: yearRange(2022) },
            { name: 'Streetfighter V4', cc: 1103, type: 'naked', years: yearRange(2020), variants: ['Standard', 'S', 'SP', 'Lamborghini'] },

            // === CLASSIC ===
            { name: 'Scrambler Icon', cc: 803, type: 'classic', years: yearRange(2015) },
            { name: 'Scrambler 1100', cc: 1079, type: 'classic', years: yearRange(2018), variants: ['Standard', 'Sport', 'Pro', 'Tribute Pro'] },
            { name: 'Scrambler Nightshift', cc: 803, type: 'classic', years: yearRange(2021) },

            // === ADVENTURE ===
            { name: 'Multistrada V2', cc: 937, type: 'adventure', years: yearRange(2022), variants: ['Standard', 'S'] },
            { name: 'Multistrada V4', cc: 1158, type: 'adventure', years: yearRange(2021), variants: ['Standard', 'S', 'Rally', 'Pikes Peak'] },
            { name: 'DesertX', cc: 937, type: 'adventure', years: yearRange(2022) },

            // === CRUISER ===
            { name: 'Diavel V4', cc: 1158, type: 'cruiser', years: yearRange(2023) },
            { name: 'XDiavel', cc: 1262, type: 'cruiser', years: yearRange(2016), variants: ['Standard', 'S', 'Dark', 'Nera'] },

            // === HYPERMOTARD ===
            { name: 'Hypermotard 950', cc: 937, type: 'naked', years: yearRange(2019), variants: ['Standard', 'SP', 'RVE'] },
        ]
    },

    // ========================================
    // HARLEY-DAVIDSON (USA)
    // ========================================
    harley: {
        name_th: 'ฮาร์เลย์-เดวิดสัน',
        name_en: 'Harley-Davidson',
        country: 'USA',
        models: [
            // === SPORTSTER ===
            { name: 'Sportster S', cc: 1252, type: 'cruiser', years: yearRange(2021) },
            { name: 'Nightster', cc: 975, type: 'cruiser', years: yearRange(2022) },
            { name: 'Iron 883', cc: 883, type: 'cruiser', years: yearRange(2009, 2022) },
            { name: 'Forty-Eight', cc: 1202, type: 'cruiser', years: yearRange(2010, 2022) },

            // === SOFTAIL ===
            { name: 'Street Bob', cc: 1868, type: 'cruiser', years: yearRange(2018) },
            { name: 'Fat Boy', cc: 1868, type: 'cruiser', years: yearRange(2018) },
            { name: 'Low Rider', cc: 1868, type: 'cruiser', years: yearRange(2018), variants: ['Standard', 'S', 'ST', 'El Diablo'] },
            { name: 'Fat Bob', cc: 1868, type: 'cruiser', years: yearRange(2018) },
            { name: 'Softail Standard', cc: 1868, type: 'cruiser', years: yearRange(2020) },
            { name: 'Breakout', cc: 1868, type: 'cruiser', years: yearRange(2018) },
            { name: 'Heritage Classic', cc: 1868, type: 'cruiser', years: yearRange(2018) },
            { name: 'Sport Glide', cc: 1868, type: 'cruiser', years: yearRange(2018) },

            // === TOURING ===
            { name: 'Road King', cc: 1868, type: 'touring', years: yearRange(2017), variants: ['Standard', 'Special'] },
            { name: 'Street Glide', cc: 1868, type: 'touring', years: yearRange(2017), variants: ['Standard', 'Special', 'ST'] },
            { name: 'Road Glide', cc: 1868, type: 'touring', years: yearRange(2017), variants: ['Standard', 'Special', 'Limited', 'ST'] },
            { name: 'Electra Glide', cc: 1868, type: 'touring', years: yearRange(2017), variants: ['Standard', 'Ultra Classic', 'Ultra Limited'] },
            { name: 'CVO Road Glide', cc: 1977, type: 'touring', years: yearRange(2018) },
            { name: 'CVO Street Glide', cc: 1977, type: 'touring', years: yearRange(2018) },

            // === ADVENTURE ===
            { name: 'Pan America 1250', cc: 1250, type: 'adventure', years: yearRange(2021), variants: ['Standard', 'Special'] },

            // === LIVEWIRE (Electric) ===
            { name: 'LiveWire ONE', cc: 0, type: 'electric', years: yearRange(2022) },
        ]
    },

    // ========================================
    // TRIUMPH (UK)
    // ========================================
    triumph: {
        name_th: 'ไทรอัมพ์',
        name_en: 'Triumph',
        country: 'UK',
        models: [
            // === CLASSIC ===
            { name: 'Bonneville T100', cc: 900, type: 'classic', years: yearRange(2016) },
            { name: 'Bonneville T120', cc: 1200, type: 'classic', years: yearRange(2016), variants: ['Standard', 'Black'] },
            { name: 'Bonneville Bobber', cc: 1200, type: 'classic', years: yearRange(2017) },
            { name: 'Bonneville Speedmaster', cc: 1200, type: 'classic', years: yearRange(2018) },
            { name: 'Speed Twin 1200', cc: 1200, type: 'classic', years: yearRange(2019) },
            { name: 'Thruxton RS', cc: 1200, type: 'classic', years: yearRange(2020) },
            { name: 'Scrambler 900', cc: 900, type: 'classic', years: yearRange(2019) },
            { name: 'Scrambler 1200', cc: 1200, type: 'classic', years: yearRange(2019), variants: ['XC', 'XE'] },

            // === NAKED ===
            { name: 'Trident 660', cc: 660, type: 'naked', years: yearRange(2021) },
            { name: 'Street Triple', cc: 765, type: 'naked', years: yearRange(2017), variants: ['R', 'RS', 'Moto2'] },
            { name: 'Speed Triple 1200', cc: 1160, type: 'naked', years: yearRange(2021), variants: ['RS', 'RR'] },

            // === ADVENTURE ===
            { name: 'Tiger Sport 660', cc: 660, type: 'adventure', years: yearRange(2022) },
            { name: 'Tiger 900', cc: 888, type: 'adventure', years: yearRange(2020), variants: ['GT', 'Rally', 'GT Pro', 'Rally Pro'] },
            { name: 'Tiger 1200', cc: 1160, type: 'adventure', years: yearRange(2022), variants: ['GT', 'Rally', 'GT Explorer', 'Rally Explorer'] },

            // === SPORT ===
            { name: 'Daytona 660', cc: 660, type: 'sport', years: yearRange(2024) },
            { name: 'Speed Triple 1200 RR', cc: 1160, type: 'sport', years: yearRange(2022) },

            // === CRUISER ===
            { name: 'Rocket 3', cc: 2458, type: 'cruiser', years: yearRange(2020), variants: ['R', 'GT'] },
        ]
    },

    // ========================================
    // KTM (Austria)
    // ========================================
    ktm: {
        name_th: 'เคทีเอ็ม',
        name_en: 'KTM',
        country: 'Austria',
        models: [
            // === NAKED ===
            { name: '125 Duke', cc: 125, type: 'naked', years: yearRange(2017) },
            { name: '200 Duke', cc: 200, type: 'naked', years: yearRange(2012) },
            { name: '250 Duke', cc: 250, type: 'naked', years: yearRange(2017) },
            { name: '390 Duke', cc: 390, type: 'naked', years: yearRange(2013) },
            { name: '690 Duke', cc: 690, type: 'naked', years: yearRange(2008, 2021) },
            { name: '790 Duke', cc: 799, type: 'naked', years: yearRange(2018, 2021) },
            { name: '890 Duke', cc: 889, type: 'naked', years: yearRange(2021), variants: ['Standard', 'R'] },
            { name: '1290 Super Duke R', cc: 1301, type: 'naked', years: yearRange(2014) },

            // === SPORT ===
            { name: 'RC 125', cc: 125, type: 'sport', years: yearRange(2014) },
            { name: 'RC 200', cc: 200, type: 'sport', years: yearRange(2014) },
            { name: 'RC 390', cc: 390, type: 'sport', years: yearRange(2014) },
            { name: 'RC 8C', cc: 889, type: 'sport', years: yearRange(2022) },

            // === ADVENTURE ===
            { name: '250 Adventure', cc: 250, type: 'adventure', years: yearRange(2020) },
            { name: '390 Adventure', cc: 390, type: 'adventure', years: yearRange(2020) },
            { name: '790 Adventure', cc: 799, type: 'adventure', years: yearRange(2019), variants: ['Standard', 'R'] },
            { name: '890 Adventure', cc: 889, type: 'adventure', years: yearRange(2021), variants: ['Standard', 'R'] },
            { name: '1290 Super Adventure', cc: 1301, type: 'adventure', years: yearRange(2015), variants: ['S', 'R'] },

            // === OFFROAD ===
            { name: '125 EXC', cc: 125, type: 'offroad', years: yearRange(2010) },
            { name: '250 EXC', cc: 250, type: 'offroad', years: yearRange(2010) },
            { name: '300 EXC', cc: 300, type: 'offroad', years: yearRange(2010) },
            { name: '350 EXC-F', cc: 350, type: 'offroad', years: yearRange(2012) },
            { name: '450 EXC-F', cc: 450, type: 'offroad', years: yearRange(2012) },
            { name: '500 EXC-F', cc: 500, type: 'offroad', years: yearRange(2012) },

            // === SUPERMOTO ===
            { name: '690 SMC R', cc: 690, type: 'naked', years: yearRange(2019) },
        ]
    },

    // ========================================
    // ROYAL ENFIELD (India)
    // ========================================
    royalenfield: {
        name_th: 'รอยัล เอนฟิลด์',
        name_en: 'Royal Enfield',
        country: 'India',
        models: [
            // === CLASSIC ===
            { name: 'Classic 350', cc: 350, type: 'classic', years: yearRange(2021) },
            { name: 'Classic 500', cc: 500, type: 'classic', years: yearRange(2009, 2020) },
            { name: 'Bullet 350', cc: 350, type: 'classic', years: yearRange(2020) },
            { name: 'Bullet 500', cc: 500, type: 'classic', years: yearRange(2008, 2020) },

            // === MODERN CLASSIC ===
            { name: 'Meteor 350', cc: 350, type: 'cruiser', years: yearRange(2020) },
            { name: 'Hunter 350', cc: 350, type: 'naked', years: yearRange(2022) },
            { name: 'Super Meteor 650', cc: 650, type: 'cruiser', years: yearRange(2023) },

            // === TWIN ===
            { name: 'Continental GT 650', cc: 650, type: 'classic', years: yearRange(2018) },
            { name: 'Interceptor 650', cc: 650, type: 'classic', years: yearRange(2018) },
            { name: 'INT 650', cc: 650, type: 'classic', years: yearRange(2023) },

            // === ADVENTURE ===
            { name: 'Himalayan', cc: 411, type: 'adventure', years: yearRange(2016) },
            { name: 'Himalayan 450', cc: 450, type: 'adventure', years: yearRange(2024) },
            { name: 'Scram 411', cc: 411, type: 'adventure', years: yearRange(2022) },
        ]
    },

    // ========================================
    // BENELLI (Italy/China)
    // ========================================
    benelli: {
        name_th: 'เบเนลลี',
        name_en: 'Benelli',
        country: 'Italy',
        models: [
            // === NAKED ===
            { name: 'TNT 135', cc: 135, type: 'naked', years: yearRange(2017) },
            { name: 'TNT 150', cc: 150, type: 'naked', years: yearRange(2018) },
            { name: 'TNT 300', cc: 300, type: 'naked', years: yearRange(2015) },
            { name: 'TNT 600', cc: 600, type: 'naked', years: yearRange(2014) },
            { name: 'Leoncino 250', cc: 250, type: 'classic', years: yearRange(2018) },
            { name: 'Leoncino 500', cc: 500, type: 'classic', years: yearRange(2018), variants: ['Standard', 'Trail'] },
            { name: '502C', cc: 500, type: 'cruiser', years: yearRange(2019) },
            { name: '752S', cc: 750, type: 'naked', years: yearRange(2019) },

            // === ADVENTURE ===
            { name: 'TRK 251', cc: 250, type: 'adventure', years: yearRange(2020) },
            { name: 'TRK 502', cc: 500, type: 'adventure', years: yearRange(2017), variants: ['Standard', 'X'] },
            { name: 'TRK 702', cc: 700, type: 'adventure', years: yearRange(2023) },
        ]
    },

    // ========================================
    // APRILIA (Italy)
    // ========================================
    aprilia: {
        name_th: 'อาพริเลีย',
        name_en: 'Aprilia',
        country: 'Italy',
        models: [
            // === SPORT ===
            { name: 'RS 125', cc: 125, type: 'sport', years: yearRange(2017) },
            { name: 'RS 660', cc: 660, type: 'sport', years: yearRange(2021) },
            { name: 'RSV4', cc: 1099, type: 'sport', years: yearRange(2021), variants: ['Standard', 'Factory'] },

            // === NAKED ===
            { name: 'Tuono 125', cc: 125, type: 'naked', years: yearRange(2017) },
            { name: 'Tuono 660', cc: 660, type: 'naked', years: yearRange(2021) },
            { name: 'Tuono V4', cc: 1099, type: 'naked', years: yearRange(2021), variants: ['Standard', 'Factory'] },
            { name: 'Shiver 900', cc: 900, type: 'naked', years: yearRange(2017) },

            // === ADVENTURE ===
            { name: 'Tuareg 660', cc: 660, type: 'adventure', years: yearRange(2022) },

            // === SCOOTER ===
            { name: 'SR GT 125', cc: 125, type: 'scooter', years: yearRange(2022) },
            { name: 'SR GT 200', cc: 200, type: 'scooter', years: yearRange(2022) },
        ]
    },

    // ========================================
    // SYM (Taiwan)
    // ========================================
    sym: {
        name_th: 'ซิม',
        name_en: 'SYM',
        country: 'Taiwan',
        models: [
            // === SCOOTER ===
            { name: 'Symphony ST 125', cc: 125, type: 'scooter', years: yearRange(2018) },
            { name: 'Symphony ST 200', cc: 200, type: 'scooter', years: yearRange(2018) },
            { name: 'Jet 14 125', cc: 125, type: 'scooter', years: yearRange(2019) },
            { name: 'Jet 14 200', cc: 200, type: 'scooter', years: yearRange(2019) },
            { name: 'JOYMAX Z 125', cc: 125, type: 'scooter', years: yearRange(2020) },
            { name: 'JOYMAX Z 300', cc: 300, type: 'maxiscooter', years: yearRange(2020) },
            { name: 'MAXSYM 400', cc: 400, type: 'maxiscooter', years: yearRange(2021) },
            { name: 'MAXSYM TL 500', cc: 500, type: 'maxiscooter', years: yearRange(2020) },

            // === NAKED/CRUISER ===
            { name: 'Wolf 125', cc: 125, type: 'classic', years: yearRange(2017) },
            { name: 'Wolf CR 300', cc: 300, type: 'classic', years: yearRange(2020) },
            { name: 'Cruisym 300', cc: 300, type: 'scooter', years: yearRange(2019) },
        ]
    },

    // ========================================
    // INDIAN (USA)
    // ========================================
    indian: {
        name_th: 'อินเดียน',
        name_en: 'Indian Motorcycle',
        country: 'USA',
        models: [
            // === CRUISER ===
            { name: 'Scout', cc: 1133, type: 'cruiser', years: yearRange(2015) },
            { name: 'Scout Bobber', cc: 1133, type: 'cruiser', years: yearRange(2018) },
            { name: 'Scout Bobber Twenty', cc: 1133, type: 'cruiser', years: yearRange(2020) },
            { name: 'Scout Rogue', cc: 1133, type: 'cruiser', years: yearRange(2022) },
            { name: 'Chief', cc: 1890, type: 'cruiser', years: yearRange(2022), variants: ['Dark Horse', 'Bobber Dark Horse'] },
            { name: 'Super Chief', cc: 1890, type: 'cruiser', years: yearRange(2021), variants: ['Standard', 'Limited'] },

            // === TOURING ===
            { name: 'Chieftain', cc: 1890, type: 'touring', years: yearRange(2014), variants: ['Dark Horse', 'Limited'] },
            { name: 'Springfield', cc: 1890, type: 'touring', years: yearRange(2016), variants: ['Standard', 'Dark Horse'] },
            { name: 'Roadmaster', cc: 1890, type: 'touring', years: yearRange(2015), variants: ['Standard', 'Dark Horse', 'Limited'] },
            { name: 'Pursuit', cc: 1890, type: 'touring', years: yearRange(2022), variants: ['Standard', 'Dark Horse', 'Limited'] },
            { name: 'Challenger', cc: 1768, type: 'touring', years: yearRange(2020), variants: ['Standard', 'Dark Horse', 'Limited'] },

            // === SPORT ===
            { name: 'FTR 1200', cc: 1203, type: 'naked', years: yearRange(2019), variants: ['Standard', 'S', 'R Carbon', 'Sport', 'Rally'] },
        ]
    },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all brand names
 */
export function getAllBrands(): { key: string; name_th: string; name_en: string }[] {
    return Object.entries(MOTORCYCLE_DATABASE).map(([key, brand]) => ({
        key,
        name_th: brand.name_th,
        name_en: brand.name_en
    }))
}

/**
 * Get models by brand
 */
export function getModelsByBrand(brandKey: string): MotorcycleModel[] {
    return MOTORCYCLE_DATABASE[brandKey]?.models || []
}

/**
 * Get model details
 */
export function getModelDetails(brandKey: string, modelName: string): MotorcycleModel | undefined {
    return MOTORCYCLE_DATABASE[brandKey]?.models.find(m => m.name === modelName)
}

/**
 * Search models across all brands
 */
export function searchModels(query: string): { brand: string; model: MotorcycleModel }[] {
    const results: { brand: string; model: MotorcycleModel }[] = []
    const queryLower = query.toLowerCase()

    Object.entries(MOTORCYCLE_DATABASE).forEach(([brandKey, brand]) => {
        brand.models.forEach(model => {
            if (
                model.name.toLowerCase().includes(queryLower) ||
                brand.name_th.includes(query) ||
                brand.name_en.toLowerCase().includes(queryLower)
            ) {
                results.push({ brand: brandKey, model })
            }
        })
    })

    return results
}

/**
 * Get available years for a model
 */
export function getYearsForModel(brandKey: string, modelName: string): number[] {
    const model = getModelDetails(brandKey, modelName)
    return model?.years || []
}

/**
 * Get models by type
 */
export function getModelsByType(type: MotorcycleType): { brand: string; model: MotorcycleModel }[] {
    const results: { brand: string; model: MotorcycleModel }[] = []

    Object.entries(MOTORCYCLE_DATABASE).forEach(([brandKey, brand]) => {
        brand.models.forEach(model => {
            if (model.type === type) {
                results.push({ brand: brandKey, model })
            }
        })
    })

    return results
}

/**
 * Get models by CC range
 */
export function getModelsByCCRange(minCC: number, maxCC: number): { brand: string; model: MotorcycleModel }[] {
    const results: { brand: string; model: MotorcycleModel }[] = []

    Object.entries(MOTORCYCLE_DATABASE).forEach(([brandKey, brand]) => {
        brand.models.forEach(model => {
            if (model.cc >= minCC && model.cc <= maxCC) {
                results.push({ brand: brandKey, model })
            }
        })
    })

    return results
}

// ============================================
// STATISTICS
// ============================================
export function getDatabaseStats(): {
    totalBrands: number
    totalModels: number
    brandStats: { brand: string; modelCount: number }[]
} {
    const brandStats = Object.entries(MOTORCYCLE_DATABASE).map(([key, brand]) => ({
        brand: brand.name_en,
        modelCount: brand.models.length
    }))

    return {
        totalBrands: Object.keys(MOTORCYCLE_DATABASE).length,
        totalModels: brandStats.reduce((sum, b) => sum + b.modelCount, 0),
        brandStats
    }
}
