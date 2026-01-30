import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'settings';
const DOC_ID = 'main'; // Single document for global settings

const defaultSettings = {
    siteLogo: '',
    heroLogo: '',
    heroTitleImage: '',
};

export const getSettings = async () => {
    try {
        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...defaultSettings, ...docSnap.data() };
        } else {
            // Initialize if not exists
            await setDoc(docRef, defaultSettings);
            return defaultSettings;
        }
    } catch (error) {
        console.error("Error getting settings:", error);
        return defaultSettings;
    }
};

export const updateSettings = async (newSettings) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        await setDoc(docRef, newSettings, { merge: true });
        return await getSettings();
    } catch (error) {
        console.error("Error updating settings:", error);
        return newSettings;
    }
};
