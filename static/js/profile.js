const translations = {
  en: {
    home: "Home", skip: "Skip to content", navabout: "About Me", navnews: "News", navexperience: "Experience",
    navprojects: "Projects", navcampus: "Education", navawards: "Awards", navpublications: "Publications",
    about: "About Me", news: "News", experience: "Experience", projects: "Projects", campus: "Education & Campus",
    awards: "Honors & Awards", publications: "Publications", interests: "Research interests",
    university: "Tsinghua University", education: "Department of Automation · Undergraduate",
    loadError: "Unable to load the full content. Please refresh and try again.",
    title: "Jiangyu Liu | Homepage", navigation: "Main navigation", profile: "Profile", contact: "Contact links",
    description: "Jiangyu Liu, an undergraduate at Tsinghua University in Ning Ding's research group. Interested in agents for robot control, RL, world models, and 3D vision."
  },
  zh: {
    home: "主页", skip: "跳转至正文", navabout: "关于我", navnews: "最新动态", navexperience: "实习经历",
    navprojects: "项目经历", navcampus: "教育与校园", navawards: "荣誉奖项", navpublications: "论文发表",
    about: "关于我", news: "最新动态", experience: "实习经历", projects: "项目经历", campus: "教育与校园",
    awards: "荣誉奖项", publications: "论文发表", interests: "研究兴趣",
    university: "清华大学", education: "自动化系 · 本科生",
    loadError: "完整内容暂时未能加载，请刷新页面重试。",
    title: "Jiangyu Liu · 刘江宇 | 个人主页", navigation: "页面导航", profile: "个人信息", contact: "联系方式",
    description: "刘江宇，清华大学自动化系本科生，目前在丁宁老师课题组。关注 Agent 与机器人控制、强化学习、世界模型和三维视觉。"
  }
};
const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};
const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
};
const setHref = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.href = value;
};

// Splits "Org｜Role（Period）" legacy titles so older data still renders.
const parseEntryTitle = (entry) => {
  if (entry.org) {
    return { org: entry.org, role: entry.role || "", period: entry.period || "" };
  }
  const title = entry.title || "";
  const [orgPart, rest] = title.split(/[｜|]/);
  const match = (rest || "").match(/^(.*?)\s*[（(]([^（()）]*)[）)]\s*$/);
  return {
    org: (orgPart || "").trim(),
    role: match ? match[1].trim() : (rest || "").trim(),
    period: match ? match[2].trim() : ""
  };
};

function renderProfile(data, language) {
  const labels = translations[language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = labels.title;
  document.querySelector('meta[name="description"]').content = labels.description;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = labels[element.dataset.i18n];
  });
  document.querySelector(".site-nav").setAttribute("aria-label", labels.navigation);
  document.querySelector(".profile-sidebar").setAttribute("aria-label", labels.profile);
  document.querySelector(".social-links").setAttribute("aria-label", labels.contact);
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  const profile = data.profile;
  setText("[data-profile-name]", profile.name);
  setText("[data-profile-name-chinese]", profile.nameChinese);
  setText("[data-profile-role]", profile.subtitle);
  setText("[data-profile-affiliation]", profile.affiliation);
  setText("[data-profile-location]", profile.location);
  setHref("[data-profile-email]", `mailto:${profile.email}`);
  setHref("[data-profile-github]", profile.socials.github);
  const avatar = document.querySelector("[data-profile-avatar]");
  avatar.src = profile.avatar.replace(/^\//, "");
  avatar.alt = language === "zh" ? `${profile.nameChinese}的照片` : profile.name;
  document.querySelector("[data-about]").replaceChildren(
    ...data.aboutMe.map((paragraph) => createElement("p", "", paragraph))
  );
  document.querySelector("[data-interests]").replaceChildren(
    ...data.researchInterests.map((interest) => createElement("span", "", interest))
  );
  document.querySelector("[data-news]").replaceChildren(...(data.news || []).map((item) => {
    const row = createElement("li", "news-row");
    const date = createElement("time", "news-date", item.date);
    date.dateTime = item.date.replace(/\./g, "-");
    row.append(date, createElement("span", "news-text", item.text));
    return row;
  }));
  const statsTarget = document.querySelector("[data-stats]");
  const stats = data.stats || [];
  statsTarget.replaceChildren(...stats.map((stat) => {
    const group = createElement("div", "stat");
    group.append(
      createElement("span", "stat-value", stat.value),
      createElement("span", "stat-label", stat.label)
    );
    return group;
  }));
  statsTarget.hidden = stats.length === 0;
  document.querySelector("[data-campus-experience]").replaceChildren(
    ...(data.campusExperienceLines || []).map((line) => {
      const row = createElement("li");
      const match = line.match(/^([^：:]+[：:])(.*)$/s);
      if (match) row.append(createElement("strong", "", match[1]), match[2]);
      else row.textContent = line;
      return row;
    })
  );
  document.querySelector("[data-awards]").replaceChildren(...data.awards.map((award) => {
    const row = createElement("li", "award-row");
    const year = createElement("time", "award-year", award.year);
    year.dateTime = award.year;
    const body = createElement("div");
    body.append(createElement("h3", "", award.title), createElement("p", "", award.description));
    row.append(year, body);
    return row;
  }));
  data.sections.forEach((section) => {
    const target = document.querySelector(`[data-section="${section.id}"]`);
    if (!target) return;
    if (Array.isArray(section.items)) {
      const list = createElement("ul", "entry-list");
      // Show the most recent internship first without changing the source data order.
      const items = section.id === "experience" ? [...section.items].reverse() : section.items;
      list.append(...items.map((entry) => {
        const row = createElement("li", "entry");
        const parts = parseEntryTitle(entry);
        if (section.id === "experience" && parts.org) {
          const head = createElement("div", "entry-head");
          head.append(createElement("h3", "entry-org", parts.org));
          if (parts.period) head.append(createElement("span", "entry-period", parts.period));
          row.append(head);
          if (parts.role) row.append(createElement("p", "entry-role", parts.role));
          row.append(createElement("p", "entry-text", entry.text));
        } else {
          row.append(createElement("h3", "", entry.title), createElement("p", "", entry.text));
        }
        return row;
      }));
      target.replaceChildren(list);
    } else {
      target.replaceChildren(createElement("p", "", section.text));
    }
  });
  syncNavHighlight();
}

// Observe a narrow viewport band; margins in pixels stay correct on wide screens.
let navObserver = null;
let navFrame = 0;
const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
function updateNavHighlight() {
  const midline = window.innerHeight * 0.45;
  let active = navSections[0];
  for (const section of navSections) {
    if (section.getBoundingClientRect().top <= midline) active = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    active = navSections[navSections.length - 1];
  }
  navLinks.forEach((link) => {
    if (link.hash === `#${active?.id}`) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}
function syncNavHighlight() {
  if (navObserver) navObserver.disconnect();
  const headerHeight = document.querySelector(".site-header").getBoundingClientRect().height;
  document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
  if ("IntersectionObserver" in window) {
    navObserver = new IntersectionObserver(updateNavHighlight, {
      rootMargin: `-${Math.round(innerHeight * 0.45)}px 0px -${Math.round(innerHeight * 0.50)}px 0px`, threshold: 0
    });
    navSections.forEach((section) => navObserver.observe(section));
  }
  updateNavHighlight();
}
window.addEventListener("scroll", () => {
  if (navFrame) return;
  navFrame = requestAnimationFrame(() => { navFrame = 0; updateNavHighlight(); });
}, { passive: true });
window.addEventListener("resize", syncNavHighlight);
if ("ResizeObserver" in window) new ResizeObserver(syncNavHighlight).observe(document.querySelector(".site-header"));

const pageVersion = "20261103-4";
const storageKey = "homepage-language";
const profileCache = new Map();
let languageRequest = 0;

async function setLanguage(language, updateUrl = false) {
  if (!Object.hasOwn(translations, language)) return;
  const request = ++languageRequest;
  const main = document.querySelector("main");
  const errorMessage = document.querySelector(".load-error");
  main.setAttribute("aria-busy", "true");
  errorMessage.hidden = true;
  try {
    if (!profileCache.has(language)) {
      const file = language === "en" ? "profile.en.json" : "profile.json";
      profileCache.set(language, fetch(`data/${file}?v=${pageVersion}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Profile request failed: ${response.status}`);
          return response.json();
        })
        .catch((error) => {
          profileCache.delete(language);
          throw error;
        }));
    }
    const data = await profileCache.get(language);
    // A slower request must not overwrite a newer language selection.
    if (request !== languageRequest) return;
    renderProfile(data, language);
    try { localStorage.setItem(storageKey, language); } catch { /* Storage may be disabled. */ }
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      history.replaceState(null, "", url);
    }
  } catch (error) {
    if (request === languageRequest) {
      errorMessage.textContent = translations[language].loadError;
      errorMessage.hidden = false;
      console.error("Unable to load homepage content:", error);
    }
  } finally {
    if (request === languageRequest) main.setAttribute("aria-busy", "false");
  }
}

let savedLanguage;
try { savedLanguage = localStorage.getItem(storageKey); } catch { /* Default to English. */ }
const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
const initialLanguage = Object.hasOwn(translations, requestedLanguage) ? requestedLanguage
  : Object.hasOwn(translations, savedLanguage) ? savedLanguage : "en";
document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language, true));
});
setLanguage(initialLanguage);
