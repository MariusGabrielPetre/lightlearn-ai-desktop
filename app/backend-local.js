// Backend for the desktop app's offline copy: progress is kept on this computer only.
// (The online version at www.lightlearnai.com uses real accounts; this one works without internet.)
const BACKEND = {
  providers: ["local"],
  _k: "llai-local-progress",
  async start(cb) {
    let d = null; try { d = JSON.parse(localStorage.getItem(this._k) || "null"); } catch (e) {}
    cb({ status: "in", name: (d && d._name) || "", data: d });
  },
  async signIn() { let d = null; try { d = JSON.parse(localStorage.getItem(this._k) || "null"); } catch (e) {} return { name: "", data: d }; },
  async save(data) { try { localStorage.setItem(this._k, JSON.stringify(data)); } catch (e) {} },
  async signOut(data) { await this.save(data); },
  async resetPassword() { throw { key: "authErr" }; },
  async deleteAccount() { try { localStorage.removeItem(this._k); } catch (e) {} },
  async getRole() { return { role: null, testers: [] }; },
  async setTesters() { throw { key: "authErr" }; },
  async searchPeople() { return []; },
  async labels() { return {}; },
  myId() { return "local"; },
  async getConfig() { return null; },
  async setConfig() { throw { key: "authErr" }; },
  async sendFeedback(text) { location.href = "mailto:salut@lightlearnai.com?subject=" + encodeURIComponent("Feedback LightLearn AI (desktop)") + "&body=" + encodeURIComponent(String(text).slice(0, 1500)); },
  async listFeedback() { return []; }
};
