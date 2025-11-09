import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps } from 'firebase/app';
import { assets, controls, auditLogs } from '@/lib/data';

// Seed data into Firestore
export async function GET() {
  try {
    if (!getApps().length) {
      initializeApp();
    }
    const firestore = getFirestore();

    // Seed assets
    const assetPromises = assets.map(async (asset) => {
      await firestore.collection('assets').doc(asset.id).set(asset);
    });
    await Promise.all(assetPromises);

    // Seed controls
    const controlPromises = controls.map(async (control) => {
      await firestore.collection('controls').doc(control.id).set(control);
    });
    await Promise.all(controlPromises);

    // Seed audit logs
    const auditLogPromises = auditLogs.map(async (log) => {
        // Convert date string to Firestore Timestamp
        const logWithTimestamp = {
            ...log,
            date: new Date(log.date),
        };
        await firestore.collection('auditLogs').add(logWithTimestamp);
    });
    await Promise.all(auditLogPromises);

    return NextResponse.json({
      message: 'Database seeded successfully',
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { message: 'Error seeding database' },
      { status: 500 }
    );
  }
}
