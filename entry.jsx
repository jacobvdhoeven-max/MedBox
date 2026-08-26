import React from "react";
import { createRoot } from "react-dom/client";
import App from "./MedBox.jsx";

// ---- window.storage shim ----
// The original component targets Claude.ai's artifact sandbox, which
// injects a `window.storage.get/set(key, isPublic)` API backed by a real
// per-account service. Outside that sandbox nothing provides it, so here
// we back the same async interface with localStorage — this keeps every
// component-level fix (including the load/save error handling) unchanged
// and exercised, while making the demo persist per-device exactly the way
// the app's own "Back-up" section already tells the person it works.
//
// Household "sharing" (isPublic=true) is stored under a separate prefix.
// Because localStorage never leaves this one browser, the caregiver code
// only resolves in a second tab of the SAME browser here — a real
// cross-device version needs an actual backend, which this static page
// intentionally does not fake.
function readKey(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : raw;
  } catch (e) {
    throw e; // let the caller's try/catch treat this as a real read failure
  }
}

window.storage = {
  async get(key, isPublic) {
    const raw = readKey((isPublic ? "medbox_pub_" : "medbox_priv_") + key);
    return raw === null ? null : { value: raw };
  },
  async set(key, value, isPublic) {
    window.localStorage.setItem((isPublic ? "medbox_pub_" : "medbox_priv_") + key, value);
  },
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
