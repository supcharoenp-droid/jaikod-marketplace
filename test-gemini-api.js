// Quick Test Script - ทดสอบ Gemini API
// วิธีใช้: เปิด Console (F12) แล้ว copy-paste script นี้ลงไป

async function testGeminiAPI() {
    const apiKey = 'AIzaSyCfydnZbTDde-FMNyzeTtC1rQthNgclX9U' // ใช้ key จาก .env.local

    console.log('🧪 Testing Gemini API...')
    console.log('API Key:', apiKey.substring(0, 20) + '...')

    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(apiKey)

        // Test with simple text generation
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

        console.log('📤 Sending test request...')
        const result = await model.generateContent('Say hello in Thai')
        const response = await result.response
        const text = response.text()

        console.log('✅ SUCCESS!')
        console.log('📝 Response:', text)
        console.log('🎉 Gemini API is working!')

    } catch (error) {
        console.error('❌ ERROR:', error.message)
        console.error('Full error:', error)

        if (error.message.includes('404')) {
            console.log('💡 Model not found. Available models:')
            console.log('- gemini-pro (text only)')
            console.log('- gemini-1.5-pro (multimodal)')
            console.log('- gemini-1.5-flash (multimodal, faster)')
        }

        if (error.message.includes('API key')) {
            console.log('💡 API Key issue. Check:')
            console.log('1. API key is correct')
            console.log('2. API key is enabled')
            console.log('3. Billing is enabled (if required)')
        }
    }
}

// Run test
testGeminiAPI()
