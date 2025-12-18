import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SafetyBanner() {
    return (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-t border-orange-100 dark:border-orange-800/50 px-4 py-2 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs text-orange-800 dark:text-orange-200">
                <p className="font-semibold mb-0.5">เพื่อความปลอดภัยของคุณ!</p>
                <p>อย่าโอนเงินนอกระบบ หรือคลิกลิงก์ที่ไม่น่าไว้ใจ <a href="#" className="underline decoration-orange-400 hover:text-orange-600">ดูวิธีซื้อขายให้ปลอดภัย</a></p>
            </div>
            <ShieldCheck className="w-4 h-4 text-orange-400 opacity-50" />
        </div>
    );
}
