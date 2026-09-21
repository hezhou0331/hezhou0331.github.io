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
const pageVersion = new URLSearchParams(window.location.search).get("v") || "20260921";
fetch(`data/profile.json?v=${encodeURIComponent(pageVersion)}`)
  .then((response) => {
    if (!response.ok) throw new Error(`Profile request failed: ${response.status}`);
    return response.json();
  })
  .then((data) => {
    const profile = data.profile;
    document.title = `${profile.name} · ${profile.nameChinese} | 个人主页`;
    setText("[data-profile-name]", profile.name);
    setText("[data-profile-name-chinese]", profile.nameChinese);
    setText("[data-profile-role]", profile.subtitle || `${profile.university}${profile.role}`);
    setText("[data-profile-affiliation]", profile.affiliation);
    setText("[data-profile-location]", profile.location);
    setText("[data-profile-email-text]", profile.email);
    setHref("[data-profile-email]", `mailto:${profile.email}`);
    setHref("[data-profile-email-text]", `mailto:${profile.email}`);
    setHref("[data-profile-github]", profile.socials.github);
    setHref("[data-profile-scholar]", profile.socials.googleScholar);
    const avatar = document.querySelector("[data-profile-avatar]");
    avatar.src = profile.avatar.replace(/^\//, "");
    avatar.alt = `${profile.nameChinese || profile.name}的照片`;
    document.querySelector("[data-about]").replaceChildren(
      ...data.aboutMe.map((paragraph) => createElement("p", "", paragraph))
    );
    document.querySelector("[data-interests]").replaceChildren(
      ...data.researchInterests.map((interest) => createElement("span", "", interest))
    );
    document.querySelector("[data-campus-experience]").replaceChildren(
      ...data.campusExperienceLines.map((line) => {
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
      const certificates = award.certificates || (award.certificate
        ? [{ label: "查看获奖材料", url: award.certificate }]
        : []);
      if (certificates.length) {
        const links = createElement("div", "award-certificates");
        links.append(...certificates.map((certificate) => {
          const link = createElement("a", "", `${certificate.label} ↗`);
          link.href = certificate.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.setAttribute("aria-label", `${certificate.label}：${award.title}（新窗口打开）`);
          return link;
        }));
        body.append(links);
      }
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
          row.append(createElement("h3", "", entry.title), createElement("p", "", entry.text));
          return row;
        }));
        target.replaceChildren(list);
      } else {
        target.replaceChildren(createElement("p", "", section.text));
      }
    });
  })
  .catch((error) => {
    document.querySelector(".load-error").hidden = false;
    console.error("Unable to load homepage content:", error);
  });
