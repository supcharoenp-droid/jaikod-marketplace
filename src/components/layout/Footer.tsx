'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Sparkles } from 'lucide-react'

export default function Footer() {
    const { t, language } = useLanguage()

    const currentYear = language === 'th' ? '2568' : '2025'

    return (
        <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white mt-20 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                JaiKod
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            {t('footer.about_desc')}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group">
                                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group">
                                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group">
                                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-sky-400 transition-colors" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group">
                                <Youtube className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* About Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            {t('footer.about_us')}
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.about_link')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.how_it_works')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/safety" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.safety')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.fees')}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {t('footer.help')}
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.faq')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.contact')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.terms')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.privacy')}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* AI Features Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            {t('footer.ai_features')}
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/ai/snap-and-sell" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                                    <span className="text-lg">📸</span>
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.ai_snap')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/price-suggestion" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                                    <span className="text-lg">💰</span>
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.ai_price')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/trust-score" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                                    <span className="text-lg">🛡️</span>
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.ai_trust')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/search" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                                    <span className="text-lg">🔍</span>
                                    <span className="group-hover:translate-x-1 transition-transform">{t('footer.ai_search')}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Bar */}
                <div className="mt-12 py-6 border-t border-white/10">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                        <a href="mailto:hello@jaikod.com" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Mail className="w-4 h-4" />
                            hello@jaikod.com
                        </a>
                        <a href="tel:+6620001234" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Phone className="w-4 h-4" />
                            02-000-1234
                        </a>
                        <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Bangkok, Thailand
                        </span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © {currentYear} JaiKod. {language === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved.'}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                {t('footer.made_with')}
                            </span>
                            <span className="text-gray-700">•</span>
                            <span className="flex items-center gap-1">
                                {t('footer.powered_by')} <span className="text-lg">🤖</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
