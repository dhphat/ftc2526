import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';

const COLLECTION_NAME = 'links';

export const getLinks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const links = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        // Sort in memory: items with 'order' first, then fallback to original order
        return links.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    } catch (error) {
        console.error("Error getting links:", error);
        return [];
    }
};

export const addLink = async (link) => {
    try {
        const currentLinks = await getLinks();
        const maxOrder = currentLinks.reduce((max, l) => Math.max(max, l.order || 0), -1);

        await addDoc(collection(db, COLLECTION_NAME), {
            ...link,
            order: maxOrder + 1
        });
        return await getLinks();
    } catch (error) {
        console.error("Error adding link:", error);
        return [];
    }
};

export const updateLink = async (id, updatedData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updatedData);
        return await getLinks();
    } catch (error) {
        console.error("Error updating link:", error);
        return [];
    }
};

export const updateLinksOrder = async (reorderedLinks) => {
    try {
        const batch = writeBatch(db);
        reorderedLinks.forEach((link, index) => {
            const docRef = doc(db, COLLECTION_NAME, link.id);
            batch.update(docRef, { order: index });
        });
        await batch.commit();
        return await getLinks();
    } catch (error) {
        console.error("Error updating links order:", error);
        return [];
    }
};

export const deleteLink = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return await getLinks();
    } catch (error) {
        console.error("Error deleting link:", error);
        return [];
    }
};
