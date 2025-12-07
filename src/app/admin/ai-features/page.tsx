/**
 * AI Features Control Panel
 * หน้า Admin สำหรับควบคุมเปิด-ปิดฟีเจอร์ AI
 */

'use client';

import { useState } from 'react';
import {
    DEFAULT_AI_CONFIG,
    type AIFeatureConfig,
    type AIFeature,
    isFeatureEnabled,
    calculateMonthlyCost,
    getFeaturesByPhase,
    enableFeature,
    disableFeature,
    updateBudgetLimit,
    shouldAlert,
    isOverBudget,
} from '@/config/ai-features';

export default function AIFeaturesControlPanel() {
    const [config, setConfig] = useState<AIFeatureConfig>(DEFAULT_AI_CONFIG);
    const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');

    const monthlyCost = calculateMonthlyCost(config);
    const budgetUsage = (monthlyCost / config.globalSettings.budgetLimit) * 100;

    // Toggle Feature
    const handleToggleFeature = (featureId: string) => {
        const feature = config.features[featureId];
        if (feature.enabled) {
            setConfig(disableFeature(featureId, config));
        } else {
            setConfig(enableFeature(featureId, config));
        }
    };

    // Get features to display
    const featuresToDisplay =
        selectedPhase === 'all'
            ? Object.values(config.features)
            : getFeaturesByPhase(selectedPhase as number, config);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">🎛️ AI Features Control Panel</h1>
                    <p className="text-gray-600">
                        ควบคุมเปิด-ปิดฟีเจอร์ AI ทั้งหมด เพื่อประหยัดค่าใช้จ่าย
                    </p>
                </div>

                {/* Budget Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">💰 งบประมาณ</h2>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">ค่าใช้จ่ายปัจจุบัน</div>
                            <div className="text-2xl font-bold text-blue-600">
                                ${monthlyCost.toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">งบประมาณ</div>
                            <div className="text-2xl font-bold text-purple-600">
                                ${config.globalSettings.budgetLimit}
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg ${budgetUsage >= 100 ? 'bg-red-50' :
                                budgetUsage >= 80 ? 'bg-yellow-50' :
                                    'bg-green-50'
                            }`}>
                            <div className="text-sm text-gray-600">การใช้งาน</div>
                            <div className={`text-2xl font-bold ${budgetUsage >= 100 ? 'text-red-600' :
                                    budgetUsage >= 80 ? 'text-yellow-600' :
                                        'text-green-600'
                                }`}>
                                {budgetUsage.toFixed(1)}%
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">คงเหลือ</div>
                            <div className="text-2xl font-bold text-gray-600">
                                ${(config.globalSettings.budgetLimit - monthlyCost).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className={`h-full transition-all ${budgetUsage >= 100 ? 'bg-red-500' :
                                    budgetUsage >= 80 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                }`}
                            style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                        />
                    </div>

                    {/* Alerts */}
                    {isOverBudget(monthlyCost, config) && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🚨</span>
                                <div>
                                    <div className="font-semibold text-red-800">เกินงบประมาณ!</div>
                                    <div className="text-sm text-red-600">
                                        กรุณาปิดฟีเจอร์บางอย่างหรือเพิ่มงบประมาณ
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {shouldAlert(monthlyCost, config) && !isOverBudget(monthlyCost, config) && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <div className="font-semibold text-yellow-800">ใกล้เกินงบประมาณ</div>
                                    <div className="text-sm text-yellow-600">
                                        ใช้งบไปแล้ว {budgetUsage.toFixed(1)}% ควรระมัดระวัง
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Budget Settings */}
                    <div className="mt-4 flex items-center space-x-4">
                        <label className="font-semibold">ตั้งงบประมาณ:</label>
                        <input
                            type="number"
                            value={config.globalSettings.budgetLimit}
                            onChange={(e) => setConfig(updateBudgetLimit(Number(e.target.value), config))}
                            className="px-4 py-2 border rounded-lg w-32"
                        />
                        <span className="text-gray-600">USD/เดือน</span>
                    </div>
                </div>

                {/* Phase Filter */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">🔍 กรองตาม Phase</h2>
                    <div className="flex space-x-2">
                        {[
                            { value: 'all', label: 'ทั้งหมด', color: 'gray' },
                            { value: 1, label: 'Phase 1: Free', color: 'green' },
                            { value: 2, label: 'Phase 2: Low Cost', color: 'blue' },
                            { value: 3, label: 'Phase 3: Medium', color: 'purple' },
                            { value: 4, label: 'Phase 4: Premium', color: 'red' },
                        ].map((phase) => (
                            <button
                                key={phase.value}
                                onClick={() => setSelectedPhase(phase.value as any)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedPhase === phase.value
                                        ? `bg-${phase.color}-500 text-white`
                                        : `bg-${phase.color}-100 text-${phase.color}-700 hover:bg-${phase.color}-200`
                                    }`}
                            >
                                {phase.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Features List */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">
                        🎯 ฟีเจอร์ทั้งหมด ({featuresToDisplay.length} รายการ)
                    </h2>

                    <div className="space-y-4">
                        {featuresToDisplay.map((feature) => {
                            const enabled = isFeatureEnabled(feature.id, config);
                            const hasUnmetDeps = feature.dependencies?.some(
                                (depId) => !config.features[depId]?.enabled
                            );

                            return (
                                <div
                                    key={feature.id}
                                    className={`border-2 rounded-lg p-4 transition-all ${enabled
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        {/* Feature Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold">{feature.name}</h3>

                                                {/* Phase Badge */}
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${feature.phase === 1 ? 'bg-green-100 text-green-700' :
                                                        feature.phase === 2 ? 'bg-blue-100 text-blue-700' :
                                                            feature.phase === 3 ? 'bg-purple-100 text-purple-700' :
                                                                'bg-red-100 text-red-700'
                                                    }`}>
                                                    Phase {feature.phase}
                                                </span>

                                                {/* Status Badge */}
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${enabled
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-300 text-gray-700'
                                                    }`}>
                                                    {enabled ? '✅ เปิด' : '❌ ปิด'}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-2">
                                                {feature.description}
                                            </p>

                                            {/* Cost Info */}
                                            <div className="flex items-center space-x-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">ค่าใช้จ่าย:</span>{' '}
                                                    <span className="font-semibold">
                                                        ${feature.cost.monthly}/เดือน
                                                    </span>
                                                    {feature.cost.perRequest && (
                                                        <span className="text-gray-500">
                                                            {' '}+ ${feature.cost.perRequest}/request
                                                        </span>
                                                    )}
                                                </div>

                                                {feature.limits?.maxRequests && (
                                                    <div>
                                                        <span className="text-gray-600">จำกัด:</span>{' '}
                                                        <span className="font-semibold">
                                                            {feature.limits.maxRequests.toLocaleString()} requests
                                                        </span>
                                                    </div>
                                                )}

                                                {feature.limits?.budgetLimit && (
                                                    <div>
                                                        <span className="text-gray-600">งบประมาณ:</span>{' '}
                                                        <span className="font-semibold">
                                                            ${feature.limits.budgetLimit}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Dependencies */}
                                            {feature.dependencies && feature.dependencies.length > 0 && (
                                                <div className="mt-2 text-sm">
                                                    <span className="text-gray-600">ต้องการ:</span>{' '}
                                                    {feature.dependencies.map((depId, idx) => (
                                                        <span key={depId}>
                                                            <span className={
                                                                config.features[depId]?.enabled
                                                                    ? 'text-green-600 font-semibold'
                                                                    : 'text-red-600 font-semibold'
                                                            }>
                                                                {config.features[depId]?.name}
                                                            </span>
                                                            {idx < feature.dependencies!.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Warning */}
                                            {hasUnmetDeps && (
                                                <div className="mt-2 text-sm text-red-600">
                                                    ⚠️ ต้องเปิดฟีเจอร์ที่ต้องการก่อน
                                                </div>
                                            )}
                                        </div>

                                        {/* Toggle Switch */}
                                        <div className="ml-4">
                                            <button
                                                onClick={() => handleToggleFeature(feature.id)}
                                                disabled={hasUnmetDeps && !enabled}
                                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'
                                                    } ${hasUnmetDeps && !enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span
                                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h2 className="text-xl font-bold mb-4">📊 สรุป</h2>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {Object.values(config.features).filter(f => f.enabled).length}
                            </div>
                            <div className="text-sm text-gray-600">ฟีเจอร์ที่เปิด</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-600">
                                {Object.values(config.features).filter(f => !f.enabled).length}
                            </div>
                            <div className="text-sm text-gray-600">ฟีเจอร์ที่ปิด</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                ${monthlyCost.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">ค่าใช้จ่ายรวม</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {budgetUsage.toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-600">การใช้งบ</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
