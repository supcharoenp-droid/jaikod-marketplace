# 🎯 Quick Start Guide - AI Smart Listing Flow

## For Developers

### 1. Run the Application
```bash
npm run dev
```

### 2. Navigate to Sell Page
```
http://localhost:3000/sell
```

### 3. Test the Flow

#### Step 1: Upload Images
- Click or drag images (JPEG, PNG)
- Upload 1-10 images
- First image = cover photo

#### Step 2: AI Analysis
- Wait for AI to analyze (auto-runs)
- Check quality scores
- Try "Enhance" or "Remove BG" buttons

#### Step 3: Enter Title & Price
- Type product title (triggers AI suggestions)
- Use AI-generated titles
- Select from 3 pricing options

#### Step 4: Select Category
- AI auto-predicts category
- Or manually select
- Confidence score shown

#### Step 5: Fill Details
- Form fields based on category
- Enter specific attributes
- Add description

#### Step 6: Location & Shipping
- Select Thai address (cascading)
- Choose shipping methods
- See AI recommendations

#### Step 7: Compliance Check
- AI scans for issues
- Review warnings/errors
- Fix problems if needed

#### Step 8: Preview & Publish
- See buyability score
- Review strengths/improvements
- Check sales potential
- Click "Publish"!

## For Product Managers

### Key Metrics to Track

1. **Completion Rate**: % of users finishing all 8 steps
2. **Drop-off Points**: Which step loses most users
3. **AI Acceptance**: How often users use AI suggestions
4. **Time Per Step**: Average time spent on each step
5. **Buyability Scores**: Distribution of final scores

### A/B Testing Opportunities

- **Title Variations**: Test different AI suggestion styles
- **Price Anchoring**: Test order of price options
- **Step Order**: Test different sequences
- **Visual vs. Text**: Test instruction formats

## For UI/UX Designers

### Design Tokens

**Colors by Step**:
1. Blue (Images)
2. Purple (Analysis)
3. Green (Title/Price)
4. Orange (Category)
5. Indigo (Details)
6. Teal (Location)
7. Red (Compliance)
8. Pink (Preview)

**Animations**:
- Step transition: 300ms ease
- Loading spinners: Continuous rotation
- Success checkmarks: Scale + fade
- Error shake: Horizontal vibration

### Accessibility

- High contrast ratios
- Keyboard navigation supported
- Screen reader friendly
- Clear error messages
- Loading states announced

## Language Switching

**Auto-Detection Logic**:
```typescript
// Thai detected if title contains Thai characters
const thaiPattern = /[\u0E00-\u0E7F]/
if (thaiPattern.test(title)) {
    language = 'th'
} else {
    language = 'en'
}
```

**Manual Toggle**: 
- Top-right language button
- Persists through flow
- All UI updates instantly

## Common Issues & Solutions

### Issue: Images not uploading
**Solution**: Check file size (<10MB) and format (JPG, PNG, HEIC)

### Issue: Cannot proceed to next step
**Solution**: Check validation - fill required fields

### Issue: AI taking too long
**Solution**: Mock delays are intentional (see services). In production, these will be real API calls.

### Issue: Category not detected correctly
**Solution**: Manually select from grid. AI learns from corrections.

### Issue: Buyability score low
**Solution**: Follow improvement suggestions in Step 8

## Testing Scenarios

### Happy Path
1. Upload 5 quality images
2. Use AI title (professional style)
3. Use market price
4. Accept AI category
5. Fill all fields
6. Select Bangkok location
7. Pass compliance
8. See 85+ score
9. Publish successfully

### Edge Cases
1. **Single image**: Should proceed but suggest more
2. **Blurry images**: Should warn in Step 2
3. **No title**: Cannot proceed to Step 4
4. **Prohibited words**: Blocked in Step 7
5. **Incomplete address**: Cannot proceed to Step 7

## API Integration Checklist

When replacing mocks with real AI:

- [ ] Image quality API (Google Vision / AWS Rekognition)
- [ ] Background removal API (remove.bg)
- [ ] Image enhancement API (Cloudinary / Imgix)
- [ ] Title generation API (GPT-4 / Claude)
- [ ] Price prediction API (ML model / market data)
- [ ] Category classification API (Custom ML model)
- [ ] Compliance checking API (OpenAI Moderation)
- [ ] Text analysis API (sentiment, keywords)

## Performance Benchmarks

Target metrics:
- **Time to First Interaction**: < 2s
- **Step Transition**: < 300ms
- **AI Response**: < 3s
- **Image Upload**: < 1s per image
- **Total Flow Completion**: < 3 minutes

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Optimizations

- Touch-friendly buttons (min 44x44px)
- Simplified multi-column layouts
- Bottom sheet modals
- Swipe gestures between steps
- Native camera integration

## Deployment Notes

### Environment Variables Needed
```env
NEXT_PUBLIC_VISION_API_KEY=xxx
NEXT_PUBLIC_GEMINI_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
```

### Build Command
```bash
npm run build
```

### Production Checks
- [ ] Remove console.logs
- [ ] Replace mock delays with real APIs
- [ ] Enable error tracking (Sentry)
- [ ] Set up analytics (GA4 / Mixpanel)
- [ ] Configure CDN for images
- [ ] Enable compression
- [ ] Set up monitoring

## Support & Feedback

For issues or suggestions:
1. Check documentation (AI_SMART_LISTING_FLOW.md)
2. Review code comments
3. Test in isolation
4. Contact dev team

---

**Ready to sell! 🚀**
