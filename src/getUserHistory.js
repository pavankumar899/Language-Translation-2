import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const getUserHistory = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No user logged in");
    return [];
  }

  try {
    const db = getFirestore();
    const q = query(
      collection(db, "translations"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    const history = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        sourceText: data.sourceText,
        translatedText: data.translatedText,
        timestamp: data.timestamp?.toDate?.().toLocaleString?.() || '',
      };
    });

    return history;
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
};

