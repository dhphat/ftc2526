const STORAGE_KEY = 'ftc_links';

const defaultLinks = [
    { id: '1', name: 'Official Website', nameVi: 'Trang chủ chính thức', url: 'https://ftc.vn' },
    { id: '2', name: 'Rule Manual 1', nameVi: 'Sổ tay luật 1', url: '#' },
    { id: '3', name: 'Rule Manual 2', nameVi: 'Sổ tay luật 2', url: '#' }
];

export const getLinks = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLinks));
        return defaultLinks;
    }
    return JSON.parse(stored);
};

export const addLink = (link) => {
    const links = getLinks();
    const newLinks = [...links, { ...link, id: Date.now().toString() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
    return newLinks;
};

export const deleteLink = (id) => {
    const links = getLinks();
    const newLinks = links.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
    return newLinks;
};
