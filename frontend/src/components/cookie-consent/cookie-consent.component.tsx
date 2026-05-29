import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "storysparkai_cookie_consent";

type CookiePreferences = {
  saved: boolean;
  functional: boolean;
  analytics: boolean;
};

const DEFAULT_PREFERENCES: CookiePreferences = {
  saved: false,
  functional: false,
  analytics: false,
};

const loadCookiePreferences = (): CookiePreferences => {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const saveCookiePreferences = (preferences: CookiePreferences) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
};

const CookieConsentBanner: FC = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    const storedPreferences = loadCookiePreferences();
    setPreferences(storedPreferences);
    setShowBanner(!storedPreferences.saved);
  }, []);

  if (!preferences || !showBanner) {
    return null;
  }

  const handleSave = () => {
    const updated = { ...preferences, saved: true };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  const handleAcceptAll = () => {
    const updated = { saved: true, functional: true, analytics: true };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  const handleRejectNonEssential = () => {
    const updated = { saved: true, functional: false, analytics: false };
    setPreferences(updated);
    setShowBanner(false);
    saveCookiePreferences(updated);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-[85vh] overflow-y-auto w-[calc(100vw-32px)] sm:w-[400px] bg-slate-950/98 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl text-white scrollbar-thin flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Cookie Preferences</p>
          <button 
            onClick={handleRejectNonEssential}
            className="text-slate-400 hover:text-white transition-colors duration-250"
            aria-label="Close cookie settings"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-white leading-tight">We value your privacy</h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          StorySpark AI uses cookies to keep your experience secure and personalized.
          <Link to="/cookie-policy" className="ml-1 text-blue-400 underline hover:text-blue-300">Learn more</Link>.
        </p>
      </div>

      {showCustomize && (
        <div className="space-y-3 border-t border-slate-900 pt-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs md:text-sm text-white">Essential Cookies</p>
                <p className="text-[10px] md:text-xs text-slate-400 leading-normal">Required for secure login and basic features.</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-400 shrink-0">Required</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs md:text-sm text-white">Functional Cookies</p>
                <p className="text-[10px] md:text-xs text-slate-400 leading-normal">Save preferences & smooth out navigations.</p>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(event) => setPreferences({ ...preferences, functional: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <span>{preferences.functional ? "On" : "Off"}</span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs md:text-sm text-white">Analytics Cookies</p>
                <p className="text-[10px] md:text-xs text-slate-400 leading-normal">Analyze usage stats to help us improve the app.</p>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(event) => setPreferences({ ...preferences, analytics: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <span>{preferences.analytics ? "On" : "Off"}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-slate-900 pt-3">
        <button
          onClick={handleAcceptAll}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 py-2.5 text-xs md:text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition hover:from-blue-400 hover:to-indigo-400"
        >
          Accept all cookies
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 py-2 text-[11px] md:text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            {showCustomize ? "Hide options" : "Customize"}
          </button>
          
          {showCustomize ? (
            <button
              onClick={handleSave}
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-800/80 py-2 text-[11px] md:text-xs font-semibold text-white transition hover:border-slate-600"
            >
              Save settings
            </button>
          ) : (
            <button
              onClick={handleRejectNonEssential}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 py-2 text-[11px] md:text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
            >
              Reject optional
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;