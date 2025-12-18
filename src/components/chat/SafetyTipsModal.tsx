/**
 * Safety Tips Modal
 * Modal แสดง Safety Tips แบบเต็ม
 */

'use client';

import { X } from 'lucide-react';

interface SafetyTipsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SafetyTipsModal({ isOpen, onClose }: SafetyTipsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        เคล็ดลับความปลอดภัย
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* ก่อนซื้อ */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">
                                1
                            </span>
                            ก่อนซื้อ
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>ตรวจสอบข้อมูลผู้ขายและคะแนนความน่าเชื่อถือ</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>อ่านรีวิวจากผู้ซื้อคนอื่นๆ</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>ถามรายละเอียดสินค้าให้ชัดเจน</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>ขอดูรูปสินค้าจริงเพิ่มเติม</p>
                            </li>
                        </ul>
                    </div>

                    {/* การนัดหมาย */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">
                                2
                            </span>
                            การนัดหมาย
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <p>นัดพบที่สถานที่สาธารณะ เช่น ห้างสรรพสินค้า ร้านกาแฟ</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <p>นัดในเวลากลางวัน</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <p>พาเพื่อนไปด้วย</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <p>แจ้งญาติหรือเพื่อนให้ทราบ</p>
                            </li>
                        </ul>
                    </div>

                    {/* การชำระเงิน */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">
                                3
                            </span>
                            การชำระเงิน
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <p><strong>ห้าม</strong> โอนเงินล่วงหน้าก่อนได้รับสินค้า</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <p>ตรวจสอบสินค้าให้ดีก่อนชำระเงิน</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <p>ใช้ระบบชำระเงินของ JaiKod (ถ้ามี)</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <p>ขอใบเสร็จรับเงิน</p>
                            </li>
                        </ul>
                    </div>

                    {/* การตรวจสอบสินค้า */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">
                                4
                            </span>
                            การตรวจสอบสินค้า
                        </h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>ตรวจสอบสภาพสินค้าให้ตรงกับที่โฆษณา</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>ทดลองใช้งาน (ถ้าเป็นอุปกรณ์อิเล็กทรอนิกส์)</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>ตรวจสอบอุปกรณ์ครบถ้วน</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">•</span>
                                <p>ถ่ายรูปสินค้าไว้เป็นหลักฐาน</p>
                            </li>
                        </ul>
                    </div>

                    {/* สัญญาณเตือน */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3">
                            ⚠️ สัญญาณเตือน - ระวังมิจฉาชีพ
                        </h3>
                        <ul className="space-y-2 text-red-600 dark:text-red-400 text-sm">
                            <li className="flex items-start gap-2">
                                <span>🚫</span>
                                <p>ขอโอนเงินล่วงหน้าทั้งหมด</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>🚫</span>
                                <p>ราคาถูกผิดปกติ</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>🚫</span>
                                <p>รีบเร่งให้ตัดสินใจเร็ว</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>🚫</span>
                                <p>ไม่ยอมพบหน้า</p>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>🚫</span>
                                <p>ข้อมูลไม่ตรงกัน</p>
                            </li>
                        </ul>
                    </div>

                    {/* ติดต่อ JaiKod */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                        <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-2">
                            💬 ต้องการความช่วยเหลือ?
                        </h3>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                            หากพบปัญหาหรือต้องการรายงานผู้ใช้ที่น่าสงสัย กรุณาติดต่อทีมงาน JaiKod
                        </p>
                        <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                            ติดต่อฝ่ายสนับสนุน
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                        เข้าใจแล้ว
                    </button>
                </div>
            </div>
        </div>
    );
}
