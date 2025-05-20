import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveTranslation = async (sourceText, translatedText) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, 'translations'), {
      userId: user.uid,
      sourceText,
      translatedText,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving translation to Firestore:', error);
  }
};
