import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
    db: {},
    auth: {},
    storage: {}
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn()
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams()
}))

// Mock localStorage with actual storage
const localStorageStore: Record<string, string> = {}
const localStorageMock = {
    getItem: vi.fn((key: string) => localStorageStore[key] || null),
    setItem: vi.fn((key: string, value: string) => {
        localStorageStore[key] = value
    }),
    removeItem: vi.fn((key: string) => {
        delete localStorageStore[key]
    }),
    clear: vi.fn(() => {
        Object.keys(localStorageStore).forEach(key => delete localStorageStore[key])
    }),
    key: vi.fn((index: number) => Object.keys(localStorageStore)[index] || null),
    get length() {
        return Object.keys(localStorageStore).length
    }
}
global.localStorage = localStorageMock as any

// Mock sessionStorage
global.sessionStorage = localStorageMock as any

// Mock window.navigator.geolocation
const mockGeolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn()
}
Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true
})
