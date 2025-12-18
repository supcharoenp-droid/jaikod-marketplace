/**
 * Draggable Image Grid Component
 * 
 * ลากย้ายรูปภาพเพื่อเปลี่ยนลำดับ - แก้ไขให้รูปไม่ตกกรอบ
 */

'use client'

import React from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, GripVertical } from 'lucide-react'

interface SortableImageProps {
    file: File
    index: number
    onRemove: () => void
    onCrop?: () => void
    analysisGrade?: string
    analysisScore?: number
}

function SortableImage({ file, index, onRemove, onCrop, analysisGrade, analysisScore }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: `image-${index}` })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative aspect-square rounded-lg overflow-hidden group border-2 ${index === 0 ? 'border-purple-500' : 'border-gray-200'
                } ${isDragging ? 'z-50 shadow-2xl' : ''} bg-gray-100 dark:bg-gray-800`}
        >
            <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-contain"
            />

            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-1 left-1 p-1 bg-black/50 text-white rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Main Badge */}
            {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-bold shadow-lg">
                    หลัก
                </div>
            )}

            {/* AI Grade Badge */}
            {analysisGrade && analysisScore !== undefined && (
                <div
                    className={`absolute top-1 right-10 px-2 py-0.5 rounded text-xs font-bold shadow-lg ${analysisGrade === 'A'
                            ? 'bg-green-500 text-white'
                            : analysisGrade === 'B'
                                ? 'bg-blue-500 text-white'
                                : analysisGrade === 'C'
                                    ? 'bg-yellow-500 text-white'
                                    : analysisGrade === 'D'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-red-500 text-white'
                        }`}
                >
                    {analysisGrade} {analysisScore}
                </div>
            )}

            {/* Crop Button (Optional) */}
            {onCrop && (
                <button
                    onClick={onCrop}
                    className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700 shadow-lg"
                >
                    ✂️ ตัด
                </button>
            )}
        </div>
    )
}

interface DraggableImageGridProps {
    images: File[]
    onReorder: (newImages: File[]) => void
    onRemove: (index: number) => void
    onCrop?: (index: number) => void
    imageAnalysis?: Array<{ grade: string; score: number }>
}

export default function DraggableImageGrid({
    images,
    onReorder,
    onRemove,
    onCrop,
    imageAnalysis = []
}: DraggableImageGridProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = parseInt(active.id.toString().replace('image-', ''))
            const newIndex = parseInt(over.id.toString().replace('image-', ''))

            const newImages = arrayMove(images, oldIndex, newIndex)
            onReorder(newImages)
        }
    }

    if (images.length === 0) {
        return null
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((_, i) => `image-${i}`)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {images.map((img, idx) => (
                        <SortableImage
                            key={`image-${idx}`}
                            file={img}
                            index={idx}
                            onRemove={() => onRemove(idx)}
                            onCrop={onCrop ? () => onCrop(idx) : undefined}
                            analysisGrade={imageAnalysis[idx]?.grade}
                            analysisScore={imageAnalysis[idx]?.score}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
