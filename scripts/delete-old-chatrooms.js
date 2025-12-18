/**
 * Delete Old Chat Rooms Script
 * ลบ ChatRooms เก่าที่ไม่มี participants field
 * 
 * วิธีใช้:
 * 1. เปิด Firebase Console
 * 2. ไปที่ Firestore Database
 * 3. เปิด Console (F12)
 * 4. Copy & Paste script นี้
 * 5. กด Enter
 */

// ⚠️ WARNING: This will delete ALL chat rooms!
// Make sure you want to do this before running.

async function deleteAllChatRooms() {
    const db = firebase.firestore();
    const batch = db.batch();

    try {
        // Get all chat rooms
        const snapshot = await db.collection('chat_rooms').get();

        console.log(`Found ${snapshot.size} chat rooms to delete`);

        // Add delete operations to batch
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Commit batch delete
        await batch.commit();

        console.log('✅ Successfully deleted all chat rooms!');
        console.log('You can now create new chat rooms with participants field.');

    } catch (error) {
        console.error('❌ Error deleting chat rooms:', error);
    }
}

// Run the function
deleteAllChatRooms();
