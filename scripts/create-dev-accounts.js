/**
 * Create Dev Test Accounts in Firebase
 * 
 * Usage:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download serviceAccountKey.json from Firebase Console
 * 3. Place it in scripts/ folder
 * 4. Run: node scripts/create-dev-accounts.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized\n');
} catch (error) {
    console.error('❌ Error: serviceAccountKey.json not found!');
    console.log('\nPlease:');
    console.log('1. Go to Firebase Console');
    console.log('2. Project Settings → Service Accounts');
    console.log('3. Generate New Private Key');
    console.log('4. Save as scripts/serviceAccountKey.json\n');
    process.exit(1);
}

// Test Accounts
const DEV_ACCOUNTS = [
    {
        email: 'admin@jaikod.com',
        password: 'admin123',
        displayName: 'Super Admin',
        role: 'admin',
        level: 'super_admin'
    },
    {
        email: 'proseller@jaikod.com',
        password: 'seller123',
        displayName: 'Pro Seller',
        role: 'seller',
        level: 5
    },
    {
        email: 'newseller@jaikod.com',
        password: 'seller123',
        displayName: 'New Seller',
        role: 'seller',
        level: 1
    },
    {
        email: 'buyer@jaikod.com',
        password: 'buyer123',
        displayName: 'Active Buyer',
        role: 'buyer',
        level: 'active'
    },
    {
        email: 'newuser@jaikod.com',
        password: 'user123',
        displayName: 'New User',
        role: 'buyer',
        level: 'new'
    },
    {
        email: 'hybrid@jaikod.com',
        password: 'hybrid123',
        displayName: 'Hybrid User',
        role: 'hybrid',
        level: 3
    }
];

async function createDevAccounts() {
    console.log('🚀 Creating dev test accounts...\n');

    for (const account of DEV_ACCOUNTS) {
        try {
            // Check if user already exists
            try {
                const existingUser = await admin.auth().getUserByEmail(account.email);
                console.log(`⚠️  ${account.email} already exists (UID: ${existingUser.uid})`);
                continue;
            } catch (error) {
                // User doesn't exist, continue to create
            }

            // Create user in Firebase Authentication
            const userRecord = await admin.auth().createUser({
                email: account.email,
                password: account.password,
                displayName: account.displayName,
                emailVerified: true
            });

            console.log(`✅ Created: ${account.email}`);
            console.log(`   UID: ${userRecord.uid}`);
            console.log(`   Display Name: ${account.displayName}`);

            // Create user profile in Firestore
            await admin.firestore().collection('users').doc(userRecord.uid).set({
                email: account.email,
                displayName: account.displayName,
                role: account.role,
                level: account.level,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`   📄 Profile created in Firestore`);

            // If admin, create admin document
            if (account.role === 'admin') {
                await admin.firestore().collection('admins').doc(userRecord.uid).set({
                    email: account.email,
                    displayName: account.displayName,
                    role: account.level,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`   🛡️  Admin document created`);
            }

            // If seller, create seller profile
            if (account.role === 'seller' || account.role === 'hybrid') {
                await admin.firestore().collection('seller_profiles').doc(userRecord.uid).set({
                    user_id: userRecord.uid,
                    name: `${account.displayName}'s Shop`,
                    description: `Test shop for ${account.displayName}`,
                    level: account.level,
                    onboarding_progress: account.level === 5 ? 7 : 0,
                    verified: account.level === 5,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`   🏪 Seller profile created`);
            }

            console.log('');

        } catch (error) {
            console.error(`❌ Error creating ${account.email}:`, error.message);
            console.log('');
        }
    }

    console.log('\n🎉 Done! All dev accounts created.\n');
    console.log('📋 Summary:');
    console.log('━'.repeat(50));
    DEV_ACCOUNTS.forEach(account => {
        console.log(`${account.displayName.padEnd(20)} ${account.email.padEnd(30)} ${account.password}`);
    });
    console.log('━'.repeat(50));
    console.log('\n✨ You can now use these accounts at:');
    console.log('   http://localhost:3000/dev-login\n');
}

// Run
createDevAccounts()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
