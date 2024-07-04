import { app } from '.';
import { getFirestore } from 'firebase-admin/firestore';

export const db = getFirestore(app);
