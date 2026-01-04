'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSellerProfile, updateSellerProfile, createSellerProfile, checkShopNameAvailability } from '@/lib/seller'
import { createProduct } from '@/lib/products'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Store, Camera, Edit3, ShieldCheck, Package, DollarSign, Rocket, CheckCircle, ArrowLeft, ArrowRight, Upload } from 'lucide-react'

// --- Step Components ---

const Step1_ShopName = ({ onComplete, initialName }: any) => {
    const [name, setName] = useState(initialName || '')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const { user, refreshProfile, storeStatus } = useAuth()
    const { t } = useLanguage()

    const handleAiGenerate = () => {
        setAiLoading(true)
        setTimeout(() => {
            const types = ['Official', 'Store', 'Shop', 'Hub', 'Market', 'Boutique']
            const adjectives = ['Smart', 'Tech', 'Cyber', 'Future', 'Daily', 'Urban']
            const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${types[Math.floor(Math.random() * types.length)]} by ${user?.displayName?.split(' ')[0] || 'You'}`
            setName(randomName)
            setAiLoading(false)
        }, 1200)
    }

    const handleSubmit = async () => {
        if (!name.trim()) return setError('Please enter a shop name')
        setLoading(true)
        setError('')
        try {
            if (storeStatus.hasStore) {
                // Update existing
                await updateSellerProfile(user!.uid, { name: name, shop_name: name } as any)
            } else {
                // Check availability first if new
                const isAvailable = await checkShopNameAvailability(name)
                if (!isAvailable) throw new Error('Shop name taken')

                // Create new
                await createSellerProfile(user!.uid, {
                    shop_name: name,
                    shop_description: '',
                    address: null
                })
                await refreshProfile()
            }
            onComplete()
        } catch (err: any) {
            setError(err.message || 'Error saving shop name')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 max-w-md mx-auto">
            <div className="text-center">
                <Store className="w-12 h-12 text-neon-purple mx-auto mb-2" />
                <h2 className="text-xl font-bold">{t('onboarding.step_1_title')}</h2>
                <p className="text-gray-500 text-sm">{t('onboarding.step_1_desc')}</p>
            </div>

            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <Input
                        label={t('onboarding.step_1_input_label')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('onboarding.step_1_placeholder')}
                        error={error}
                    />
                </div>
                <button
                    onClick={handleAiGenerate}
                    disabled={aiLoading}
                    className="mb-4 p-3 rounded-xl bg-purple-50 text-neon-purple hover:bg-purple-100 border border-purple-200 transition-colors"
                    title="Generate with AI"
                >
                    {aiLoading ? <Store className="w-5 h-5 animate-spin" /> : <div className="text-xl">✨</div>}
                </button>
            </div>

            <Button onClick={handleSubmit} isLoading={loading} className="w-full">
                {t('onboarding.step_1_submit')}
            </Button>
        </div>
    )
}

const Step2_Logo = ({ onComplete }: any) => {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const { t } = useLanguage()

    const handleUpload = async () => {
        // Mock upload for MVP
        setLoading(true)
        setTimeout(async () => {
            await updateSellerProfile(user!.uid, {
                logo_url: `https://api.dicebear.com/7.x/initials/svg?seed=${user!.displayName}`
            })
            setLoading(false)
            onComplete()
        }, 1000)
    }

    const handleAI = async () => {
        setLoading(true)
        setTimeout(async () => {
            // Visualize AI "thinking"
            const styles = ['identicon', 'avataaars', 'bottts', 'shapes']
            const randomStyle = styles[Math.floor(Math.random() * styles.length)]
            await updateSellerProfile(user!.uid, {
                logo_url: `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${Math.random()}`
            })
            setLoading(false)
            onComplete()
        }, 2000)
    }

    return (
        <div className="space-y-6 max-w-md mx-auto text-center">
            <div className="text-center">
                <Camera className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold">{t('onboarding.step_2_title')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div onClick={handleUpload} className="border-2 border-dashed border-gray-300 p-6 rounded-xl hover:border-blue-500 cursor-pointer transition flex flex-col items-center justify-center gap-2 hover-lift">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-medium">{t('onboarding.step_2_upload')}</span>
                </div>
                <div onClick={handleAI} className="border-2 border-dashed border-purple-300 p-6 rounded-xl hover:border-purple-500 cursor-pointer transition flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-50 to-indigo-50 hover-lift relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Edit3 className="w-8 h-8 text-purple-600 relative z-10" />
                    <span className="text-sm font-bold text-purple-700 relative z-10">{t('onboarding.step_2_ai')}</span>
                    <span className="text-[10px] text-purple-500 relative z-10">{t('onboarding.step_2_ai_desc')}</span>
                </div>
            </div>
            {loading && (
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600 animate-pulse">
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    <span>AI is creating your brand identity...</span>
                </div>
            )}
            <Button variant="ghost" onClick={onComplete}>{t('onboarding.step_2_skip')}</Button>
        </div>
    )
}

const Step3_Description = ({ onComplete }: any) => {
    const [desc, setDesc] = useState('')
    const [loading, setLoading] = useState(false)
    const [isAiTyping, setIsAiTyping] = useState(false)
    const { user } = useAuth()
    const { t } = useLanguage()

    const handleGenerate = () => {
        setIsAiTyping(true)
        setDesc('')

        // Mock AI Stream
        const templates = [
            `Welcome to ${user?.displayName}'s official store! 🌟 We curated the best tech gadgets and accessories for modern life. Order today for fast shipping!`,
            `Discover premium quality items at unbeatable prices. ✅ 100% Authentic. 🚚 Fast Delivery. 💬 24/7 Support. Happy shopping!`,
            `Your go-to destination for fashion and lifestyle. Trusted by 1000+ customers. Unique finds added daily! ✨`
        ]
        const text = templates[Math.floor(Math.random() * templates.length)]

        let i = 0
        const interval = setInterval(() => {
            setDesc(prev => prev + text.charAt(i))
            i++
            if (i >= text.length) {
                clearInterval(interval)
                setIsAiTyping(false)
            }
        }, 30) // Typing effect
    }

    const handleSave = async () => {
        setLoading(true)
        await updateSellerProfile(user!.uid, { description: desc, shop_description: desc } as any)
        setLoading(false)
        onComplete()
    }

    return (
        <div className="space-y-4 max-w-md mx-auto">
            <div className="text-center">
                <Edit3 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold">{t('onboarding.step_3_title')}</h2>
                <p className="text-gray-500 text-sm">{t('onboarding.step_3_desc')}</p>
            </div>
            <div className="relative group">
                <textarea
                    className="w-full p-4 border border-gray-200 rounded-xl min-h-[140px] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none shadow-sm"
                    placeholder={t('onboarding.step_3_placeholder')}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    disabled={isAiTyping}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isAiTyping}
                    className="absolute bottom-4 right-4 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:shadow-lg hover:scale-105 transition-all shadow-purple-200"
                >
                    {isAiTyping ? <Rocket className="w-3 h-3 animate-spin" /> : <span className="text-sm">✨</span>}
                    {isAiTyping ? 'Writing...' : 'AI Write'}
                </button>
            </div>
            <Button onClick={handleSave} isLoading={loading} className="w-full">{t('onboarding.step_3_save')}</Button>
        </div>
    )
}

const Step4_KYC = ({ onComplete }: any) => {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const { t } = useLanguage()

    const handleVerify = async () => {
        setLoading(true)
        // Simulate API call
        setTimeout(async () => {
            await updateSellerProfile(user!.uid, {
                verified_status: 'verified', // Bypass for dev
                trust_score: 80
            })
            setLoading(false)
            onComplete()
        }, 1500)
    }

    return (
        <div className="space-y-6 max-w-md mx-auto text-center">
            <div className="text-center">
                <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold">{t('onboarding.step_4_title')}</h2>
                <p className="text-gray-500 text-sm">{t('onboarding.step_4_desc')}</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-left">
                <h4 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t('onboarding.step_4_docs_title')}
                </h4>
                <ul className="list-disc list-inside text-xs text-orange-700 space-y-1 ml-1">
                    <li>{t('onboarding.step_4_doc_1')}</li>
                    <li>{t('onboarding.step_4_doc_2')}</li>
                    <li>{t('onboarding.step_4_doc_3')}</li>
                </ul>
            </div>

            <Button onClick={handleVerify} isLoading={loading} className="w-full bg-orange-500 hover:bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-200">
                {t('onboarding.step_4_btn')}
            </Button>
        </div>
    )
}

const Step5_Product = ({ onComplete }: any) => {
    const [loading, setLoading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [productData, setProductData] = useState<any>({
        title: '',
        description: '',
        price: '',
        image: null
    })
    const { user } = useAuth()
    const { t } = useLanguage()

    const handleImageUpload = () => {
        // Simulate upload & AI analysis
        const randomImage = `https://picsum.photos/seed/${Math.random()}/400/400`
        setProductData((prev: any) => ({ ...prev, image: randomImage }))
        setAnalyzing(true)

        setTimeout(() => {
            setProductData((prev: any) => ({
                ...prev,
                title: 'Vintage Film Camera Canon AE-1',
                description: 'Authentic vintage camera. Tested and working perfectly. Comes with original lens and strap. Great condition for its age.',
                price: '4500'
            }))
            setAnalyzing(false)
        }, 2000)
    }

    const handleCreate = async () => {
        setLoading(true)
        try {
            await createProduct({
                title: productData.title || 'Demo Product',
                description: productData.description || 'Created via onboarding',
                category_id: '1',
                price: parseInt(productData.price) || 999,
                stock: 10,
                condition: 'used',
                province: 'Bangkok',
                amphoe: '',
                district: '',
                zipcode: '',
                can_ship: true,
                can_pickup: false,
                images: [productData.image || `https://picsum.photos/seed/${Math.random()}/400/400`],
                price_type: 'fixed'
            }, user!.uid, user!.displayName || 'Seller')

            setLoading(false)
            onComplete()
        } catch (e) {
            console.error(e)
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-md mx-auto text-center">
            <div className="text-center">
                <Package className="w-12 h-12 text-pink-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold">{t('onboarding.step_5_title')}</h2>
                <p className="text-gray-500 text-sm">{t('onboarding.step_5_desc')}</p>
            </div>

            {!productData.image ? (
                <div
                    onClick={handleImageUpload}
                    className="border-2 border-dashed border-gray-300 h-40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all group"
                >
                    <div className="p-3 bg-pink-100 text-pink-500 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 group-hover:text-pink-600">{t('onboarding.step_5_upload_cta')}</span>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm text-left">
                    <div className="relative h-48 w-full bg-gray-100">
                        <img src={productData.image} className="w-full h-full object-cover" alt="Product" />
                        {analyzing && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                <ScanAnimation />
                                <span className="text-sm font-medium mt-2">{t('onboarding.step_5_analyzing')}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 space-y-3">
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase">Product Title</label>
                            {analyzing ? (
                                <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse mt-1" />
                            ) : (
                                <input
                                    value={productData.title}
                                    onChange={e => setProductData({ ...productData, title: e.target.value })}
                                    className="w-full font-bold text-gray-800 border-none p-0 focus:ring-0 placeholder:text-gray-300"
                                    placeholder="Product Title"
                                />
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase">AI Description</label>
                            {analyzing ? (
                                <div className="space-y-1 mt-1">
                                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                                    <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" />
                                </div>
                            ) : (
                                <textarea
                                    value={productData.description}
                                    onChange={e => setProductData({ ...productData, description: e.target.value })}
                                    className="w-full text-sm text-gray-600 border-none p-0 focus:ring-0 resize-none h-16 placeholder:text-gray-300"
                                    placeholder="Description..."
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Button onClick={handleCreate} isLoading={loading} disabled={analyzing || !productData.image} className="w-full bg-pink-500 hover:bg-pink-600 border-pink-500 text-white">
                {analyzing ? t('onboarding.step_5_wait') : t('onboarding.step_5_create')}
            </Button>
        </div>
    )
}

function ScanAnimation() {
    return (
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-white rounded-lg opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-purple shadow-[0_0_10px_#8B5CF6] animate-[scan_1.5s_ease-in-out_infinite]"></div>
        </div>
    )
}

const Step6_Pricing = ({ onComplete }: any) => {
    const [loading, setLoading] = useState(false)
    const [suggestion, setSuggestion] = useState<any>(null)
    const { t } = useLanguage()

    const handleAnalyze = () => {
        setLoading(true)
        setTimeout(() => {
            setSuggestion({
                min: 800,
                max: 1200,
                optimal: 999,
                competitors: 15
            })
            setLoading(false)
        }, 1200)
    }

    return (
        <div className="space-y-6 max-w-md mx-auto text-center">
            <div className="text-center">
                <DollarSign className="w-12 h-12 text-teal-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold">{t('onboarding.step_6_title')}</h2>
            </div>

            {!suggestion ? (
                <Button onClick={handleAnalyze} isLoading={loading} variant="outline" className="w-full h-32 flex flex-col gap-2">
                    <span className="text-2xl">🤖</span>
                    <span>{t('onboarding.step_6_btn_analyze')}</span>
                </Button>
            ) : (
                <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 animate-fade-in-up">
                    <h3 className="font-bold text-teal-800 mb-4">{t('onboarding.step_6_analysis_title')}</h3>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-teal-600">{t('onboarding.step_6_recommended')}:</span>
                        <span className="text-2xl font-bold text-teal-700">฿{suggestion.optimal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: ฿{suggestion.min}</span>
                        <span>Max: ฿{suggestion.max}</span>
                    </div>

                    <Button onClick={onComplete} className="w-full mt-6 bg-teal-600 text-white hover:bg-teal-700">
                        {t('onboarding.step_6_btn_apply')}
                    </Button>
                </div>
            )}
        </div>
    )
}

const Step7_OpenShop = ({ onComplete }: any) => {
    const { user, refreshProfile } = useAuth()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLaunch = async () => {
        setLoading(true)
        await updateSellerProfile(user!.uid, {
            onboarding_progress: 7,
            // Any other activation flags
        })
        await refreshProfile()
        setLoading(false)
        router.push('/seller')
    }

    return (
        <div className="space-y-6 max-w-md mx-auto text-center">
            <div className="text-center">
                <Rocket className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-indigo-900">{t('onboarding.ready_title')}</h2>
                <p className="text-gray-600 mt-2">{t('onboarding.ready_desc')}</p>
            </div>

            <Button onClick={handleLaunch} isLoading={loading} className="w-full h-14 text-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200">
                🚀 {t('onboarding.launch_btn')}
            </Button>
        </div>
    )
}

// --- Main Page Component ---

export default function OnboardingStepPage() {
    const router = useRouter()
    const params = useParams()
    const step = parseInt(params.step as string)
    const { user, storeStatus, refreshProfile } = useAuth()

    const handleComplete = async () => {
        if (user && storeStatus.hasStore) {
            // Save progress
            const nextProgress = Math.max(step, storeStatus.onboardingProgress || 0)
            await updateSellerProfile(user.uid, {
                onboarding_progress: nextProgress
            })
            // IMPORTANT: Sync state to AuthContext immediately
            await refreshProfile()
        }

        if (step < 7) {
            router.push(`/onboarding/${step + 1}`)
        } else {
            // Should be handled in Step 7 component but duplicate here for safety
            router.push('/seller')
        }
    }

    // Step Map
    const renderStep = () => {
        switch (step) {
            case 1: return <Step1_ShopName onComplete={handleComplete} initialName={storeStatus.shopName} />
            case 2: return <Step2_Logo onComplete={handleComplete} />
            case 3: return <Step3_Description onComplete={handleComplete} />
            case 4: return <Step4_KYC onComplete={handleComplete} />
            case 5: return <Step5_Product onComplete={handleComplete} />
            case 6: return <Step6_Pricing onComplete={handleComplete} />
            case 7: return <Step7_OpenShop onComplete={handleComplete} />
            default: return <div>Unknown Step</div>
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            {/* Header / Nav */}
            <div className="w-full max-w-3xl px-4 mb-8 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push('/onboarding')}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> All Steps
                </Button>
                <div className="text-sm font-bold text-gray-500">
                    Step {step} of 7
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md h-1 bg-gray-200 rounded-full mb-10 overflow-hidden">
                <div
                    className="h-full bg-neon-purple transition-all duration-500"
                    style={{ width: `${(step / 7) * 100}%` }}
                ></div>
            </div>

            {/* Content Card */}
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-center">
                {renderStep()}
            </div>

            {/* Navigation Helpers */}
            <div className="mt-8 flex gap-4 text-sm text-gray-400">
                {step > 1 && (
                    <button onClick={() => router.push(`/onboarding/${step - 1}`)} className="hover:text-gray-600">Back</button>
                )}
                {step < 7 && (
                    <button onClick={() => router.push(`/onboarding/${step + 1}`)} className="hover:text-gray-600">Skip to Next</button>
                )}
            </div>
        </div>
    )
}
