
const admin = require('firebase-admin');

// Initialize with the current project
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'jaikod-5cdd5'
    });
}

const db = admin.firestore();

async function topUp() {
    const userId = 'QSNb9fGPr5dFaBUiKMBAhJT7kFs2';
    const amount = 9999;
    const walletRef = db.collection('wallets').doc(userId);
    const txRef = db.collection('wallet_transactions').doc();

    try {
        await db.runTransaction(async (t) => {
            const walletDoc = await t.get(walletRef);
            let currentBalance = 0;
            if (walletDoc.exists) {
                currentBalance = walletDoc.data().balance || 0;
            }

            const newBalance = currentBalance + amount;

            t.set(walletRef, {
                userId,
                balance: newBalance,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                isInitialized: true
            }, { merge: true });

            t.set(txRef, {
                userId,
                type: 'topup',
                amount: amount,
                balanceAfter: newBalance,
                description: 'Admin Top-up (Special Request)',
                status: 'success',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });
        console.log('Successfully topped up 9999 JaiStar for chart_bma@hotmail.com');
    } catch (e) {
        console.error('Failed to top up:', e);
    }
}

topUp();
