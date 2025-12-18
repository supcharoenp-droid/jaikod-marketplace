'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-display font-semibold mb-4 text-gradient">
                            JaiKod
                        </h3>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
                            {t('footer.about_desc')}
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <span className="text-2xl">📘</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <span className="text-2xl">📷</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <span className="text-2xl">🐦</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">{t('footer.about_us')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.about_link')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.how_it_works')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/safety" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.safety')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.fees')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4">{t('footer.help')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/faq" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.faq')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.contact')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.terms')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.privacy')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* AI Features */}
                    <div>
                        <h4 className="font-semibold mb-4">{t('footer.ai_features')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/ai/snap-and-sell" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.ai_snap')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/price-suggestion" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.ai_price')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/trust-score" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.ai_trust')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/search" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    {t('footer.ai_search')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                            {t('footer.copyright')}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-gray-400">
                            <span>{t('footer.made_with')}</span>
                            <span>•</span>
                            <span>{t('footer.powered_by')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
