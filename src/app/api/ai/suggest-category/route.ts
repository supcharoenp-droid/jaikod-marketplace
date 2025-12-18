
import { NextResponse } from 'next/server';
import { suggestCategoryPro } from '@/lib/ai-category-classifier';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, current_category_id } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const result = await suggestCategoryPro({
            title,
            current_category_id: current_category_id ? Number(current_category_id) : undefined
        });

        // Ensure we return the EXACT structure required
        return NextResponse.json(result);
    } catch (error) {
        console.error('AI Category Suggestion Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
