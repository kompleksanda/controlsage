import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { assets, controls, auditLogs } from '@/lib/data';

export async function GET() {
  try {
    if (!getApps().length) {
      initializeApp();
    }
    const firestore = getFirestore();
    const adminAuth = getAdminAuth();

    // Create a dummy user for seeding data
    const userEmail = 'seeder@example.com';
    let user;
    try {
      user = await adminAuth.getUserByEmail(userEmail);
    } catch (error) {
      user = await adminAuth.createUser({
        email: userEmail,
        password: 'password123',
      });
    }
    const userId = user.uid;

    // Seed assets under the user
    const assetPromises = assets.map(async (asset) => {
      const assetDocRef = firestore.collection('users').doc(userId).collection('assets').doc(asset.id);
      await assetDocRef.set({ ...asset, ownerId: userId });
    });
    await Promise.all(assetPromises);

    // Seed controls under the user
    const controlPromises = controls.map(async (control) => {
      const controlDocRef = firestore.collection('users').doc(userId).collection('controls').doc(control.id);
      await controlDocRef.set({ ...control, ownerId: userId });
    });
    await Promise.all(controlPromises);

    // Seed audit logs
    const auditLogPromises = auditLogs.map(async (log) => {
      const logWithTimestamp = {
        ...log,
        date: new Date(log.date),
      };
      await firestore.collection('auditLogs').add(logWithTimestamp);
    });
    await Promise.all(auditLogPromises);

    return NextResponse.json({
      message: `Database seeded successfully for user ${userId}`,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { message: 'Error seeding database' },
      { status: 500 }
    );
  }
}
