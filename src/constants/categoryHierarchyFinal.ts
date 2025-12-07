/**
 * Extended Category Hierarchy - Part 3
 * Categories 11-20+: Sports, Automotive, Pets, Collectibles, Amulets, Books, Music, Tickets, Real Estate, Others
 * Plus trending categories: Crypto, Sustainability, WFH, Vintage
 */

import { MainCategory, COMMON_ATTRIBUTES } from './categoryHierarchy'

export const FINAL_CATEGORIES: MainCategory[] = [
    {
        id: 11,
        name_th: 'กีฬาและกิจกรรมกลางแจ้ง',
        name_en: 'Sports & Outdoors',
        slug: 'sports',
        icon: '⚽',
        order_index: 11,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.BRAND],
        subCategories: [
            {
                id: 'sportswear',
                name_th: 'เสื้อผ้าและรองเท้ากีฬา',
                name_en: 'Sportswear & Footwear',
                slug: 'sportswear',
                attributes: [
                    { name: 'size', type: 'text', required: true, aiSuggested: true },
                    { name: 'gender', type: 'select', options: ['Men', 'Women', 'Unisex'], required: false, aiSuggested: true }
                ]
            },
            {
                id: 'fitness-equipment',
                name_th: 'อุปกรณ์ฟิตเนส',
                name_en: 'Fitness Equipment',
                slug: 'fitness-equipment',
                subCategories: [
                    { id: 'dumbbells', name_th: 'ดัมเบล', name_en: 'Dumbbells', slug: 'dumbbells' },
                    { id: 'yoga-mats', name_th: 'เสื่อโยคะ', name_en: 'Yoga Mats', slug: 'yoga-mats' },
                    { id: 'fitness-trackers', name_th: 'นาฬิกาออกกำลังกาย', name_en: 'Fitness Trackers', slug: 'fitness-trackers' }
                ]
            },
            {
                id: 'ball-sports',
                name_th: 'กีฬาลูกบอล',
                name_en: 'Ball Sports',
                slug: 'ball-sports',
                subCategories: [
                    { id: 'football', name_th: 'ฟุตบอล', name_en: 'Football', slug: 'football' },
                    { id: 'basketball', name_th: 'บาสเก็ตบอล', name_en: 'Basketball', slug: 'basketball' },
                    { id: 'tennis', name_th: 'เทนนิส', name_en: 'Tennis', slug: 'tennis' },
                    { id: 'badminton', name_th: 'แบดมินตัน', name_en: 'Badminton', slug: 'badminton' },
                    { id: 'golf', name_th: 'กอล์ฟ', name_en: 'Golf', slug: 'golf' }
                ]
            },
            {
                id: 'cycling',
                name_th: 'จักรยาน',
                name_en: 'Cycling',
                slug: 'cycling',
                attributes: [
                    { name: 'bike_type', type: 'select', options: ['Mountain Bike', 'Road Bike', 'E-Bike', 'Folding Bike', 'BMX'], required: true, aiSuggested: true },
                    { name: 'frame_size', type: 'text', required: false, aiSuggested: true }
                ]
            },
            {
                id: 'outdoor-activities',
                name_th: 'กิจกรรมกลางแจ้ง',
                name_en: 'Outdoor Activities',
                slug: 'outdoor-activities',
                subCategories: [
                    { id: 'camping', name_th: 'แคมป์ปิ้ง', name_en: 'Camping', slug: 'camping' },
                    { id: 'hiking', name_th: 'เดินป่า', name_en: 'Hiking', slug: 'hiking' },
                    { id: 'fishing', name_th: 'ตกปลา', name_en: 'Fishing', slug: 'fishing' }
                ]
            }
        ]
    },
    {
        id: 12,
        name_th: 'ยานยนต์และอะไหล่',
        name_en: 'Automotive',
        slug: 'automotive',
        icon: '🚗',
        order_index: 12,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'cars',
                name_th: 'รถยนต์',
                name_en: 'Cars',
                slug: 'cars',
                attributes: [
                    { name: 'brand', type: 'text', required: true, aiSuggested: true },
                    { name: 'model', type: 'text', required: true, aiSuggested: true },
                    { name: 'year', type: 'number', required: true, aiSuggested: true },
                    { name: 'mileage', type: 'number', required: true, aiSuggested: false },
                    { name: 'fuel_type', type: 'select', options: ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'LPG'], required: true, aiSuggested: true },
                    { name: 'transmission', type: 'select', options: ['Manual', 'Automatic', 'CVT'], required: true, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'sedans', name_th: 'รถเก๋ง', name_en: 'Sedans', slug: 'sedans' },
                    { id: 'suvs', name_th: 'รถ SUV', name_en: 'SUVs', slug: 'suvs' },
                    { id: 'pickup-trucks', name_th: 'รถกระบะ', name_en: 'Pickup Trucks', slug: 'pickup-trucks' },
                    { id: 'electric-vehicles', name_th: 'รถไฟฟ้า', name_en: 'Electric Vehicles', slug: 'electric-vehicles' }
                ]
            },
            {
                id: 'motorcycles',
                name_th: 'รถจักรยานยนต์',
                name_en: 'Motorcycles',
                slug: 'motorcycles',
                attributes: [
                    { name: 'brand', type: 'text', required: true, aiSuggested: true },
                    { name: 'engine_size', type: 'text', required: true, aiSuggested: true }
                ]
            },
            {
                id: 'car-parts',
                name_th: 'อะไหล่รถยนต์',
                name_en: 'Car Parts',
                slug: 'car-parts'
            },
            {
                id: 'car-accessories',
                name_th: 'อุปกรณ์ตกแต่งรถ',
                name_en: 'Car Accessories',
                slug: 'car-accessories',
                subCategories: [
                    { id: 'dash-cams', name_th: 'กล้องติดรถยนต์', name_en: 'Dash Cams', slug: 'dash-cams' },
                    { id: 'car-audio', name_th: 'เครื่องเสียงรถยนต์', name_en: 'Car Audio', slug: 'car-audio' },
                    { id: 'gps-navigation', name_th: 'GPS Navigation', name_en: 'GPS Navigation', slug: 'gps-navigation' }
                ]
            }
        ]
    },
    {
        id: 13,
        name_th: 'สัตว์เลี้ยง',
        name_en: 'Pet Supplies',
        slug: 'pets',
        icon: '🐱',
        order_index: 13,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'pet-food',
                name_th: 'อาหารสัตว์',
                name_en: 'Pet Food',
                slug: 'pet-food',
                attributes: [
                    { name: 'pet_type', type: 'select', options: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'], required: true, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'dog-food', name_th: 'อาหารสุนัข', name_en: 'Dog Food', slug: 'dog-food' },
                    { id: 'cat-food', name_th: 'อาหารแมว', name_en: 'Cat Food', slug: 'cat-food' }
                ]
            },
            {
                id: 'pet-accessories',
                name_th: 'อุปกรณ์สัตว์เลี้ยง',
                name_en: 'Pet Accessories',
                slug: 'pet-accessories',
                subCategories: [
                    { id: 'collars-leashes', name_th: 'ปลอกคอและสายจูง', name_en: 'Collars & Leashes', slug: 'collars-leashes' },
                    { id: 'pet-beds', name_th: 'ที่นอนสัตว์เลี้ยง', name_en: 'Pet Beds', slug: 'pet-beds' },
                    { id: 'cat-litter', name_th: 'ทรายแมว', name_en: 'Cat Litter', slug: 'cat-litter' }
                ]
            },
            {
                id: 'aquariums',
                name_th: 'ตู้ปลา',
                name_en: 'Aquariums',
                slug: 'aquariums'
            }
        ]
    },
    {
        id: 14,
        name_th: 'ของสะสมและงานศิลปะ',
        name_en: 'Collectibles & Art',
        slug: 'collectibles',
        icon: '🎨',
        order_index: 14,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'collectibles',
                name_th: 'ของสะสม',
                name_en: 'Collectibles',
                slug: 'collectibles-items',
                subCategories: [
                    { id: 'stamps', name_th: 'แสตมป์', name_en: 'Stamps', slug: 'stamps' },
                    { id: 'coins', name_th: 'เหรียญ', name_en: 'Coins', slug: 'coins' },
                    { id: 'banknotes', name_th: 'ธนบัตร', name_en: 'Banknotes', slug: 'banknotes' },
                    { id: 'vintage-items', name_th: 'ของเก่า/วินเทจ', name_en: 'Vintage Items', slug: 'vintage-items' }
                ]
            },
            {
                id: 'figures-models',
                name_th: 'ฟิกเกอร์และโมเดล',
                name_en: 'Figures & Models',
                slug: 'figures-models',
                subCategories: [
                    { id: 'funko-pop-collectibles', name_th: 'Funko Pop', name_en: 'Funko Pop', slug: 'funko-pop-collectibles' },
                    { id: 'nendoroid', name_th: 'Nendoroid', name_en: 'Nendoroid', slug: 'nendoroid' },
                    { id: 'hot-toys', name_th: 'Hot Toys', name_en: 'Hot Toys', slug: 'hot-toys' }
                ]
            },
            {
                id: 'art',
                name_th: 'งานศิลปะ',
                name_en: 'Art',
                slug: 'art',
                subCategories: [
                    { id: 'paintings', name_th: 'ภาพวาด', name_en: 'Paintings', slug: 'paintings' },
                    { id: 'prints', name_th: 'ภาพพิมพ์', name_en: 'Prints', slug: 'prints' },
                    { id: 'sculptures', name_th: 'ประติมากรรม', name_en: 'Sculptures', slug: 'sculptures' },
                    { id: 'nft-art', name_th: 'NFT Art', name_en: 'NFT Art', slug: 'nft-art' }
                ]
            },
            {
                id: 'trading-cards',
                name_th: 'การ์ดสะสม',
                name_en: 'Trading Cards',
                slug: 'trading-cards',
                subCategories: [
                    { id: 'pokemon-cards', name_th: 'Pokémon Cards', name_en: 'Pokémon Cards', slug: 'pokemon-cards' },
                    { id: 'mtg', name_th: 'Magic: The Gathering', name_en: 'Magic: The Gathering', slug: 'mtg' },
                    { id: 'yugioh', name_th: 'Yu-Gi-Oh!', name_en: 'Yu-Gi-Oh!', slug: 'yugioh' }
                ]
            }
        ]
    },
    {
        id: 15,
        name_th: 'พระเครื่องและวัตถุมงคล',
        name_en: 'Amulets & Sacred Items',
        slug: 'amulets',
        icon: '🙏',
        order_index: 15,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'buddha-amulets',
                name_th: 'พระเครื่อง',
                name_en: 'Buddha Amulets',
                slug: 'buddha-amulets',
                attributes: [
                    { name: 'temple', type: 'text', required: false, aiSuggested: false },
                    { name: 'year', type: 'text', required: false, aiSuggested: false }
                ]
            },
            {
                id: 'monk-coins',
                name_th: 'เหรียญพระ',
                name_en: 'Monk Coins',
                slug: 'monk-coins'
            },
            {
                id: 'sacred-objects',
                name_th: 'วัตถุมงคล',
                name_en: 'Sacred Objects',
                slug: 'sacred-objects',
                subCategories: [
                    { id: 'takrut', name_th: 'ตะกรุด', name_en: 'Takrut', slug: 'takrut' },
                    { id: 'yantra', name_th: 'ผ้ายันต์', name_en: 'Yantra Cloth', slug: 'yantra' },
                    { id: 'buddha-statues', name_th: 'รูปหล่อ', name_en: 'Buddha Statues', slug: 'buddha-statues' }
                ]
            }
        ]
    },
    {
        id: 16,
        name_th: 'หนังสือและความรู้',
        name_en: 'Books & Stationery',
        slug: 'books',
        icon: '📚',
        order_index: 16,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'books-items',
                name_th: 'หนังสือ',
                name_en: 'Books',
                slug: 'books-items',
                attributes: [
                    { name: 'genre', type: 'select', options: ['Fiction', 'Non-Fiction', 'Business', 'Self-Help', 'History', 'Children', 'Comics/Manga', 'Other'], required: true, aiSuggested: true },
                    { name: 'language', type: 'select', options: ['Thai', 'English', 'Other'], required: true, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'fiction', name_th: 'นิยาย', name_en: 'Fiction', slug: 'fiction' },
                    { id: 'business-books', name_th: 'หนังสือธุรกิจ', name_en: 'Business Books', slug: 'business-books' },
                    { id: 'self-help', name_th: 'พัฒนาตนเอง', name_en: 'Self-Help', slug: 'self-help' },
                    { id: 'manga', name_th: 'การ์ตูน/มังงะ', name_en: 'Comics/Manga', slug: 'manga' }
                ]
            },
            {
                id: 'stationery',
                name_th: 'เครื่องเขียน',
                name_en: 'Stationery',
                slug: 'stationery'
            },
            {
                id: 'office-supplies',
                name_th: 'อุปกรณ์สำนักงาน',
                name_en: 'Office Supplies',
                slug: 'office-supplies'
            }
        ]
    },
    {
        id: 17,
        name_th: 'ดนตรีและเครื่องดนตรี',
        name_en: 'Music & Instruments',
        slug: 'music',
        icon: '🎸',
        order_index: 17,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.BRAND],
        subCategories: [
            {
                id: 'instruments',
                name_th: 'เครื่องดนตรี',
                name_en: 'Musical Instruments',
                slug: 'instruments',
                subCategories: [
                    { id: 'guitars', name_th: 'กีตาร์', name_en: 'Guitars', slug: 'guitars' },
                    { id: 'pianos-keyboards', name_th: 'เปียโน/คีย์บอร์ด', name_en: 'Pianos/Keyboards', slug: 'pianos-keyboards' },
                    { id: 'drums', name_th: 'กลอง', name_en: 'Drums', slug: 'drums' },
                    { id: 'ukuleles', name_th: 'ยูคูเลเล่', name_en: 'Ukuleles', slug: 'ukuleles' }
                ]
            },
            {
                id: 'music-accessories',
                name_th: 'อุปกรณ์ดนตรี',
                name_en: 'Music Accessories',
                slug: 'music-accessories',
                subCategories: [
                    { id: 'amplifiers', name_th: 'แอมป์', name_en: 'Amplifiers', slug: 'amplifiers' },
                    { id: 'effect-pedals', name_th: 'เอฟเฟกต์', name_en: 'Effect Pedals', slug: 'effect-pedals' }
                ]
            },
            {
                id: 'recording-equipment',
                name_th: 'อุปกรณ์บันทึกเสียง',
                name_en: 'Recording Equipment',
                slug: 'recording-equipment',
                subCategories: [
                    { id: 'microphones-recording', name_th: 'ไมโครโฟน', name_en: 'Microphones', slug: 'microphones-recording' },
                    { id: 'audio-interface', name_th: 'Audio Interface', name_en: 'Audio Interface', slug: 'audio-interface' }
                ]
            },
            {
                id: 'vinyl-cd',
                name_th: 'Vinyl และ CD',
                name_en: 'Vinyl & CD',
                slug: 'vinyl-cd'
            }
        ]
    },
    {
        id: 18,
        name_th: 'ตั๋วและบัตรกำนัล',
        name_en: 'Tickets & Vouchers',
        slug: 'tickets',
        icon: '🎫',
        order_index: 18,
        subCategories: [
            {
                id: 'concert-tickets',
                name_th: 'ตั๋วคอนเสิร์ต',
                name_en: 'Concert Tickets',
                slug: 'concert-tickets',
                attributes: [
                    { name: 'event_date', type: 'text', required: true, aiSuggested: false },
                    { name: 'venue', type: 'text', required: true, aiSuggested: false }
                ]
            },
            {
                id: 'sports-tickets',
                name_th: 'ตั๋วกีฬา',
                name_en: 'Sports Tickets',
                slug: 'sports-tickets'
            },
            {
                id: 'movie-theater-tickets',
                name_th: 'ตั๋วภาพยนตร์และละคร',
                name_en: 'Movie & Theater Tickets',
                slug: 'movie-theater-tickets'
            },
            {
                id: 'vouchers',
                name_th: 'บัตรกำนัล',
                name_en: 'Vouchers & Gift Cards',
                slug: 'vouchers',
                attributes: [
                    { name: 'value', type: 'number', required: true, aiSuggested: false },
                    { name: 'expiry_date', type: 'text', required: false, aiSuggested: false }
                ]
            }
        ]
    },
    {
        id: 19,
        name_th: 'อสังหาริมทรัพย์',
        name_en: 'Real Estate',
        slug: 'real-estate',
        icon: '🏢',
        order_index: 19,
        subCategories: [
            {
                id: 'houses-for-sale',
                name_th: 'ขายบ้าน',
                name_en: 'Houses for Sale',
                slug: 'houses-for-sale',
                attributes: [
                    { name: 'bedrooms', type: 'number', required: true, aiSuggested: false },
                    { name: 'bathrooms', type: 'number', required: true, aiSuggested: false },
                    { name: 'area_sqm', type: 'number', required: true, aiSuggested: false }
                ]
            },
            {
                id: 'condos-for-sale',
                name_th: 'ขายคอนโด',
                name_en: 'Condos for Sale',
                slug: 'condos-for-sale',
                attributes: [
                    { name: 'bedrooms', type: 'number', required: true, aiSuggested: false },
                    { name: 'bathrooms', type: 'number', required: true, aiSuggested: false },
                    { name: 'area_sqm', type: 'number', required: true, aiSuggested: false },
                    { name: 'floor', type: 'number', required: false, aiSuggested: false }
                ]
            },
            {
                id: 'for-rent',
                name_th: 'ให้เช่า',
                name_en: 'For Rent',
                slug: 'for-rent',
                attributes: [
                    { name: 'monthly_rent', type: 'number', required: true, aiSuggested: false }
                ]
            },
            {
                id: 'land',
                name_th: 'ที่ดิน',
                name_en: 'Land',
                slug: 'land',
                attributes: [
                    { name: 'area_rai', type: 'number', required: true, aiSuggested: false }
                ]
            }
        ]
    },
    {
        id: 20,
        name_th: 'อื่นๆ',
        name_en: 'Others',
        slug: 'others',
        icon: '📦',
        order_index: 20,
        subCategories: [
            {
                id: 'general-items',
                name_th: 'ของใช้ทั่วไป',
                name_en: 'General Items',
                slug: 'general-items'
            },
            {
                id: 'services',
                name_th: 'บริการ',
                name_en: 'Services',
                slug: 'services'
            }
        ]
    },
    // NEW TRENDING CATEGORIES
    {
        id: 21,
        name_th: 'Cryptocurrency & NFT',
        name_en: 'Cryptocurrency & NFT',
        slug: 'crypto-nft',
        icon: '₿',
        order_index: 21,
        description_th: 'อุปกรณ์ขุด Crypto, Hardware Wallet, NFT',
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'mining-equipment',
                name_th: 'อุปกรณ์ขุด Crypto',
                name_en: 'Mining Equipment',
                slug: 'mining-equipment',
                attributes: [
                    { name: 'hash_rate', type: 'text', required: false, aiSuggested: false }
                ]
            },
            {
                id: 'hardware-wallets',
                name_th: 'Hardware Wallet',
                name_en: 'Hardware Wallets',
                slug: 'hardware-wallets',
                attributes: [
                    { name: 'brand', type: 'select', options: ['Ledger', 'Trezor', 'Other'], required: true, aiSuggested: true }
                ]
            },
            {
                id: 'nft-collectibles',
                name_th: 'NFT Collectibles',
                name_en: 'NFT Collectibles',
                slug: 'nft-collectibles'
            }
        ]
    },
    {
        id: 22,
        name_th: 'Sustainability & Eco-Friendly',
        name_en: 'Sustainability & Eco-Friendly',
        slug: 'sustainability',
        icon: '♻️',
        order_index: 22,
        description_th: 'สินค้าเป็นมิตรกับสิ่งแวดล้อม รีไซเคิล',
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'recycled-products',
                name_th: 'ผลิตภัณฑ์รีไซเคิล',
                name_en: 'Recycled Products',
                slug: 'recycled-products'
            },
            {
                id: 'eco-friendly',
                name_th: 'สินค้าเป็นมิตรกับสิ่งแวดล้อม',
                name_en: 'Eco-Friendly Products',
                slug: 'eco-friendly'
            },
            {
                id: 'solar-panels',
                name_th: 'แผงโซล่าเซลล์',
                name_en: 'Solar Panels',
                slug: 'solar-panels'
            },
            {
                id: 'reusable-products',
                name_th: 'สินค้าใช้ซ้ำได้',
                name_en: 'Reusable Products',
                slug: 'reusable-products'
            }
        ]
    },
    {
        id: 23,
        name_th: 'Work From Home',
        name_en: 'Work From Home',
        slug: 'work-from-home',
        icon: '🏡',
        order_index: 23,
        description_th: 'อุปกรณ์ทำงานที่บ้าน',
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.BRAND],
        subCategories: [
            {
                id: 'standing-desks',
                name_th: 'โต๊ะทำงาน Standing Desk',
                name_en: 'Standing Desks',
                slug: 'standing-desks'
            },
            {
                id: 'ergonomic-chairs',
                name_th: 'เก้าอี้ Ergonomic',
                name_en: 'Ergonomic Chairs',
                slug: 'ergonomic-chairs'
            },
            {
                id: 'video-conference',
                name_th: 'อุปกรณ์ Video Conference',
                name_en: 'Video Conference Equipment',
                slug: 'video-conference'
            },
            {
                id: 'lighting-equipment',
                name_th: 'อุปกรณ์แสงสว่าง',
                name_en: 'Lighting Equipment',
                slug: 'lighting-equipment'
            }
        ]
    },
    {
        id: 24,
        name_th: 'Vintage & Retro',
        name_en: 'Vintage & Retro',
        slug: 'vintage-retro',
        icon: '📻',
        order_index: 24,
        description_th: 'สินค้าวินเทจและย้อนยุค',
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'vintage-clothing',
                name_th: 'เสื้อผ้าวินเทจ',
                name_en: 'Vintage Clothing',
                slug: 'vintage-clothing'
            },
            {
                id: 'antiques',
                name_th: 'เครื่องใช้โบราณ',
                name_en: 'Antiques',
                slug: 'antiques'
            },
            {
                id: 'film-cameras-vintage',
                name_th: 'กล้องฟิล์ม',
                name_en: 'Film Cameras',
                slug: 'film-cameras-vintage'
            },
            {
                id: 'record-players',
                name_th: 'เครื่องเล่นแผ่นเสียง',
                name_en: 'Record Players',
                slug: 'record-players'
            }
        ]
    }
]
