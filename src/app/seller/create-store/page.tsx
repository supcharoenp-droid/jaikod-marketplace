import StoreSetupWizard from '@/components/store-wizard/StoreSetupWizard'

export const metadata = {
    title: 'สร้างร้านค้า | JaiKod',
    description: 'เริ่มต้นขายสินค้าบน JaiKod ด้วยระบบช่วยสร้างร้านค้าอัจฉริยะ'
}

export default function CreateStorePage() {
    return <StoreSetupWizard />
}
