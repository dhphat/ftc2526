import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = 'links';

export const getLinks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Error getting links:", error);
        return [];
    }
};

export const addLink = async (link) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), link);
        return await getLinks(); // Return updated list
    } catch (error) {
        console.error("Error adding link:", error);
        return [];
    }
};

export const deleteLink = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return await getLinks(); // Return updated list
    } catch (error) {
        console.error("Error deleting link:", error);
        return [];
    }
};
