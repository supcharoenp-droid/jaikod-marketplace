#!/usr/bin/env ts-node

/**
 * RUN INTEGRATION TESTS
 * 
 * Quick script to run integration tests from command line
 */

import { runIntegrationTests } from '../src/lib/integration-tests'

console.log('🚀 Starting Integration Tests...\n')

try {
    const results = runIntegrationTests()

    // Exit with appropriate code
    process.exit(results.failed === 0 ? 0 : 1)
} catch (error) {
    console.error('❌ Error running tests:', error)
    process.exit(1)
}
