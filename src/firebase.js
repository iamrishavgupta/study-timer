

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAdXsuq_97LFBc12eyl-teHguVXcut0vF8',
  authDomain: 'stopwatch-2a87a.firebaseapp.com',
  projectId: 'stopwatch-2a87a',
  storageBucket: 'stopwatch-2a87a.firebasestorage.app',
  messagingSenderId: '243857762773',
  appId: '1:243857762773:web:cde6a51324edbb19f7b55c',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
