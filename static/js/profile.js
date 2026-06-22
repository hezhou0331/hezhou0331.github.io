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
    document.title = `${profile.name} | Academic Homepage`;

    setText("[data-profile-name]", profile.name);
    setText("[data-profile-name-chinese]", profile.nameChinese);
    setText("[data-profile-role]", `${profile.role} at ${profile.university}`);
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

    const awards = document.querySelector("[data-awards]");
    if (awards) {
      awards.replaceChildren(...data.awards.map((award) => {
        const card = createElement("article", "award-card");
        const icon = createElement("div", "award-icon", iconMap[award.icon] || "●");
        icon.setAttribute("aria-hidden", "true");

        const body = document.createElement("div");
        body.append(createElement("h3", "", award.title), createElement("p", "", award.description));

        const year = createElement("time", "", award.year);
        card.append(icon, body, year);
        return card;
      }));
    }

    const sections = document.querySelector("[data-sections]");
    if (sections) {
      sections.replaceChildren(...data.sections.map((item) => {
        const section = createElement("section", "section placeholder-section");
        section.append(createElement("h2", "", item.title), createElement("p", "", item.text));
        return section;
      }));
    }
  })
  .catch(() => {
    document.documentElement.classList.add("profile-data-failed");
  });
