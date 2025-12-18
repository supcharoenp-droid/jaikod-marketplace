'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import AutomotiveForm from './forms/AutomotiveForm'
import RealEstateForm from './forms/RealEstateForm'
import MobileForm from './forms/MobileForm'
import GeneralSmartForm from './forms/GeneralSmartForm'
import OnePageListingForm from './forms/OnePageListingForm'
import {
    Camera, Upload, Sparkles, Brain, CheckCircle2,
    AlertTriangle, Loader2, Tag, DollarSign, MapPin,
    ChevronRight, X, ArrowLeft, ImagePlus, ScanLine, Edit2, Zap, ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeImageQuality, analyzeListingImage, AIListingAnalysis, ImageAnalysis } from '@/services/aiListingService'
import { CATEGORIES } from '@/constants/categories'
import { CATEGORY_FORMS, COMMON_FIELDS, FormField } from '@/config/category-forms'
import { useAuth } from '@/contexts/AuthContext'
import { createProduct, updateProduct, CreateProductInput } from '@/lib/products'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// --- Steps ---
// 1. Photos
// 2. Smart Details (AI Auto-fill)
// 3. Review & Publish

export default function SmartUploadForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')
    const { user } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // State
    const [initialData, setInitialData] = useState<any>({})
    const [isLoadingEdit, setIsLoadingEdit] = useState(false)
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [imageQuality, setImageQuality] = useState<ImageAnalysis | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState<AIListingAnalysis | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [errors, setErrors] = useState<string[]>([])
    const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'done'>('idle')

    // Effect: Load Edit Data
    useEffect(() => {
        if (!editId) return

        const loadProduct = async () => {
            setIsLoadingEdit(true)
            try {
                const docRef = doc(db, 'products', editId)
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    const data = snap.data()
                    console.log("Loaded edit data:", data)
                    // Transform to form format if needed
                    setInitialData({
                        ...data,
                        category_main: data.category_id, // Map fields if needed
                        district: data.location_district || data.location_amphoe, // Fallback
                        shipping_methods: {
                            delivery: data.can_ship,
                            pickup: data.can_pickup
                        },
                        images: (data.images || []).map((img: any) => typeof img === 'string' ? img : img.url)
                    })
                }
            } catch (error) {
                console.error("Failed to load product for edit", error)
            } finally {
                setIsLoadingEdit(false)
            }
        }
        loadProduct()
    }, [editId])

    // Handlers
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            setImages(prev => [...prev, ...newFiles])

            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setPreviews(prev => [...prev, ...newPreviews])

            // Analyze first image quality immediately
            if (!imageQuality && newFiles.length > 0) {
                const quality = await analyzeImageQuality(newFiles[0])
                setImageQuality(quality)
            }
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleNextToDetails = async () => {
        if (images.length === 0) {
            setErrors(['Please upload at least 1 photo'])
            return
        }

        setIsScanning(true)
        setErrors([])

        try {
            // Mock AI Analysis based on image
            // We pass an empty title to let AI hint/guess or return a generic "New Listing" title
            const analysis = await analyzeListingImage(images[0], "")
            setScanResult(analysis)

            // Auto-fill
            setFormData({
                title: analysis.extractedFields.title || "", // Use AI title or empty
                category_id: analysis.detectedCategoryId,
                price: analysis.suggestedPrice.avg,
                description: analysis.description,
                condition: 'used_good',
                ...analysis.extractedFields
            })

            // Transition
            setTimeout(() => {
                setIsScanning(false)
                setStep(2)
            }, 1200)

        } catch (error) {
            console.error(error)
            setErrors(['AI Analysis failed (Mock). Please try again.'])
            setIsScanning(false)
        }
    }

    const handlePublish = async () => {
        if (!user) {
            setErrors(['Please login to publish'])
            router.push('/login')
            return
        }

        setPublishStatus('publishing')

        try {
            const input: CreateProductInput = {
                title: formData.title,
                description: formData.description,
                category_id: formData.category_id,
                price: formData.price,
                original_price: (formData.price || 0) * 1.2, // Mock logic from preview
                price_type: 'fixed',
                condition: formData.condition || 'used_good',
                stock: 1,
                tags: scanResult?.suggestedTags || [],

                // Mock Location (matching UI)
                province: 'Bangkok',
                amphoe: 'Chatuchak',
                district: 'Chatuchak',
                zipcode: '10900',

                // Mock Shipping
                can_ship: true,
                can_pickup: true,
                shipping_fee: 50,

                images: images
            }

            await createProduct(
                input,
                user.uid,
                user.displayName || 'Seller',
                user.photoURL || ''
            )

            setPublishStatus('done')
            setTimeout(() => router.push('/seller/products'), 1000)

        } catch (error) {
            console.error(error)
            setErrors(['Failed to publish product. Please try again.'])
            setPublishStatus('idle')
        }
    }

    // --- ONE PAGE FORM INTEGRATION ---
    const handleOnePageSubmit = async (data: any) => {
        if (!user) {
            router.push('/login')
            return
        }

        try {
            setPublishStatus('publishing')

            // Common Input Construction
            const input: any = {
                title: data.title,
                description: data.description,
                category_id: data.category_main,
                price: Number(data.price),
                original_price: Number(data.price) * 1.1, // mock
                price_type: 'fixed',
                condition: data.condition,
                stock: Number(data.stock || 1),
                tags: [],
                province: data.province || 'Bangkok',
                amphoe: data.district || '',
                district: data.district || '',
                zipcode: '10900',
                can_ship: data.shipping_methods?.delivery || false,
                can_pickup: data.shipping_methods?.pickup || false,
                shipping_fee: Number(data.shipping_fee || 0),
                images: data.images
            }

            if (editId) {
                // Update Mode
                // Check if updateProduct exists or import it. Assuming it exists in lib/products based on standard patterns.
                // If not, I might need to implement it. But I'll try to use it.
                // Actually, ensure we pass the ID.
                if (typeof updateProduct === 'function') {
                    await updateProduct(editId, input)
                } else {
                    console.warn("updateProduct function not found, creating new instead (FALLBACK)")
                    await createProduct(
                        input as CreateProductInput,
                        user.uid,
                        user.displayName || 'Seller',
                        user.photoURL || ''
                    )
                }
            } else {
                // Create Mode
                await createProduct(
                    input as CreateProductInput,
                    user.uid,
                    user.displayName || 'Seller',
                    user.photoURL || ''
                )
            }

            setPublishStatus('done')
            setTimeout(() => router.push(editId ? `/product/${editId}` : '/seller/products'), 1000)

        } catch (error) {
            console.error(error)
            setErrors(['Failed to publish'])
            setPublishStatus('idle')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            {publishStatus === 'publishing' && (
                <div className="fixed inset-0 z-[60] bg-white/80 dark:bg-black/80 backdrop-blur flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                    <h2 className="text-xl font-bold dark:text-white">Publishing your listing...</h2>
                </div>
            )}
            {publishStatus === 'done' && (
                <div className="fixed inset-0 z-[60] bg-green-50/90 dark:bg-green-900/90 backdrop-blur flex flex-col items-center justify-center text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-100">Success!</h2>
                </div>
            )}

            {isLoadingEdit ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <span className="ml-2 text-gray-500">Loading product details...</span>
                </div>
            ) : (
                <OnePageListingForm
                    initialData={initialData}
                    onSubmit={handleOnePageSubmit}
                    onSaveDraft={() => alert('Draft Saved')}
                    isEditMode={!!editId}
                />
            )}
        </div>
    )
}
