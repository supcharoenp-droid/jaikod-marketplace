export default function ListingDetailLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
            {/* Header Skeleton */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-20 bg-slate-700 rounded animate-pulse"></div>
                        <span className="text-gray-600">/</span>
                        <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                        <span className="text-gray-600">/</span>
                        <div className="h-4 w-40 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                </div>
            </header>

            {/* Main Content Skeleton */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Image Gallery Skeleton */}
                        <div className="aspect-[4/3] bg-slate-800 rounded-xl animate-pulse"></div>

                        {/* Thumbnails */}
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-16 h-16 bg-slate-800 rounded-lg animate-pulse"></div>
                            ))}
                        </div>

                        {/* Description Skeleton */}
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <div className="h-6 w-32 bg-slate-700 rounded mb-4 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                            </div>
                        </div>

                        {/* Quick Facts Skeleton */}
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <div className="h-6 w-32 bg-slate-700 rounded mb-4 animate-pulse"></div>
                            <div className="grid grid-cols-5 gap-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                                        <div className="h-6 w-6 bg-slate-700 rounded mx-auto mb-2 animate-pulse"></div>
                                        <div className="h-3 bg-slate-700 rounded mb-1 animate-pulse"></div>
                                        <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Info Card Skeleton */}
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <div className="flex justify-between mb-3">
                                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-4 w-32 bg-slate-700 rounded animate-pulse"></div>
                            </div>

                            <div className="h-8 w-3/4 bg-slate-700 rounded mb-2 animate-pulse"></div>
                            <div className="h-6 w-1/2 bg-slate-700 rounded mb-4 animate-pulse"></div>

                            <div className="flex gap-2 mb-4">
                                <div className="h-6 w-20 bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="h-6 w-16 bg-slate-700 rounded-full animate-pulse"></div>
                            </div>

                            <div className="h-10 w-full bg-slate-700 rounded mb-3 animate-pulse"></div>

                            <div className="flex gap-4 mb-4">
                                <div className="h-4 w-16 bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-4 w-12 bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-4 w-12 bg-slate-700 rounded animate-pulse"></div>
                            </div>

                            <div className="flex gap-3 mb-4">
                                <div className="h-12 flex-1 bg-slate-700 rounded-xl animate-pulse"></div>
                                <div className="h-12 flex-1 bg-slate-700 rounded-xl animate-pulse"></div>
                            </div>

                            <div className="h-12 w-full bg-slate-700 rounded-xl mb-3 animate-pulse"></div>
                            <div className="h-12 w-full bg-purple-500/30 rounded-xl animate-pulse"></div>
                        </div>

                        {/* Seller Card Skeleton */}
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="h-5 w-32 bg-slate-700 rounded mb-2 animate-pulse"></div>
                                    <div className="h-4 w-24 bg-slate-700 rounded mb-1 animate-pulse"></div>
                                    <div className="h-4 w-40 bg-slate-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <div className="h-10 flex-1 bg-slate-700 rounded-lg animate-pulse"></div>
                                <div className="h-10 w-24 bg-slate-700 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
