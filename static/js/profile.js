const iconMap = {
  spark: "✦",
  award: "◇",
  star: "★",
  leaf: "◆",
  medal: "●"
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
};

const setHref = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.href = value;
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

fetch("data/profile.json")
  .then((response) => response.json())
  .then((data) => {
    const profile = data.profile;
    document.title = `${profile.name} | 个人主页`;

    setText("[data-profile-name]", profile.name);
    setText("[data-profile-name-chinese]", profile.nameChinese);
    setText("[data-profile-role]", profile.subtitle || `${profile.university}${profile.role}`);
    setText("[data-profile-location]", profile.location);
    setHref("[data-profile-email]", `mailto:${profile.email}`);
    setHref("[data-profile-github]", profile.socials.github);
    setHref("[data-profile-scholar]", profile.socials.googleScholar);

    const avatar = document.querySelector("[data-profile-avatar]");
    if (avatar && profile.avatar) {
      avatar.src = profile.avatar.replace(/^\//, "");
      avatar.alt = profile.name;
    }

    const about = document.querySelector("[data-about]");
    if (about) {
      about.replaceChildren(...data.aboutMe.map((paragraph) => createElement("p", "", paragraph)));
    }

    const interests = document.querySelector("[data-interests]");
    if (interests) {
      interests.replaceChildren(...data.researchInterests.map((interest) => createElement("span", "", interest)));
    }

    const campusExperience = document.querySelector("[data-campus-experience]");
    if (campusExperience && data.campusExperienceLines) {
      campusExperience.replaceChildren(...data.campusExperienceLines.map((line) => {
        const row = createElement("p", "experience-line", line);
        const [label, rest] = line.split(/:(.*)/s);
        if (rest) {
          const strong = createElement("strong", "", `${label}:`);
          row.replaceChildren(strong, document.createTextNode(rest));
        }
        return row;
      }));
    }

    const awards = document.querySelector("[data-awards]");
    if (awards) {
      awards.replaceChildren(...data.awards.map((award) => {
        const certificates = award.certificates || (award.certificate
          ? [{ label: "查看获奖材料", url: award.certificate }]
          : []);
        const card = certificates.length === 1
          ? createElement("a", "award-card award-link")
          : createElement("article", "award-card");
        if (certificates.length === 1) {
          card.href = certificates[0].url;
          card.target = "_blank";
          card.rel = "noopener noreferrer";
          card.setAttribute("aria-label", `查看获奖材料：${award.title}`);
        }
        const icon = createElement("div", `award-icon${award.logo ? " award-logo" : ""}`);
        icon.setAttribute("aria-hidden", "true");
        if (award.logo) {
          const logo = document.createElement("img");
          logo.src = award.logo;
          logo.alt = "";
          icon.append(logo);
        } else {
          icon.textContent = iconMap[award.icon] || "●";
        }

        const body = document.createElement("div");
        body.append(createElement("h3", "", award.title), createElement("p", "", award.description));
        if (certificates.length === 1) {
          body.append(createElement("p", "award-certificate", certificates[0].label));
        } else if (certificates.length > 1) {
          const certificateList = createElement("div", "award-certificates");
          certificateList.replaceChildren(...certificates.map((certificate) => {
            const link = createElement("a", "award-certificate", certificate.label);
            link.href = certificate.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            return link;
          }));
          body.append(certificateList);
        }

        const year = createElement("time", "", award.year);
        card.append(icon, body, year);
        return card;
      }));
    }

    const sections = document.querySelector("[data-sections]");
    if (sections) {
      sections.replaceChildren(...data.sections.map((item) => {
        const section = createElement("section", "section placeholder-section");
        section.append(createElement("h2", "", item.title));
        if (Array.isArray(item.items)) {
          const list = createElement("div", "section-lines");
          list.replaceChildren(...item.items.map((entry) => {
            const row = createElement("p", "experience-line");
            if (entry.title) {
              row.append(createElement("strong", "", `${entry.title}: `));
            }
            row.append(document.createTextNode(entry.text || ""));
            return row;
          }));
          section.append(list);
        } else {
          section.append(createElement("p", "", item.text));
        }
        return section;
      }));
    }
  })
  .catch(() => {
    document.documentElement.classList.add("profile-data-failed");
  });
