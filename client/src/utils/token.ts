export const readToken = () =>
    (typeof window !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("access_token"))) || null;

export const clearToken = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
    } catch {}
};

type JwtPayload = { exp?: number };
const parseJwt = (t: string): JwtPayload => {
    try {
        return JSON.parse(atob(t.split(".")[1]));
    } catch {
        return {};
    }
};

export const isExpired = (t: string, skewMs = 3000) => {
    const { exp } = parseJwt(t);
    return exp ? Date.now() >= exp * 1000 - skewMs : false;
};

export const getValidToken = () => {
    const t = readToken();
    if (!t) return null;
    if (isExpired(t)) {
        clearToken();
        return null;
    }
    return t;
};
