/**
 * Extended Category Hierarchy - Part 2
 * Categories 3-10: Cameras, Fashion, Watches, Health, Mom & Baby, Home, Appliances, Toys
 */

import { MainCategory, COMMON_ATTRIBUTES } from './categoryHierarchy'

export const EXTENDED_CATEGORIES: MainCategory[] = [
    {
        id: 3,
        name_th: 'กล้องและอุปกรณ์ถ่ายภาพ',
        name_en: 'Cameras & Photography',
        slug: 'cameras',
        icon: '📷',
        order_index: 3,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.WARRANTY, COMMON_ATTRIBUTES.BRAND],
        subCategories: [
            {
                id: 'digital-cameras',
                name_th: 'กล้องดิจิทัล',
                name_en: 'Digital Cameras',
                slug: 'digital-cameras',
                attributes: [
                    { name: 'brand', type: 'select', options: ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Olympus', 'Leica', 'Hasselblad', 'Other'], required: true, aiSuggested: true },
                    { name: 'camera_type', type: 'select', options: ['Mirrorless', 'DSLR', 'Compact', 'Medium Format', 'Film'], required: true, aiSuggested: true },
                    { name: 'megapixels', type: 'text', required: false, aiSuggested: true },
                    { name: 'shutter_count', type: 'number', required: false, aiSuggested: false }
                ],
                subCategories: [
                    { id: 'mirrorless', name_th: 'กล้อง Mirrorless', name_en: 'Mirrorless', slug: 'mirrorless' },
                    { id: 'dslr', name_th: 'กล้อง DSLR', name_en: 'DSLR', slug: 'dslr' },
                    { id: 'compact', name_th: 'กล้อง Compact', name_en: 'Compact', slug: 'compact' },
                    { id: 'film-cameras', name_th: 'กล้องฟิล์ม', name_en: 'Film Cameras', slug: 'film-cameras' }
                ]
            },
            {
                id: 'lenses',
                name_th: 'เลนส์',
                name_en: 'Lenses',
                slug: 'lenses',
                attributes: [
                    { name: 'mount', type: 'select', options: ['Canon EF', 'Canon RF', 'Nikon F', 'Nikon Z', 'Sony E', 'Fujifilm X', 'Micro Four Thirds', 'Other'], required: true, aiSuggested: true },
                    { name: 'focal_length', type: 'text', required: true, aiSuggested: true },
                    { name: 'aperture', type: 'text', required: true, aiSuggested: true }
                ]
            },
            {
                id: 'camera-accessories',
                name_th: 'อุปกรณ์เสริม',
                name_en: 'Accessories',
                slug: 'camera-accessories',
                subCategories: [
                    { id: 'tripods', name_th: 'ขาตั้งกล้อง', name_en: 'Tripods', slug: 'tripods' },
                    { id: 'gimbals', name_th: 'Gimbal', name_en: 'Gimbals', slug: 'gimbals' },
                    { id: 'camera-bags', name_th: 'กระเป๋ากล้อง', name_en: 'Camera Bags', slug: 'camera-bags' },
                    { id: 'filters', name_th: 'ฟิลเตอร์', name_en: 'Filters', slug: 'filters' }
                ]
            },
            {
                id: 'drones',
                name_th: 'โดรน',
                name_en: 'Drones',
                slug: 'drones',
                attributes: [
                    { name: 'brand', type: 'select', options: ['DJI', 'Autel', 'Parrot', 'Skydio', 'Other'], required: true, aiSuggested: true },
                    { name: 'camera_resolution', type: 'select', options: ['1080p', '4K', '5.4K', '6K', '8K'], required: false, aiSuggested: true }
                ]
            }
        ]
    },
    {
        id: 4,
        name_th: 'แฟชั่นและเครื่องแต่งกาย',
        name_en: 'Fashion & Accessories',
        slug: 'fashion',
        icon: '👕',
        order_index: 4,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.BRAND],
        subCategories: [
            {
                id: 'mens-clothing',
                name_th: 'เสื้อผ้าผู้ชาย',
                name_en: "Men's Clothing",
                slug: 'mens-clothing',
                attributes: [
                    { name: 'size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], required: true, aiSuggested: true },
                    { name: 'color', type: 'text', required: false, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'mens-tshirts', name_th: 'เสื้อยืด', name_en: 'T-Shirts', slug: 'mens-tshirts' },
                    { id: 'mens-shirts', name_th: 'เสื้อเชิ้ต', name_en: 'Shirts', slug: 'mens-shirts' },
                    { id: 'mens-jeans', name_th: 'กางเกงยีนส์', name_en: 'Jeans', slug: 'mens-jeans' },
                    { id: 'mens-suits', name_th: 'ชุดสูท', name_en: 'Suits', slug: 'mens-suits' }
                ]
            },
            {
                id: 'womens-clothing',
                name_th: 'เสื้อผ้าผู้หญิง',
                name_en: "Women's Clothing",
                slug: 'womens-clothing',
                attributes: [
                    { name: 'size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true, aiSuggested: true },
                    { name: 'color', type: 'text', required: false, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'womens-dresses', name_th: 'เดรส', name_en: 'Dresses', slug: 'womens-dresses' },
                    { id: 'womens-tops', name_th: 'เสื้อ', name_en: 'Tops', slug: 'womens-tops' },
                    { id: 'womens-skirts', name_th: 'กระโปรง', name_en: 'Skirts', slug: 'womens-skirts' }
                ]
            },
            {
                id: 'footwear',
                name_th: 'รองเท้า',
                name_en: 'Footwear',
                slug: 'footwear',
                attributes: [
                    { name: 'brand', type: 'select', options: ['Nike', 'Adidas', 'Converse', 'Vans', 'New Balance', 'Puma', 'Reebok', 'Other'], required: false, aiSuggested: true },
                    { name: 'size', type: 'text', required: true, aiSuggested: true },
                    { name: 'gender', type: 'select', options: ['Men', 'Women', 'Unisex', 'Kids'], required: true, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'sneakers', name_th: 'รองเท้าผ้าใบ', name_en: 'Sneakers', slug: 'sneakers' },
                    { id: 'leather-shoes', name_th: 'รองเท้าหนัง', name_en: 'Leather Shoes', slug: 'leather-shoes' },
                    { id: 'boots', name_th: 'รองเท้าบูท', name_en: 'Boots', slug: 'boots' },
                    { id: 'sandals', name_th: 'รองเท้าแตะ', name_en: 'Sandals', slug: 'sandals' }
                ]
            },
            {
                id: 'bags',
                name_th: 'กระเป๋า',
                name_en: 'Bags',
                slug: 'bags',
                attributes: [
                    { name: 'material', type: 'select', options: ['Leather', 'Canvas', 'Nylon', 'Synthetic', 'Other'], required: false, aiSuggested: true },
                    { name: 'luxury_brand', type: 'select', options: ['Louis Vuitton', 'Gucci', 'Chanel', 'Hermès', 'Prada', 'Dior', 'Fendi', 'Other'], required: false, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'handbags', name_th: 'กระเป๋าถือ', name_en: 'Handbags', slug: 'handbags' },
                    { id: 'backpacks', name_th: 'กระเป๋าเป้', name_en: 'Backpacks', slug: 'backpacks' },
                    { id: 'wallets', name_th: 'กระเป๋าสตางค์', name_en: 'Wallets', slug: 'wallets' },
                    { id: 'luxury-bags', name_th: 'กระเป๋าแบรนด์เนม', name_en: 'Luxury Bags', slug: 'luxury-bags' }
                ]
            }
        ]
    },
    {
        id: 5,
        name_th: 'นาฬิกาและเครื่องประดับ',
        name_en: 'Watches & Jewelry',
        slug: 'watches-jewelry',
        icon: '⌚',
        order_index: 5,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.BRAND, COMMON_ATTRIBUTES.ORIGINAL_BOX],
        subCategories: [
            {
                id: 'watches',
                name_th: 'นาฬิกาข้อมือ',
                name_en: 'Watches',
                slug: 'watches',
                attributes: [
                    { name: 'brand', type: 'select', options: ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Apple', 'Samsung', 'Garmin', 'Casio', 'Seiko', 'Citizen', 'Fossil', 'Daniel Wellington', 'Other'], required: true, aiSuggested: true },
                    { name: 'watch_type', type: 'select', options: ['Luxury', 'Fashion', 'Digital', 'Smartwatch', 'Sports', 'Vintage'], required: true, aiSuggested: true },
                    { name: 'movement', type: 'select', options: ['Automatic', 'Quartz', 'Manual', 'Digital', 'Smartwatch'], required: false, aiSuggested: true },
                    { name: 'gender', type: 'select', options: ['Men', 'Women', 'Unisex'], required: false, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'luxury-watches', name_th: 'นาฬิกาหรู', name_en: 'Luxury Watches', slug: 'luxury-watches' },
                    { id: 'smartwatches', name_th: 'นาฬิกาอัจฉริยะ', name_en: 'Smartwatches', slug: 'smartwatches' },
                    { id: 'fashion-watches', name_th: 'นาฬิกาแฟชั่น', name_en: 'Fashion Watches', slug: 'fashion-watches' }
                ]
            },
            {
                id: 'jewelry',
                name_th: 'เครื่องประดับ',
                name_en: 'Jewelry',
                slug: 'jewelry',
                attributes: [
                    { name: 'material', type: 'select', options: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Gemstone', 'Stainless Steel', 'Other'], required: true, aiSuggested: true },
                    { name: 'gold_weight', type: 'text', required: false, aiSuggested: false }
                ],
                subCategories: [
                    { id: 'rings', name_th: 'แหวน', name_en: 'Rings', slug: 'rings' },
                    { id: 'necklaces', name_th: 'สร้อยคอ', name_en: 'Necklaces', slug: 'necklaces' },
                    { id: 'earrings', name_th: 'ต่างหู', name_en: 'Earrings', slug: 'earrings' },
                    { id: 'bracelets', name_th: 'กำไล', name_en: 'Bracelets', slug: 'bracelets' }
                ]
            }
        ]
    },
    {
        id: 6,
        name_th: 'สุขภาพและความงาม',
        name_en: 'Health & Beauty',
        slug: 'health-beauty',
        icon: '💄',
        order_index: 6,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'skincare',
                name_th: 'ผลิตภัณฑ์ดูแลผิว',
                name_en: 'Skincare',
                slug: 'skincare',
                attributes: [
                    { name: 'product_type', type: 'select', options: ['Moisturizer', 'Serum', 'Sunscreen', 'Cleanser', 'Toner', 'Face Mask', 'Eye Cream'], required: true, aiSuggested: true },
                    { name: 'skin_type', type: 'select', options: ['All Skin Types', 'Dry', 'Oily', 'Combination', 'Sensitive'], required: false, aiSuggested: false }
                ]
            },
            {
                id: 'makeup',
                name_th: 'เครื่องสำอาง',
                name_en: 'Makeup',
                slug: 'makeup',
                subCategories: [
                    { id: 'foundation', name_th: 'รองพื้น', name_en: 'Foundation', slug: 'foundation' },
                    { id: 'lipstick', name_th: 'ลิปสติก', name_en: 'Lipstick', slug: 'lipstick' },
                    { id: 'eyeshadow', name_th: 'อายแชโดว์', name_en: 'Eyeshadow', slug: 'eyeshadow' }
                ]
            },
            {
                id: 'fragrances',
                name_th: 'น้ำหอม',
                name_en: 'Fragrances',
                slug: 'fragrances',
                attributes: [
                    { name: 'gender', type: 'select', options: ['Women', 'Men', 'Unisex'], required: true, aiSuggested: true },
                    { name: 'volume', type: 'select', options: ['30ml', '50ml', '75ml', '100ml', '125ml', '150ml'], required: false, aiSuggested: true }
                ]
            },
            {
                id: 'supplements',
                name_th: 'อาหารเสริมและวิตามิน',
                name_en: 'Supplements',
                slug: 'supplements',
                subCategories: [
                    { id: 'vitamins', name_th: 'วิตามิน', name_en: 'Vitamins', slug: 'vitamins' },
                    { id: 'protein', name_th: 'โปรตีน', name_en: 'Protein', slug: 'protein' },
                    { id: 'collagen', name_th: 'คอลลาเจน', name_en: 'Collagen', slug: 'collagen' },
                    { id: 'weight-loss', name_th: 'ลดน้ำหนัก', name_en: 'Weight Loss', slug: 'weight-loss' }
                ]
            }
        ]
    },
    {
        id: 7,
        name_th: 'แม่และเด็ก',
        name_en: 'Mom & Baby',
        slug: 'mom-baby',
        icon: '🍼',
        order_index: 7,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'baby-clothing',
                name_th: 'เสื้อผ้าเด็ก',
                name_en: 'Baby & Kids Clothing',
                slug: 'baby-clothing',
                attributes: [
                    { name: 'age_range', type: 'select', options: ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-3 years', '3-5 years', '5-8 years', '8-12 years'], required: true, aiSuggested: true },
                    { name: 'gender', type: 'select', options: ['Boy', 'Girl', 'Unisex'], required: true, aiSuggested: true }
                ]
            },
            {
                id: 'feeding',
                name_th: 'อุปกรณ์ให้นม',
                name_en: 'Feeding',
                slug: 'feeding',
                subCategories: [
                    { id: 'bottles', name_th: 'ขวดนม', name_en: 'Baby Bottles', slug: 'bottles' },
                    { id: 'breast-pumps', name_th: 'เครื่องปั๊มนม', name_en: 'Breast Pumps', slug: 'breast-pumps' },
                    { id: 'high-chairs', name_th: 'เก้าอี้ทานข้าว', name_en: 'High Chairs', slug: 'high-chairs' }
                ]
            },
            {
                id: 'strollers-carseats',
                name_th: 'รถเข็นและคาร์ซีท',
                name_en: 'Strollers & Car Seats',
                slug: 'strollers-carseats',
                subCategories: [
                    { id: 'strollers', name_th: 'รถเข็นเด็ก', name_en: 'Strollers', slug: 'strollers' },
                    { id: 'car-seats', name_th: 'คาร์ซีท', name_en: 'Car Seats', slug: 'car-seats' },
                    { id: 'baby-carriers', name_th: 'เป้อุ้มเด็ก', name_en: 'Baby Carriers', slug: 'baby-carriers' }
                ]
            },
            {
                id: 'baby-toys',
                name_th: 'ของเล่นเด็ก',
                name_en: 'Baby Toys',
                slug: 'baby-toys'
            }
        ]
    },
    {
        id: 8,
        name_th: 'ของตกแต่งบ้านและสวน',
        name_en: 'Home & Living',
        slug: 'home-living',
        icon: '🏠',
        order_index: 8,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'furniture',
                name_th: 'เฟอร์นิเจอร์',
                name_en: 'Furniture',
                slug: 'furniture',
                subCategories: [
                    { id: 'sofas', name_th: 'โซฟา', name_en: 'Sofas', slug: 'sofas' },
                    { id: 'tables', name_th: 'โต๊ะ', name_en: 'Tables', slug: 'tables' },
                    { id: 'chairs', name_th: 'เก้าอี้', name_en: 'Chairs', slug: 'chairs' },
                    { id: 'beds', name_th: 'เตียง', name_en: 'Beds', slug: 'beds' },
                    { id: 'wardrobes', name_th: 'ตู้เสื้อผ้า', name_en: 'Wardrobes', slug: 'wardrobes' }
                ]
            },
            {
                id: 'home-decor',
                name_th: 'ของตกแต่ง',
                name_en: 'Home Decor',
                slug: 'home-decor',
                subCategories: [
                    { id: 'curtains', name_th: 'ผ้าม่าน', name_en: 'Curtains', slug: 'curtains' },
                    { id: 'rugs', name_th: 'พรม', name_en: 'Rugs', slug: 'rugs' },
                    { id: 'lamps', name_th: 'โคมไฟ', name_en: 'Lamps', slug: 'lamps' },
                    { id: 'mirrors', name_th: 'กระจก', name_en: 'Mirrors', slug: 'mirrors' }
                ]
            },
            {
                id: 'bedding',
                name_th: 'เครื่องนอน',
                name_en: 'Bedding',
                slug: 'bedding',
                subCategories: [
                    { id: 'mattresses', name_th: 'ที่นอน', name_en: 'Mattresses', slug: 'mattresses' },
                    { id: 'pillows', name_th: 'หมอน', name_en: 'Pillows', slug: 'pillows' },
                    { id: 'bed-sheets', name_th: 'ผ้าปูที่นอน', name_en: 'Bed Sheets', slug: 'bed-sheets' }
                ]
            },
            {
                id: 'garden',
                name_th: 'สวนและกลางแจ้ง',
                name_en: 'Garden & Outdoor',
                slug: 'garden',
                subCategories: [
                    { id: 'plants', name_th: 'ต้นไม้และกระถาง', name_en: 'Plants & Pots', slug: 'plants' },
                    { id: 'garden-tools', name_th: 'เครื่องมือสวน', name_en: 'Garden Tools', slug: 'garden-tools' },
                    { id: 'outdoor-furniture', name_th: 'เฟอร์นิเจอร์กลางแจ้ง', name_en: 'Outdoor Furniture', slug: 'outdoor-furniture' }
                ]
            }
        ]
    },
    {
        id: 9,
        name_th: 'เครื่องใช้ไฟฟ้าภายในบ้าน',
        name_en: 'Home Appliances',
        slug: 'home-appliances',
        icon: '🔌',
        order_index: 9,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.WARRANTY, COMMON_ATTRIBUTES.BRAND],
        subCategories: [
            {
                id: 'kitchen-appliances',
                name_th: 'เครื่องใช้ไฟฟ้าครัว',
                name_en: 'Kitchen Appliances',
                slug: 'kitchen-appliances',
                subCategories: [
                    { id: 'refrigerators', name_th: 'ตู้เย็น', name_en: 'Refrigerators', slug: 'refrigerators' },
                    { id: 'microwaves', name_th: 'เตาไมโครเวฟ', name_en: 'Microwaves', slug: 'microwaves' },
                    { id: 'rice-cookers', name_th: 'หม้อหุงข้าว', name_en: 'Rice Cookers', slug: 'rice-cookers' },
                    { id: 'blenders', name_th: 'เครื่องปั่น', name_en: 'Blenders', slug: 'blenders' },
                    { id: 'coffee-makers', name_th: 'เครื่องชงกาแฟ', name_en: 'Coffee Makers', slug: 'coffee-makers' },
                    { id: 'air-fryers', name_th: 'Air Fryer', name_en: 'Air Fryers', slug: 'air-fryers' }
                ]
            },
            {
                id: 'laundry',
                name_th: 'เครื่องซักผ้า',
                name_en: 'Laundry',
                slug: 'laundry',
                subCategories: [
                    { id: 'washing-machines', name_th: 'เครื่องซักผ้า', name_en: 'Washing Machines', slug: 'washing-machines' },
                    { id: 'dryers', name_th: 'เครื่องอบผ้า', name_en: 'Dryers', slug: 'dryers' },
                    { id: 'irons', name_th: 'เตารีด', name_en: 'Irons', slug: 'irons' }
                ]
            },
            {
                id: 'climate-cleaning',
                name_th: 'เครื่องปรับอากาศและทำความสะอาด',
                name_en: 'Climate & Cleaning',
                slug: 'climate-cleaning',
                subCategories: [
                    { id: 'air-conditioners', name_th: 'เครื่องปรับอากาศ', name_en: 'Air Conditioners', slug: 'air-conditioners' },
                    { id: 'fans', name_th: 'พัดลม', name_en: 'Fans', slug: 'fans' },
                    { id: 'air-purifiers', name_th: 'เครื่องฟอกอากาศ', name_en: 'Air Purifiers', slug: 'air-purifiers' },
                    { id: 'vacuum-cleaners', name_th: 'เครื่องดูดฝุ่น', name_en: 'Vacuum Cleaners', slug: 'vacuum-cleaners' },
                    { id: 'robot-vacuums', name_th: 'หุ่นยนต์ดูดฝุ่น', name_en: 'Robot Vacuums', slug: 'robot-vacuums' }
                ]
            },
            {
                id: 'smart-home',
                name_th: 'Smart Home',
                name_en: 'Smart Home Devices',
                slug: 'smart-home',
                subCategories: [
                    { id: 'smart-speakers', name_th: 'ลำโพงอัจฉริยะ', name_en: 'Smart Speakers', slug: 'smart-speakers' },
                    { id: 'smart-bulbs', name_th: 'หลอดไฟอัจฉริยะ', name_en: 'Smart Bulbs', slug: 'smart-bulbs' },
                    { id: 'security-cameras', name_th: 'กล้องวงจรปิด', name_en: 'Security Cameras', slug: 'security-cameras' },
                    { id: 'smart-locks', name_th: 'Smart Door Locks', name_en: 'Smart Locks', slug: 'smart-locks' }
                ]
            }
        ]
    },
    {
        id: 10,
        name_th: 'ของเล่น เกม และงานอดิเรก',
        name_en: 'Toys, Games & Hobbies',
        slug: 'toys-hobbies',
        icon: '🎮',
        order_index: 10,
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION],
        subCategories: [
            {
                id: 'gaming-consoles',
                name_th: 'เครื่องเล่นเกม',
                name_en: 'Gaming Consoles',
                slug: 'gaming-consoles',
                attributes: [
                    { name: 'platform', type: 'select', options: ['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Steam Deck', 'Other'], required: true, aiSuggested: true },
                    { name: 'storage', type: 'select', options: ['500GB', '1TB', '2TB'], required: false, aiSuggested: true }
                ]
            },
            {
                id: 'video-games',
                name_th: 'เกม',
                name_en: 'Video Games',
                slug: 'video-games',
                attributes: [
                    { name: 'platform', type: 'select', options: ['PS5', 'PS4', 'Xbox', 'Nintendo Switch', 'PC'], required: true, aiSuggested: true },
                    { name: 'genre', type: 'select', options: ['Action', 'RPG', 'Sports', 'Racing', 'Simulation', 'Strategy', 'Other'], required: false, aiSuggested: true }
                ]
            },
            {
                id: 'gaming-accessories',
                name_th: 'อุปกรณ์เกมมิ่ง',
                name_en: 'Gaming Accessories',
                slug: 'gaming-accessories',
                subCategories: [
                    { id: 'controllers', name_th: 'จอยสติ๊ก', name_en: 'Controllers', slug: 'controllers' },
                    { id: 'gaming-headsets', name_th: 'หูฟังเกมมิ่ง', name_en: 'Gaming Headsets', slug: 'gaming-headsets' },
                    { id: 'gaming-chairs', name_th: 'เก้าอี้เกมมิ่ง', name_en: 'Gaming Chairs', slug: 'gaming-chairs' },
                    { id: 'vr-headsets', name_th: 'VR Headsets', name_en: 'VR Headsets', slug: 'vr-headsets' }
                ]
            },
            {
                id: 'toys-models',
                name_th: 'ของเล่นและโมเดล',
                name_en: 'Toys & Models',
                slug: 'toys-models',
                subCategories: [
                    { id: 'action-figures', name_th: 'ฟิกเกอร์', name_en: 'Action Figures', slug: 'action-figures' },
                    { id: 'lego', name_th: 'LEGO', name_en: 'LEGO', slug: 'lego' },
                    { id: 'gundam', name_th: 'Gundam', name_en: 'Gundam', slug: 'gundam' },
                    { id: 'funko-pop', name_th: 'Funko Pop', name_en: 'Funko Pop', slug: 'funko-pop' }
                ]
            },
            {
                id: 'board-games',
                name_th: 'Board Games',
                name_en: 'Board Games',
                slug: 'board-games'
            }
        ]
    }
]
