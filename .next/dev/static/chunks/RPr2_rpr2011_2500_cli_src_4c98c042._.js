(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/RPr2/rpr2011_2500_cli/src/utils/authFetch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticatedFetch",
    ()=>authenticatedFetch,
    "initializeAuthUtils",
    ()=>initializeAuthUtils
]);
let getAuthToken;
let logoutUser;
function initializeAuthUtils({ get, refresh, logout }) {
    getAuthToken = get;
    logoutUser = logout;
// Note: refresh token is not used - backend doesn't support it
}
async function authenticatedFetch(url, options = {}) {
    let token = getAuthToken ? getAuthToken() : null;
    // Fallback for edge cases where context state is not yet hydrated.
    if (!token && ("TURBOPACK compile-time value", "object") !== "undefined") {
        token = window.localStorage.getItem("auth_access_token");
    }
    // Do not force navigation here; callers can decide how to handle auth failures.
    if (!token) {
        return new Response(JSON.stringify({
            message: "Session expired. Please log in again."
        }), {
            status: 401
        });
    }
    // Don't set Content-Type for FormData - let browser set it automatically with boundary
    const isFormData = options.body instanceof FormData;
    const defaultHeaders = {
        ...options.headers || {},
        Authorization: `Bearer ${token}`
    };
    // Only set Content-Type if not FormData
    if (!isFormData && !defaultHeaders["Content-Type"] && !defaultHeaders["content-type"]) {
        defaultHeaders["Content-Type"] = "application/json";
    }
    const defaultOptions = {
        ...options,
        headers: defaultHeaders
    };
    // Just return the response - let components handle 401/errors
    const response = await fetch(url, defaultOptions);
    return response;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/RPr2/rpr2011_2500_cli/src/context/PortalAuthContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PortalAuthProvider",
    ()=>PortalAuthProvider,
    "usePortalAuth",
    ()=>usePortalAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$utils$2f$authFetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/src/utils/authFetch.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const PortalAuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function decodeJwtPayload(token) {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const normalized = base64 + "=".repeat((4 - base64.length % 4) % 4);
        const json = atob(normalized);
        return JSON.parse(json);
    } catch  {
        return null;
    }
}
function isTokenExpired(token, skewSeconds = 30) {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== "number") return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now + skewSeconds;
}
function PortalAuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accessToken, setAccessToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const TOKEN_KEY = "auth_access_token";
    const USER_ID_KEY = "auth_user_id";
    const clearAllAuth = ()=>{
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
    };
    // On mount, restore token and user from localStorage if valid
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PortalAuthProvider.useEffect": ()=>{
            try {
                const storedToken = localStorage.getItem(TOKEN_KEY);
                const storedUserId = localStorage.getItem(USER_ID_KEY);
                if (storedToken && storedUserId) {
                    // Check if token is still valid
                    if (!isTokenExpired(storedToken)) {
                        const tokenPayload = decodeJwtPayload(storedToken);
                        const role = (tokenPayload?.role ?? "").toLowerCase();
                        setAccessToken(storedToken);
                        setUser({
                            id: storedUserId,
                            role
                        });
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$utils$2f$authFetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeAuthUtils"])({
                            get: {
                                "PortalAuthProvider.useEffect": ()=>storedToken
                            }["PortalAuthProvider.useEffect"],
                            refresh: {
                                "PortalAuthProvider.useEffect": ()=>null
                            }["PortalAuthProvider.useEffect"],
                            logout: clearAllAuth
                        });
                    } else {
                        // Token expired, clear it
                        clearAllAuth();
                    }
                }
            } catch (error) {
                clearAllAuth();
            } finally{
                setLoading(false);
            }
        }
    }["PortalAuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            const res = await fetch(`${("TURBOPACK compile-time value", "https://api-rpr.mtscorporate.com")}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await res.json().catch(()=>({}));
            if (!res.ok) {
                const detail = data?.errors?.length ? data.errors.map((e)=>e.message).join(" · ") : data?.message || "Invalid credentials. Please try again.";
                return {
                    ok: false,
                    error: detail
                };
            }
            const payload = data?.data ?? data ?? {};
            const userData = payload?.user ?? {};
            const token = payload?.tokens?.accessToken ?? data?.accessToken ?? data?.token ?? "";
            const role = (userData?.role ?? "").toLowerCase();
            if (![
                "admin",
                "landlord",
                "tenant"
            ].includes(role)) {
                return {
                    ok: false,
                    error: "Login succeeded but returned an invalid user role."
                };
            }
            if (!token) {
                return {
                    ok: false,
                    error: "Login succeeded but no access token was returned."
                };
            }
            if (isTokenExpired(token)) {
                return {
                    ok: false,
                    error: "Received an expired access token. Please try again."
                };
            }
            clearAllAuth();
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_ID_KEY, userData.id || "");
            setAccessToken(token);
            setUser({
                id: userData.id,
                role
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$utils$2f$authFetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeAuthUtils"])({
                get: ()=>token,
                refresh: ()=>null,
                logout: logout
            });
            return {
                ok: true,
                role
            };
        } catch  {
            return {
                ok: false,
                error: "Network error. Please check your connection."
            };
        }
    };
    const logout = ()=>{
        clearAllAuth();
    };
    const getToken = ()=>{
        let token = accessToken;
        // If no token in state, try to restore from localStorage
        if (!token) {
            token = localStorage.getItem(TOKEN_KEY);
        }
        if (!token || isTokenExpired(token)) {
            clearAllAuth();
            return null;
        }
        return token;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PortalAuthProvider.useEffect": ()=>{
            if (user && accessToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$utils$2f$authFetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeAuthUtils"])({
                    get: {
                        "PortalAuthProvider.useEffect": ()=>accessToken
                    }["PortalAuthProvider.useEffect"],
                    refresh: {
                        "PortalAuthProvider.useEffect": ()=>null
                    }["PortalAuthProvider.useEffect"],
                    logout: logout
                });
            }
        }
    }["PortalAuthProvider.useEffect"], [
        user,
        accessToken
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PortalAuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            logout,
            getToken
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/RPr2/rpr2011_2500_cli/src/context/PortalAuthContext.jsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_s(PortalAuthProvider, "h0prqyYnunaqiZlmu7/M4CGySJc=");
_c = PortalAuthProvider;
function usePortalAuth() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PortalAuthContext);
    if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
    return ctx;
}
_s1(usePortalAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "PortalAuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$context$2f$PortalAuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/src/context/PortalAuthContext.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function getDashboardHref(user) {
    if (!user) return "/login";
    const role = (user.role ?? "").toUpperCase();
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "TENANT") return "/tenant/dashboard";
    return "/portal/dashboard";
}
function NavbarContent() {
    _s();
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$context$2f$PortalAuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortalAuth"])();
    const [dashboardHref, setDashboardHref] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("/login");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NavbarContent.useEffect": ()=>{
            const h = {
                "NavbarContent.useEffect.h": ()=>setScrolled(window.scrollY > 20)
            }["NavbarContent.useEffect.h"];
            window.addEventListener("scroll", h);
            return ({
                "NavbarContent.useEffect": ()=>window.removeEventListener("scroll", h)
            })["NavbarContent.useEffect"];
        }
    }["NavbarContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NavbarContent.useEffect": ()=>setOpen(false)
    }["NavbarContent.useEffect"], [
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NavbarContent.useEffect": ()=>{
            setDashboardHref(getDashboardHref(user));
        }
    }["NavbarContent.useEffect"], [
        user
    ]);
    const links = [
        {
            href: "/",
            label: "Home"
        },
        {
            href: "/services",
            label: "Services"
        },
        {
            href: "/about",
            label: "About"
        },
        {
            href: "/contact",
            label: "Contact"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `fixed top-0 inset-x-0 z-50 px-6 lg:px-16 transition-all duration-300 ${scrolled ? "h-[72px] bg-white shadow-sm" : "h-[72px] bg-white/60 backdrop-blur-md border-b border-white/10"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto flex items-center justify-between h-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/logo.png",
                                alt: "McCann & Curran Reality",
                                width: 38,
                                height: 38,
                                priority: true
                            }, void 0, false, {
                                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[1.1rem] font-bold text-dark-900 tracking-tighter",
                                children: [
                                    "McCann ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-dark-900",
                                        children: "&"
                                    }, void 0, false, {
                                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                        lineNumber: 63,
                                        columnNumber: 20
                                    }, this),
                                    " Curran Reality"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-8",
                        children: [
                            links.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: l.href,
                                    className: "text-[0.9rem] font-medium transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `border-b-2 pb-1 ${pathname === l.href ? "text-dark-900 border-primary-400" : "text-dark-700 border-transparent hover:text-primary-600"}`,
                                        children: l.label
                                    }, void 0, false, {
                                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, l.href, false, {
                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)),
                            user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-4 flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: dashboardHref,
                                        className: "px-4 py-2 text-[0.85rem] font-semibold text-white bg-[#079489] rounded-lg hover:bg-slate-200 transition-colors",
                                        children: "Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            logout();
                                            router.push("/");
                                        },
                                        className: "px-4 py-2 text-[0.85rem] font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors",
                                        children: "Sign out"
                                    }, void 0, false, {
                                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: "ml-4 px-6 py-2.5 text-[0.85rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors",
                                children: "Client Login"
                            }, void 0, false, {
                                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "md:hidden p-2 text-dark-800",
                        onClick: ()=>setOpen(!open),
                        "aria-label": "Menu",
                        children: open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 22
                        }, void 0, false, {
                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                            lineNumber: 116,
                            columnNumber: 19
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            size: 22
                        }, void 0, false, {
                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                            lineNumber: 116,
                            columnNumber: 37
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden py-4 px-6 flex flex-col gap-1",
                children: [
                    links.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: l.href,
                            onClick: ()=>setOpen(false),
                            className: `px-4 py-3 rounded-lg text-[0.95rem] font-medium border-l-3 ${pathname === l.href ? "text-primary-600 bg-primary-50 border-primary-400" : "text-dark-700 hover:bg-gray-50 border-transparent"}`,
                            children: l.label
                        }, l.href, false, {
                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)),
                    user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: dashboardHref,
                                onClick: ()=>setOpen(false),
                                className: "flex-1 px-4 py-3 text-center text-[0.95rem] font-semibold text-dark-800 bg-slate-100 rounded-lg",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                lineNumber: 137,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    logout();
                                    setOpen(false);
                                    router.push("/");
                                },
                                className: "px-4 py-3 text-center text-[0.95rem] font-semibold text-white bg-red-600 rounded-lg",
                                children: "Sign out"
                            }, void 0, false, {
                                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                        lineNumber: 136,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/login",
                        onClick: ()=>setOpen(false),
                        className: "mt-2 px-6 py-3 text-center text-[0.9rem] font-semibold text-white bg-primary-600 rounded-full",
                        children: "Client Login"
                    }, void 0, false, {
                        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                        lineNumber: 156,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
                lineNumber: 122,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(NavbarContent, "3W0GDTx5aQqJO9X1TsSglsBPwNw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$context$2f$PortalAuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePortalAuth"]
    ];
});
_c = NavbarContent;
function Navbar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavbarContent, {}, void 0, false, {
        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx",
        lineNumber: 171,
        columnNumber: 10
    }, this);
}
_c1 = Navbar;
var _c, _c1;
__turbopack_context__.k.register(_c, "NavbarContent");
__turbopack_context__.k.register(_c1, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
;
;
;
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-[#f5f7fa] text-dark-600",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-6 lg:px-16 pt-10 lg:pt-16 pb-10 lg:pb-14",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row justify-between gap-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/logo.png",
                                    alt: "McCann & Curran Reality",
                                    width: 36,
                                    height: 36
                                }, void 0, false, {
                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                    lineNumber: 12,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-base font-bold text-dark-900 tracking-tight",
                                    children: "McCann & Curran Reality"
                                }, void 0, false, {
                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                    lineNumber: 18,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-6 text-[0.85rem]",
                            children: [
                                {
                                    label: "Home",
                                    href: "/"
                                },
                                {
                                    label: "Services",
                                    href: "/services"
                                },
                                {
                                    label: "About",
                                    href: "/about"
                                },
                                {
                                    label: "Privacy Policy",
                                    href: "/privacy-policy"
                                },
                                {
                                    label: "Cookie Policy",
                                    href: "/cookie-policy"
                                },
                                {
                                    label: "Terms of Use",
                                    href: "/terms-of-use"
                                }
                            ].map(({ label, href })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: href,
                                    className: "text-dark-500 hover:text-dark-900 transition-colors",
                                    children: label
                                }, label, false, {
                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                    lineNumber: 33,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2.5 text-[0.85rem]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                            size: 14,
                                            className: "text-primary-500"
                                        }, void 0, false, {
                                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                            lineNumber: 46,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "049-899-1111"
                                        }, void 0, false, {
                                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                            lineNumber: 47,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                            size: 14,
                                            className: "text-primary-500"
                                        }, void 0, false, {
                                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "info@mccannandcurran.com"
                                        }, void 0, false, {
                                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                            size: 14,
                                            className: "text-primary-500 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                            lineNumber: 54,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "Lower Camden St",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                                    lineNumber: 57,
                                                    columnNumber: 17
                                                }, this),
                                                "Dublin, D02XE80"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                            lineNumber: 55,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-dark-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-6 lg:px-16 py-5 text-center text-xs text-dark-400",
                    children: "© 2026 McCann & Curran Reality. All rights reserved.  ·  PSRA Lic. No. 004008"
                }, void 0, false, {
                    fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/RPr2/rpr2011_2500_cli/src/app/components/LenisInit.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/lenis/dist/lenis-react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SmoothScroll = ({ children, root = true, className = '' })=>{
    _s();
    const lenisOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SmoothScroll.useMemo[lenisOptions]": ()=>({
                lerp: 0.3,
                duration: 1.7,
                smoothWheel: true,
                smoothTouch: false,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                orientation: 'vertical',
                gestureDirection: 'vertical',
                infinite: false
            })
    }["SmoothScroll.useMemo[lenisOptions]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactLenis"], {
        root: root,
        options: lenisOptions,
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LenisRouteReset, {
            children: children
        }, void 0, false, {
            fileName: "[project]/RPr2/rpr2011_2500_cli/src/app/components/LenisInit.jsx",
            lineNumber: 23,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/RPr2/rpr2011_2500_cli/src/app/components/LenisInit.jsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SmoothScroll, "Opx00D5v4t9is8rRtw7pz/vuuEo=");
_c = SmoothScroll;
const __TURBOPACK__default__export__ = SmoothScroll;
function LenisRouteReset({ children }) {
    _s1();
    const lenis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLenis"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LenisRouteReset.useEffect": ()=>{
            if (!lenis) return;
            // scroll instantly to top on route change to avoid preserved scroll position
            try {
                if (typeof lenis.scrollTo === 'function') {
                    lenis.scrollTo(0, {
                        immediate: true
                    });
                } else if ("TURBOPACK compile-time truthy", 1) {
                    window.scrollTo(0, 0);
                }
            } catch (e) {
                // fallback
                if ("TURBOPACK compile-time truthy", 1) window.scrollTo(0, 0);
            }
        }
    }["LenisRouteReset.useEffect"], [
        lenis,
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s1(LenisRouteReset, "GPI3RsFS8x21oWuzV5bER2W8DOk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$lenis$2f$dist$2f$lenis$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLenis"],
        __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c1 = LenisRouteReset;
var _c, _c1;
__turbopack_context__.k.register(_c, "SmoothScroll");
__turbopack_context__.k.register(_c1, "LenisRouteReset");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/RPr2/rpr2011_2500_cli/src/components/ConditionalShell.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConditionalShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$components$2f$Navbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/src/components/Navbar.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$components$2f$Footer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/src/components/Footer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$app$2f$components$2f$LenisInit$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/RPr2/rpr2011_2500_cli/src/app/components/LenisInit.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ConditionalShell({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isPortal = pathname.startsWith("/portal");
    const isAdmin = pathname.startsWith("/admin");
    const isTenant = pathname.startsWith("/tenant");
    const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");
    if (isPortal || isTenant || isAuth) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    if (isAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$app$2f$components$2f$LenisInit$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$components$2f$Navbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/ConditionalShell.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: children
            }, void 0, false, {
                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/ConditionalShell.jsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$src$2f$components$2f$Footer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/ConditionalShell.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/RPr2/rpr2011_2500_cli/src/components/ConditionalShell.jsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(ConditionalShell, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$RPr2$2f$rpr2011_2500_cli$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ConditionalShell;
var _c;
__turbopack_context__.k.register(_c, "ConditionalShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=RPr2_rpr2011_2500_cli_src_4c98c042._.js.map