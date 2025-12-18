
'use client'

import { useState, useEffect } from 'react'
import { detectSubcategory } from '@/lib/subcategory-intelligence'

export default function TestDetectionPage() {
    const [title, setTitle] = useState('คีย์บอร์ด TTECH รุ่น XYZ สเปคมาตรฐาน')
    const [result, setResult] = useState<any>(null)

    useEffect(() => {
        runDetection()
    }, [])

    const runDetection = () => {
        const detected = detectSubcategory({
            categoryId: 4,
            title: title,
            description: '',
        })
        setResult(detected)
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Test Subcategory Detection</h1>

            <div className="mb-4">
                <label className="block mb-2">Title Input:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

            <button
                onClick={runDetection}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
            >
                Run Detection
            </button>

            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">Result:</h2>
                <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>Threshold Logic Test:</p>
                <p>Is Thai Key: 'คีย์บอร์ด' length {('คีย์บอร์ด'.length)}</p>
            </div>
        </div>
    )
}
