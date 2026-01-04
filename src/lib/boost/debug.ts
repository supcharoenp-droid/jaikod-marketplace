/**
 * BOOST DEBUG & TEST SCRIPT
 * 
 * ทดสอบและ debug boost creation
 */

import { createBoost, getBoost } from './boostService'
import { getAccount, getOrCreateAccount } from '../jaistar/account'
import { getPackageById } from './packages'

// ==========================================
// TEST CONFIGURATION
// ==========================================

const TEST_CONFIG = {
    user_id: 'test_user_123',
    listing_id: 'test_listing_456',
    product_id: 'test_product_789',
    seller_id: 'test_seller_abc',
    seller_type: 'individual' as const,
    package_id: 'basic_24h'
}

// ==========================================
// DEBUG FUNCTIONS
// ==========================================

/**
 * Test 1: Check if package exists
 */
export async function testPackageExists() {
    console.log('🧪 Test 1: Checking package...')

    const pkg = getPackageById(TEST_CONFIG.package_id)

    if (!pkg) {
        console.error('❌ FAIL: Package not found:', TEST_CONFIG.package_id)
        return false
    }

    console.log('✅ PASS: Package found:', pkg.name_th)
    console.log('   - Price:', pkg.base_price, '⭐')
    console.log('   - Duration:', pkg.duration_hours, 'hours')
    console.log('   - Available for:', pkg.available_for.join(', '))

    return true
}

/**
 * Test 2: Check if account exists / can be created
 */
export async function testAccountAccess() {
    console.log('\n🧪 Test 2: Checking account access...')

    try {
        // Try to get account
        let account = await getAccount(TEST_CONFIG.user_id)

        if (!account) {
            console.log('⚠️  Account not found, creating...')
            account = await getOrCreateAccount(TEST_CONFIG.user_id)
        }

        console.log('✅ PASS: Account accessible')
        console.log('   - Balance:', account.balance, '⭐')
        console.log('   - Tier:', account.tier)
        console.log('   - Created:', account.created_at)

        return true
    } catch (error) {
        console.error('❌ FAIL: Account error:', error)
        return false
    }
}

/**
 * Test 3: Check balance
 */
export async function testBalance() {
    console.log('\n🧪 Test 3: Checking balance...')

    try {
        const account = await getAccount(TEST_CONFIG.user_id)
        const pkg = getPackageById(TEST_CONFIG.package_id)

        if (!account || !pkg) {
            console.error('❌ FAIL: Account or package not found')
            return false
        }

        const hasEnough = account.balance >= pkg.base_price

        if (!hasEnough) {
            console.log('⚠️  INSUFFICIENT BALANCE')
            console.log('   - Current:', account.balance, '⭐')
            console.log('   - Required:', pkg.base_price, '⭐')
            console.log('   - Need:', pkg.base_price - account.balance, '⭐ more')
            return false
        }

        console.log('✅ PASS: Sufficient balance')
        console.log('   - Balance:', account.balance, '⭐')
        console.log('   - Cost:', pkg.base_price, '⭐')
        console.log('   - After:', account.balance - pkg.base_price, '⭐')

        return true
    } catch (error) {
        console.error('❌ FAIL: Balance check error:', error)
        return false
    }
}

/**
 * Test 4: Try to create boost
 */
export async function testCreateBoost() {
    console.log('\n🧪 Test 4: Creating boost...')

    try {
        const result = await createBoost({
            user_id: TEST_CONFIG.user_id,
            listing_id: TEST_CONFIG.listing_id,
            product_id: TEST_CONFIG.product_id,
            seller_id: TEST_CONFIG.seller_id,
            seller_type: TEST_CONFIG.seller_type,
            package_id: TEST_CONFIG.package_id
        })

        if (!result.success) {
            console.error('❌ FAIL: Boost creation failed')
            console.error('   - Error code:', result.error?.code)
            console.error('   - Message:', result.error?.message)
            return false
        }

        console.log('✅ PASS: Boost created successfully!')
        console.log('   - Boost ID:', result.boost_id)
        console.log('   - Transaction ID:', result.transaction_id)
        console.log('   - Amount paid:', result.amount_paid, '⭐')
        console.log('   - Discount:', result.discount_applied, '⭐')
        console.log('   - Started:', result.started_at)
        console.log('   - Expires:', result.expires_at)
        console.log('   - New balance:', result.new_balance, '⭐')

        return true
    } catch (error) {
        console.error('❌ FAIL: Unexpected error:', error)
        return false
    }
}

/**
 * Test 5: Verify boost was created
 */
export async function testVerifyBoost(boostId: string) {
    console.log('\n🧪 Test 5: Verifying boost...')

    try {
        const boost = await getBoost(boostId)

        if (!boost) {
            console.error('❌ FAIL: Boost not found in database')
            return false
        }

        console.log('✅ PASS: Boost verified in database')
        console.log('   - ID:', boost.id)
        console.log('   - Listing:', boost.listing_id)
        console.log('   - Status:', boost.status)
        console.log('   - Package:', boost.package_name)

        return true
    } catch (error) {
        console.error('❌ FAIL: Verification error:', error)
        return false
    }
}

// ==========================================
// RUN ALL TESTS
// ==========================================

export async function runAllTests() {
    console.log('🚀 BOOST DEBUG & TEST SUITE')
    console.log('='.repeat(50))
    console.log()

    const results = {
        package: false,
        account: false,
        balance: false,
        create: false,
        verify: false
    }

    // Test 1: Package
    results.package = await testPackageExists()

    // Test 2: Account
    results.account = await testAccountAccess()

    // Test 3: Balance
    if (results.account) {
        results.balance = await testBalance()
    }

    // Test 4: Create boost (only if previous tests pass)
    let boostId: string | undefined
    if (results.package && results.account && results.balance) {
        results.create = await testCreateBoost()
        // Get boost ID for verification
        // (You'd need to modify this to capture the boost ID)
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 TEST SUMMARY:')
    console.log('='.repeat(50))
    console.log()
    console.log('1. Package check:', results.package ? '✅ PASS' : '❌ FAIL')
    console.log('2. Account access:', results.account ? '✅ PASS' : '❌ FAIL')
    console.log('3. Balance check:', results.balance ? '✅ PASS' : '❌ FAIL')
    console.log('4. Boost creation:', results.create ? '✅ PASS' : '❌ FAIL')

    const passedTests = Object.values(results).filter(r => r).length
    const totalTests = Object.keys(results).length

    console.log()
    console.log(`Overall: ${passedTests}/${totalTests} tests passed`)

    if (passedTests === totalTests) {
        console.log('\n🎉 ALL TESTS PASSED! Boost system is working!')
    } else {
        console.log('\n⚠️  SOME TESTS FAILED - see details above')
    }

    return results
}

// ==========================================
// QUICK FIX FUNCTIONS
// ==========================================

/**
 * Add test balance to user
 */
export async function addTestBalance(userId: string, amount: number = 1000) {
    console.log(`\n💰 Adding ${amount} ⭐ to ${userId}...`)

    try {
        const { addStars } = await import('../jaistar/account')
        const result = await addStars(userId, amount, false)

        if (result.success) {
            console.log('✅ Balance added successfully')
            console.log('   - New balance:', result.new_balance, '⭐')
        } else {
            console.error('❌ Failed to add balance:', result.error)
        }

        return result
    } catch (error) {
        console.error('❌ Error adding balance:', error)
        return { success: false, new_balance: 0, error: String(error) }
    }
}

/**
 * Reset test data
 */
export async function resetTestData() {
    console.log('\n🔄 Resetting test data...')
    // Implementation depends on your cleanup needs
    console.log('⚠️  Not implemented yet')
}

// ==========================================
// EXPORT FOR CLI USE
// ==========================================

export const boostDebug = {
    runAllTests,
    testPackageExists,
    testAccountAccess,
    testBalance,
    testCreateBoost,
    addTestBalance,
    resetTestData
}
