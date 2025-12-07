/**
 * Create Admin Users Script
 * Run this in Firebase Functions or Node.js with Firebase Admin SDK
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            // Add your service account key here
            // Or use: require('./serviceAccountKey.json')
        })
    });
}

const db = admin.firestore();
const auth = admin.auth();

/**
 * Create a single admin user
 */
async function createAdmin(config) {
    const { email, password, displayName, role, department } = config;

    try {
        console.log(`\n🔄 Creating ${role}...`);

        // 1. Create Authentication User
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: displayName,
            emailVerified: true
        });

        console.log(`✅ Auth User Created: ${userRecord.uid}`);

        // 2. Create Admin Document in Firestore
        await db.collection('admins').doc(userRecord.uid).set({
            email: email,
            displayName: displayName,
            role: role,
            permissions: [], // Will be determined by role
            department: department || 'General',
            is_active: true,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            created_by: 'system',
            last_login: null
        });

        console.log(`✅ Firestore Document Created`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`👤 Role: ${role}`);
        console.log(`✨ Status: Active`);

        return userRecord.uid;

    } catch (error) {
        console.error(`❌ Error creating ${role}:`, error.message);
        throw error;
    }
}

/**
 * Create all admin users at once
 */
async function createAllAdmins() {
    console.log('🚀 Starting Admin User Creation...\n');
    console.log('='.repeat(60));

    const admins = [
        {
            email: 'superadmin@jaikod.com',
            password: 'SuperAdmin123!@#',
            displayName: 'Super Admin',
            role: 'super_admin',
            department: 'Executive'
        },
        {
            email: 'manager@jaikod.com',
            password: 'Manager123!@#',
            displayName: 'Admin Manager',
            role: 'admin_manager',
            department: 'Management'
        },
        {
            email: 'operations@jaikod.com',
            password: 'Operations123!@#',
            displayName: 'Operations Admin',
            role: 'operations_admin',
            department: 'Operations'
        },
        {
            email: 'finance@jaikod.com',
            password: 'Finance123!@#',
            displayName: 'Finance Admin',
            role: 'finance_admin',
            department: 'Finance'
        },
        {
            email: 'moderator@jaikod.com',
            password: 'Moderator123!@#',
            displayName: 'Content Moderator',
            role: 'content_moderator',
            department: 'Content'
        },
        {
            email: 'analyst@jaikod.com',
            password: 'Analyst123!@#',
            displayName: 'Data Analyst',
            role: 'data_analyst',
            department: 'Analytics'
        },
        {
            email: 'support@jaikod.com',
            password: 'Support123!@#',
            displayName: 'Customer Support',
            role: 'customer_support',
            department: 'Support'
        }
    ];

    const results = [];

    for (const adminConfig of admins) {
        try {
            const uid = await createAdmin(adminConfig);
            results.push({ success: true, role: adminConfig.role, uid });
        } catch (error) {
            results.push({ success: false, role: adminConfig.role, error: error.message });
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY\n');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successful: ${successful.length}/${admins.length}`);
    console.log(`❌ Failed: ${failed.length}/${admins.length}`);

    if (failed.length > 0) {
        console.log('\n❌ Failed Roles:');
        failed.forEach(f => {
            console.log(`   - ${f.role}: ${f.error}`);
        });
    }

    console.log('\n🎉 Admin creation process completed!');
    console.log('='.repeat(60));

    return results;
}

/**
 * Update existing admin role
 */
async function updateAdminRole(email, newRole) {
    try {
        const userRecord = await auth.getUserByEmail(email);
        await db.collection('admins').doc(userRecord.uid).update({
            role: newRole,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Updated ${email} to ${newRole}`);
    } catch (error) {
        console.error(`❌ Error updating role:`, error.message);
    }
}

/**
 * Deactivate admin
 */
async function deactivateAdmin(email) {
    try {
        const userRecord = await auth.getUserByEmail(email);

        // Disable in Auth
        await auth.updateUser(userRecord.uid, { disabled: true });

        // Update Firestore
        await db.collection('admins').doc(userRecord.uid).update({
            is_active: false,
            deactivated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Deactivated ${email}`);
    } catch (error) {
        console.error(`❌ Error deactivating admin:`, error.message);
    }
}

/**
 * Reactivate admin
 */
async function reactivateAdmin(email) {
    try {
        const userRecord = await auth.getUserByEmail(email);

        // Enable in Auth
        await auth.updateUser(userRecord.uid, { disabled: false });

        // Update Firestore
        await db.collection('admins').doc(userRecord.uid).update({
            is_active: true,
            reactivated_at: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Reactivated ${email}`);
    } catch (error) {
        console.error(`❌ Error reactivating admin:`, error.message);
    }
}

/**
 * List all admins
 */
async function listAllAdmins() {
    try {
        const snapshot = await db.collection('admins').get();

        console.log('\n📋 All Admin Users:\n');
        console.log('='.repeat(80));

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`👤 ${data.displayName}`);
            console.log(`   Email: ${data.email}`);
            console.log(`   Role: ${data.role}`);
            console.log(`   Status: ${data.is_active ? '✅ Active' : '❌ Inactive'}`);
            console.log(`   Department: ${data.department || 'N/A'}`);
            console.log('-'.repeat(80));
        });

        console.log(`\nTotal: ${snapshot.size} admins`);

    } catch (error) {
        console.error('❌ Error listing admins:', error.message);
    }
}

// Export functions
module.exports = {
    createAdmin,
    createAllAdmins,
    updateAdminRole,
    deactivateAdmin,
    reactivateAdmin,
    listAllAdmins
};

// If running directly
if (require.main === module) {
    createAllAdmins()
        .then(() => {
            console.log('\n✅ All done!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Fatal error:', error);
            process.exit(1);
        });
}
