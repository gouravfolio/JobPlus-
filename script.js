/*
 FirstHire — upgraded frontend-only application
 Features:
 - page routing without a framework
 - searchable/filterable job feed
 - profile onboarding + editable profile
 - localStorage persistence
 - profile-driven match scoring
 - save/apply workflows
 - application pipeline with status changes
 - analytics dashboard
 - accessible modal + keyboard shortcut
 - dark/light theme
 - simulated fresh-job stream
*/const JOBS = [{
  id: 1, title: "Associate Frontend Developer", company: "HireTech", location: "Mumbai", salary: "₹8–10 LPA", years: "fresher", hours: 2, tags: ["JavaScript", "TypeScript", "React", "CSS"], description: "Build responsive web interfaces, reusable components and client-side experiences for a product focused on discovering fresh opportunities.", requirements: ["Deep JavaScript fundamentals", "DOM and browser APIs", "Responsive and accessible UI", "Component-driven architecture", "Async programming and API integration"]
},  {
  id: 2, title: "Frontend Engineer", company: "TechNova", location: "Bangalore", salary: "₹9–12 LPA", years: "1-3", hours: 4, tags: ["React", "TypeScript", "Redux", "REST API"], description: "Develop scalable web interfaces and reusable frontend patterns for a high-growth product engineering team.", requirements: ["React", "TypeScript", "REST APIs", "State management", "Testing fundamentals"]
},  {
  id: 3, title: "UI Engineer", company: "PixelWorks", location: "Mumbai", salary: "₹7–9 LPA", years: "fresher", hours: 6, tags: ["HTML", "CSS", "JavaScript", "Accessibility"], description: "Translate product designs into polished, accessible and responsive interfaces with strong visual consistency.", requirements: ["Semantic HTML", "Modern CSS", "JavaScript", "WCAG basics", "Cross-browser rendering"]
},  {
  id: 4, title: "React Developer", company: "CloudStack", location: "Hyderabad", salary: "₹8–11 LPA", years: "1-3", hours: 8, tags: ["React", "JavaScript", "API", "Git"], description: "Build modern React applications connected to cloud-backed APIs and collaborate with product designers.", requirements: ["React", "JavaScript", "API integration", "Git", "Component architecture"]
},  {
  id: 5, title: "Frontend Developer", company: "FinEdge", location: "Delhi", salary: "₹6–9 LPA", years: "fresher", hours: 10, tags: ["JavaScript", "React", "CSS", "REST"], description: "Create customer-facing financial interfaces with a strong focus on responsive design and performance.", requirements: ["JavaScript", "React", "CSS", "REST APIs", "Performance optimization"]
},  {
  id: 6, title: "Software Engineer — UI", company: "DataSphere", location: "Bangalore", salary: "₹10–14 LPA", years: "1-3", hours: 12, tags: ["TypeScript", "React", "WebSockets", "Testing"], description: "Develop interactive analytical dashboards and real-time interfaces for data-heavy products.", requirements: ["TypeScript", "React", "WebSocket fundamentals", "Automated testing", "Frontend architecture"]
},  {
  id: 7, title: "Junior Web Engineer", company: "LaunchPad", location: "Mumbai", salary: "₹5–7 LPA", years: "fresher", hours: 15, tags: ["HTML", "CSS", "JavaScript", "Git"], description: "Work with product engineers to build responsive web experiences and ship production-ready UI.", requirements: ["HTML", "CSS", "JavaScript", "Git", "Responsive design"]
},  {
  id: 8, title: "Frontend Platform Engineer", company: "DevCore", location: "Hyderabad", salary: "₹11–15 LPA", years: "3-5", hours: 18, tags: ["TypeScript", "React", "Performance", "Testing"], description: "Improve frontend infrastructure, performance and developer experience across multiple products.", requirements: ["Advanced JavaScript", "TypeScript", "Performance engineering", "Testing", "Frontend architecture"]
},  {
  id: 9, title: "Web Performance Engineer", company: "SpeedLabs", location: "Bangalore", salary: "₹10–13 LPA", years: "1-3", hours: 21, tags: ["JavaScript", "Web Vitals", "Caching", "Browser"], description: "Optimize loading speed, rendering behavior, caching and Core Web Vitals across customer-facing applications.", requirements: ["Core Web Vitals", "Browser rendering", "HTTP caching", "JavaScript", "Performance profiling"]
},  {
  id: 10, title: "Frontend Developer", company: "MobiStack", location: "Pune", salary: "₹7–10 LPA", years: "fresher", hours: 24, tags: ["JavaScript", "React", "PWA", "API"], description: "Build mobile-first product experiences using modern browser capabilities and API-driven interfaces.", requirements: ["JavaScript", "Responsive design", "PWA fundamentals", "API integration", "Accessibility"]
},  {
  id: 11, title: "Frontend Software Engineer", company: "OrbitPay", location: "Mumbai", salary: "₹9–13 LPA", years: "1-3", hours: 27, tags: ["TypeScript", "React", "Testing", "CSS"], description: "Build reusable interface systems for a high-scale payments experience.", requirements: ["TypeScript", "React", "Testing", "CSS architecture", "Accessibility"]
},  {
  id: 12, title: "Web Developer", company: "GrowthGrid", location: "Pune", salary: "₹6–8 LPA", years: "fresher", hours: 31, tags: ["JavaScript", "HTML", "CSS", "Git"], description: "Join a product team building responsive landing pages, dashboards and internal tools.", requirements: ["JavaScript", "HTML", "CSS", "Git", "Problem solving"]
}];
const EMPTY_PROFILE =  {
  fullName: "",
  email: "",
  phone: "",
  currentLocation: "",
  headline: "",
  bio: "",
  qualification: "",
  branch: "",
  college: "",
  graduationYear: "",
  experience: "",
  jobTitle: "",
  company: "",
  skills: [],
  targetRole: "",
  preferredLocation: "",
  workMode: "",
  expectedSalary: "",
  github: "",
  linkedin: "",
  portfolio: "",
  resumeName: ""
};
const store =  {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback
    }
    catch {
      return fallback
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
};
function loadSavedProfile() {
  const saved = store.get("fh_profile", null);
  const draft = store.get("fh_profile_draft", null);
  // Always prefer the saved profile after a refresh.
  // A draft is used only when no saved profile exists yet.
  const source = saved && typeof saved === "object" ? saved: (draft && typeof draft === "object" ? draft:  {
  });
  const profile =  {
    ... EMPTY_PROFILE,
    ... source
  };
  if (!Array.isArray(profile.skills)) {
    profile.skills = [];
  }
  return profile;
}
const state =  {
  jobs: [ ... JOBS],
  page: "home",
  profile: loadSavedProfile(),
  saved: store.get("fh_saved", []),
  applications: store.get("fh_apps", []),
  search: "",
  location: "all",
  experience: "all",
  sort: "fresh"
};
const $ = id => document.getElementById(id);
const q = sel => document.querySelector(sel);
const qa = sel => [ ... document.querySelectorAll(sel)];
document.addEventListener("DOMContentLoaded", init);
function init() {
  setDate();
  setInterval(setDate, 60000);
  loadTheme();
  bindNavigation();
  bindDiscovery();
  bindProfile();
  bindModal();
  bindNotifications();
  render();
  fillProfileForm();
  maybeWelcome();
  simulateFreshFeed();
}
function setDate() {
  $("dateLine").textContent = new Date().toLocaleDateString("en-IN",  {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}
function bindNavigation() {
  qa("[data-page]").forEach(el => el.addEventListener("click", () => go(el.dataset.page)));
  $("mobileMenu").addEventListener("click", () => $("sidebar").classList.toggle("open"));
}
function go(page) {
  state.page = page;
  qa(".page").forEach(p => p.classList.toggle("active", p.id === `${page}Page`));
  qa(".nav-link").forEach(n => n.classList.toggle("active", n.dataset.page === page));
  const titles =  {
    home: "Good morning, Engineer 👋",
    discover: "Discover fresh opportunities",
    saved: "Your saved jobs",
    applications: "Application tracker",
    profile: "Build your professional profile",
    analytics: "Your job-search analytics"
  };
  $("pageHeading").textContent = titles[page] || "FirstHire";
  $("sidebar").classList.remove("open");
  if (page === "analytics") renderAnalytics();
  if (page === "applications") renderApplications();
  if (page === "saved") renderSaved();
  if (page === "profile") fillProfileForm();
  window.scrollTo({
    top: 0, behavior: "smooth"
  });
}
function bindDiscovery() {
  const search = debounce(e =>  {
    state.search = e.target.value.trim().toLowerCase(); renderJobs()
  }, 180);
  $("searchInput").addEventListener("input", search);
  $("locationFilter").addEventListener("change", e =>  {
    state.location = e.target.value; renderJobs()
  });
  $("experienceFilter").addEventListener("change", e =>  {
    state.experience = e.target.value; renderJobs()
  });
  $("sortFilter").addEventListener("change", e =>  {
    state.sort = e.target.value; renderJobs()
  });
  $("clearFilters").addEventListener("click", resetFilters);
  document.addEventListener("keydown", e =>  {
    if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      e.preventDefault(); go("discover"); $("searchInput").focus()
    }
  });
}
function resetFilters() {
  state.search = "";
  state.location = "all";
  state.experience = "all";
  state.sort = "fresh";
  $("searchInput").value = "";
  $("locationFilter").value = "all";
  $("experienceFilter").value = "all";
  $("sortFilter").value = "fresh";
  renderJobs();
}
function bindProfile() {
  const fieldIds = ["fullName", "email", "phone", "currentLocation", "headline", "bio", "qualification", "branch", "college", "graduationYear", "experience", "jobTitle", "company", "targetRole", "preferredLocation", "workMode", "expectedSalary", "github", "linkedin", "portfolio"];
  fieldIds.forEach(id =>  {
    $(id).addEventListener("input", () =>  {
      state.profile[id] = $(id).value.trim(); persistProfileDraft(); previewProfile();
    });
  });
  ["qualification", "experience", "workMode", "expectedSalary"].forEach(id =>  {
    $(id).addEventListener("change", () =>  {
      state.profile[id] = $(id).value.trim(); persistProfileDraft(); previewProfile();
    });
  });
  $("addSkill").addEventListener("click", addSkill);
  $("skillInput").addEventListener("keydown", e =>  {
    if (e.key === "Enter") {
      e.preventDefault(); addSkill();
    }
  });
  $("profileForm").addEventListener("submit", e =>  {
    e.preventDefault(); saveProfile(fieldIds);
  });
  $("resetProfile").addEventListener("click", resetProfile);
  $("resumeFile").addEventListener("change", handleResume);
  $("removeResume").addEventListener("click", removeResume);
  $("welcomeForm").addEventListener("submit", e =>  {
    e.preventDefault(); createWelcomeProfile();
  });
  $("skipWelcome").addEventListener("click", () =>  {
    $("welcomeModal").classList.add("hidden"); store.set("fh_seenWelcome", true);
  });
  window.addEventListener("beforeunload", () =>  {
    saveCurrentProfileToStorage(fieldIds);
  });
}
function fillProfileForm() {
  const ids = ["fullName", "email", "phone", "currentLocation", "headline", "bio", "qualification", "branch", "college", "graduationYear", "experience", "jobTitle", "company", "targetRole", "preferredLocation", "workMode", "expectedSalary", "github", "linkedin", "portfolio"];
  ids.forEach(id =>  {
    $(id).value = state.profile[id] || "";
  });
  renderSkills();
  previewProfile();
  if (state.profile.resumeName) {
    $("selectedFile").classList.remove("hidden");
    $("resumeName").textContent = state.profile.resumeName;
  }
  else {
    $("selectedFile").classList.add("hidden");
    $("resumeName").textContent = "";
  }
}
function addSkill() {
  const input = $("skillInput"),
  skill = input.value.trim();
  if (!skill) return;
  if (state.profile.skills.some(x => x.toLowerCase() === skill.toLowerCase())) {
    toast("That skill is already in your profile.");
    input.value = "";
    return
  }
  state.profile.skills.push(skill);
  input.value = "";
  persistProfileDraft();
  renderSkills();
  previewProfile();
}
function renderSkills() {
  $("skillList").innerHTML = state.profile.skills.length ? state.profile.skills.map((s, i) => `<span class="skill">${escapeHTML(s)}<button type="button" data-remove-skill="${i}" aria-label="Remove ${escapeHTML(s)}">×</button></span>`).join(""): `<span class="form-help">No skills added yet.</span>`;
}
document.addEventListener("click", e =>  {
  const remove = e.target.closest("[data-remove-skill]"); if (remove) {
    state.profile.skills.splice(Number(remove.dataset.removeSkill), 1); persistProfileDraft(); renderSkills(); previewProfile(); return
  }
  const action = e.target.closest("[data-action]"); if (action) {
    const id = Number(action.dataset.id); if (action.dataset.action === "save") toggleSave(id); if (action.dataset.action === "details") openJob(id); if (action.dataset.action === "apply") applyJob(id);
  }
});
function collectProfile(ids) {
  ids.forEach(id =>  {
    state.profile[id] = $(id).value.trim();
  });
}
function saveCurrentProfileToStorage(ids) {
  if (!ids || !$('profileForm')) return;
  ids.forEach(id =>  {
    const field = $(id); if (field) {
      state.profile[id] = field.value.trim();
    }
  });
  persistProfile();
}
function persistProfileDraft() {
  const profileCopy =  {
    ... state.profile,
    skills: Array.isArray(state.profile.skills) ? [ ... state.profile.skills]: []
  };
  // Save the live form as a draft and also keep the main profile current.
  // This makes the profile survive refresh even before the user submits again.
  store.set("fh_profile_draft", profileCopy);
  store.set("fh_profile", profileCopy);
}
function saveProfile(ids) {
  if (!$("profileForm").checkValidity()) {
    $("profileForm").reportValidity();
    return;
  }
  collectProfile(ids);
  persistProfile();
  localStorage.removeItem("fh_profile_draft");
  toast("Profile saved — your matches have been updated ✓");
  renderHome();
  renderJobs();
  renderSaved();
  renderApplications();
  renderAnalytics();
  updateBadges();
}
function resetProfile() {
  if (!confirm("Reset the editable profile fields?")) return;
  state.profile =  {
    ... EMPTY_PROFILE,
    skills: []
  };
  localStorage.removeItem("fh_profile");
  localStorage.removeItem("fh_profile_draft");
  fillProfileForm();
  render();
  toast("Profile fields reset");
}
function handleResume(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    toast("Resume must be smaller than 5 MB.");
    e.target.value = "";
    return;
  }
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["pdf", "doc", "docx"].includes(ext)) {
    toast("Please choose a PDF, DOC or DOCX file.");
    e.target.value = "";
    return;
  }
  state.profile.resumeName = file.name;
  persistProfileDraft();
  $("selectedFile").classList.remove("hidden");
  $("resumeName").textContent = file.name;
  previewProfile();
}
function removeResume() {
  state.profile.resumeName = "";
  $("resumeFile").value = "";
  $("selectedFile").classList.add("hidden");
  persistProfileDraft();
  previewProfile();
}
function createWelcomeProfile() {
  const name = $("welcomeName").value.trim();
  const email = $("welcomeEmail").value.trim();
  if (!name || !email) return;
  state.profile.fullName = name;
  state.profile.email = email;
  state.profile.qualification = $("welcomeQualification").value;
  state.profile.experience = $("welcomeExperience").value;
  state.profile.targetRole = $("welcomeRole").value.trim();
  state.profile.preferredLocation = $("welcomeLocation").value.trim();
  persistProfile();
  localStorage.removeItem("fh_profile_draft");
  $("welcomeModal").classList.add("hidden");
  store.set("fh_seenWelcome", true);
  fillProfileForm();
  renderHome();
  renderJobs();
  renderSaved();
  renderApplications();
  renderAnalytics();
  updateBadges();
  toast("Welcome to FirstHire, " + name.split(" ")[0] + "! 🚀");
}
function persistProfile() {
  store.set("fh_profile",  {
    ... state.profile, skills: Array.isArray(state.profile.skills) ? [ ... state.profile.skills]: []
  });
}
function profileCompletion() {
  const values = [state.profile.fullName, state.profile.email, state.profile.phone, state.profile.currentLocation, state.profile.headline, state.profile.bio, state.profile.qualification, state.profile.branch, state.profile.college, state.profile.graduationYear, state.profile.experience, state.profile.jobTitle, state.profile.skills.length > 0, state.profile.targetRole, state.profile.preferredLocation, state.profile.workMode, state.profile.expectedSalary, state.profile.github, state.profile.linkedin, state.profile.portfolio, state.profile.resumeName];
  return Math.round(values.filter(v => v === true || String(v || "").trim() !== "").length / values.length * 100);
}
function previewProfile() {
  const p = state.profile,
  c = profileCompletion(),
  name = p.fullName || "Guest User";
  $("candidateAvatar").textContent = initials(name);
  $("candidateName").textContent = name;
  $("candidateHeadline").textContent = p.headline || "Add a professional headline";
  $("candidateLocation").textContent = "⌖ " + (p.currentLocation || "Location not added");
  $("candidateScore").textContent = c + "%";
  $("candidateProgress").style.width = c + "%";
  $("candidateTags").innerHTML = p.skills.slice(0, 6).map(s => `<span>${escapeHTML(s)}</span>`).join("");
  $("profilePercent").textContent = c + "%";
  $("scoreValue").textContent = c + "%";
  $("scoreCircle").style.background = `conic-gradient(var(--primary) ${c * 3.6}deg,var(--surface-3) 0deg)`;
  $("metricProfile").textContent = c + "%";
  $("sideAvatar").textContent = initials(name);
  $("topAvatar").textContent = initials(name);
  $("sideName").textContent = p.fullName || "Guest User";
  $("topName").textContent = p.fullName || "Guest";
  $("sideRole").textContent = p.targetRole || "Complete your profile";
  const tip = c < 35 ? "Start with your name, education and target role.": c < 70 ? "Add technical skills and preferences to improve matching.": c < 100 ? "Almost there — links and resume details can strengthen your profile.": "Excellent. Your profile is ready for stronger personalized matches.";
  $("matchingTip").textContent = tip;
  renderProfileChecks();
}
function renderProfileChecks() {
  const checks = [["Basic identity", !!(state.profile.fullName && state.profile.email)], ["Education", !!(state.profile.qualification && state.profile.branch && state.profile.college)], ["Experience", !!state.profile.experience], ["Technical skills", state.profile.skills.length >= 3], ["Job preferences", !!(state.profile.targetRole && state.profile.preferredLocation)], ["Professional links", !!(state.profile.github || state.profile.linkedin || state.profile.portfolio)], ["Resume", !!state.profile.resumeName]];
  $("profileChecks").innerHTML = checks.map(([label, done]) => `<div class="check-row ${done ? "done" : ""}"><i>${done ? "✓" : "○"}</i><span>${label}</span></div>`).join("");
}
function render() {
  renderHome();
  renderJobs();
  renderSaved();
  renderApplications();
  renderAnalytics();
  updateBadges();
}
function renderHome() {
  $("metricFresh").textContent = state.jobs.filter(j => j.hours <= 24).length;
  $("metricSaved").textContent = state.saved.length;
  $("metricApplications").textContent = state.applications.length;
  const ranked = [ ... state.jobs].sort((a, b) => matchScore(b) - matchScore(a));
  $("heroMatch").textContent = (ranked[0] ? matchScore(ranked[0]): 96) + "%";
  $("recommendedList").innerHTML = ranked.slice(0, 5).map(recommendedHTML).join("");
  $("freshJobs").innerHTML = [ ... state.jobs].sort((a, b) => a.hours - b.hours).slice(0, 3).map(miniJobHTML).join("");
}
function recommendedHTML(job) {
  return`<article class="recommended-item" data-action="details" data-id="${job.id}">
 <div class="company-logo">${escapeHTML(companyInitials(job.company))}</div>
 <div class="job-copy"><strong>${escapeHTML(job.title)}</strong><span>${escapeHTML(job.company)} · ${escapeHTML(job.location)}</span></div>
 <div class="recommended-right"><b class="match">${matchScore(job)}% match</b><span>${timeLabel(job.hours)}</span></div>
 </article>`;
}
function miniJobHTML(job) {
  return`<article class="mini-job" data-action="details" data-id="${job.id}">
 <div class="mini-job-top"><div class="company-logo">${escapeHTML(companyInitials(job.company))}</div><span class="match">${timeLabel(job.hours)}</span></div>
 <h3>${escapeHTML(job.title)}</h3><p>${escapeHTML(job.company)} · ${escapeHTML(job.location)}</p>
 <div class="mini-job-bottom"><strong>${escapeHTML(job.salary)}</strong><span>${matchScore(job)}% match</span></div>
 </article>`;
}
function getFilteredJobs() {
  let list = state.jobs.filter(job =>  {
    const text = [job.title, job.company, job.location, ... job.tags].join(" ").toLowerCase(); const searchOk = !state.search || text.includes(state.search); const locationOk = state.location === "all" || job.location === state.location; const expOk = state.experience === "all" || job.years === state.experience; return searchOk && locationOk && expOk;
  });
  if (state.sort === "fresh") list.sort((a, b) => a.hours - b.hours);
  if (state.sort === "match") list.sort((a, b) => matchScore(b) - matchScore(a));
  if (state.sort === "salary") list.sort((a, b) => salaryNumber(b.salary) - salaryNumber(a.salary));
  return list;
}
function renderJobs() {
  const list = getFilteredJobs();
  $("resultsLabel").textContent = `${list.length} ${list.length === 1 ? "job" : "jobs"}`;
  $("jobsGrid").innerHTML = list.map(jobCardHTML).join("");
  $("jobsEmpty").classList.toggle("hidden", list.length !== 0);
  const chips = [];
  if (state.search) chips.push(`Search: ${state.search}`);
  if (state.location !== "all") chips.push(state.location);
  if (state.experience !== "all") chips.push(state.experience === "fresher" ? "Fresher": "${state.experience} years");
  $("activeFilters").innerHTML = chips.map(x => `<span class="filter-chip">${escapeHTML(x)}</span>`).join("");
}
function jobCardHTML(job) {
  const saved = state.saved.includes(job.id),
  applied = state.applications.some(a => a.jobId === job.id);
  return`<article class="job-card">
 <div class="job-card-top"><div class="company-logo">${escapeHTML(companyInitials(job.company))}</div><button class="save-button ${saved ? "saved" : ""}" data-action="save" data-id="${job.id}" aria-label="${saved ? "Remove saved job" : "Save job"}">${saved ? "♥" : "♡"}</button></div>
 <h3>${escapeHTML(job.title)}</h3><p class="job-company">${escapeHTML(job.company)} · ${escapeHTML(job.location)}</p>
 <div class="job-tags">${job.tags.map(t => `
  <span class="tag">
    ${escapeHTML(t)}
  </span>
`).join("")}</div>
 <div class="job-card-bottom"><div><strong>${escapeHTML(job.salary)}</strong><small>${timeLabel(job.hours)} · ${experienceLabel(job.years)}</small></div><span class="match-score">${matchScore(job)}% match</span></div>
 <div class="card-actions"><button class="button secondary" data-action="details" data-id="${job.id}">View details</button><button class="button primary" data-action="apply" data-id="${job.id}" ${applied ? "disabled" : ""}>${applied ? "Applied ✓" : "Apply now"}</button></div>
 </article>`;
}
function renderSaved() {
  const list = state.jobs.filter(j => state.saved.includes(j.id));
  $("savedGrid").innerHTML = list.map(jobCardHTML).join("");
  $("savedEmpty").classList.toggle("hidden", list.length !== 0);
}
function renderApplications() {
  const statuses = ["Applied", "Interview", "Offer", "Rejected"];
  const counts = Object.fromEntries(statuses.map(s => [s, state.applications.filter(a => a.status === s).length]));
  $("countApplied").textContent = counts.Applied;
  $("countInterview").textContent = counts.Interview;
  $("countOffer").textContent = counts.Offer;
  $("countRejected").textContent = counts.Rejected;
  $("pipelineStats").innerHTML = statuses.map(s => `<div class="pipeline-card"><span>${s === "Rejected" ? "Closed" : s}</span><strong>${counts[s]}</strong><small>tracked applications</small></div>`).join("");
  const cols =  {
    Applied: $("colApplied"),
    Interview: $("colInterview"),
    Offer: $("colOffer"),
    Rejected: $("colRejected")
  };
  statuses.forEach(s => cols[s].innerHTML = "");
  state.applications.forEach(app =>  {
    const job = state.jobs.find(j => j.id === app.jobId); if (!job) return; cols[app.status].insertAdjacentHTML("beforeend", applicationHTML(app, job));
  });
}
function applicationHTML(app, job) {
  return`<article class="application-card">
 <div class="company-line"><div class="company-logo">${escapeHTML(companyInitials(job.company))}</div><span class="match">${matchScore(job)}%</span></div>
 <h4>${escapeHTML(job.title)}</h4><p>${escapeHTML(job.company)} · ${new Date(app.appliedAt).toLocaleDateString("en-IN")}</p>
 <select data-status-id="${app.id}" aria-label="Change application status">
   ${["Applied", "Interview", "Offer", "Rejected"].map(s => `
  <option ${s === app.status ? "selected" : ""}>
    ${s}
  </option>
`).join("")}
 </select></article>`;
}
document.addEventListener("change", e =>  {
  const select = e.target.closest("[data-status-id]"); if (!select) return; const app = state.applications.find(a => a.id === Number(select.dataset.statusId)); if (!app) return; app.status = select.value; store.set("fh_apps", state.applications); renderApplications(); updateBadges(); toast("Application status updated");
});
function renderAnalytics() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const values = days.map((_, i) =>  {
    const date = new Date(); date.setDate(date.getDate() - (6 - i)); return state.applications.filter(a => new Date(a.appliedAt).toDateString() === date.toDateString()).length;
  });
  const max = Math.max( ... values, 1);
  $("activityChart").innerHTML = values.map((v, i) => `<div class="bar"><i style="--h:${Math.max(4, v / max * 155)}px"></i><span>${days[i]}</span></div>`).join("");
  const c = profileCompletion();
  const health = [["Profile completeness", c + "%", c >= 70], ["Saved-job activity", state.saved.length + " saved", state.saved.length > 0], ["Application pipeline", state.applications.length + " tracked", state.applications.length > 0], ["Target role", state.profile.targetRole || "Not set", !!state.profile.targetRole], ["Preferred location", state.profile.preferredLocation || "Not set", !!state.profile.preferredLocation]];
  $("searchHealth").innerHTML = health.map(([name, value, good]) => `<div class="health-row"><div><i class="health-dot" style="background:${good ? "var(--green)" : "var(--yellow)"}"></i><span>${name}</span></div><strong>${escapeHTML(value)}</strong></div>`).join("");
  const freq =  {
  };
  state.profile.skills.forEach(s => freq[s] = (freq[s] || 0) + 1);
  $("skillFrequency").innerHTML = Object.keys(freq).length ? Object.keys(freq).map(s => `<span>${escapeHTML(s)} <b>· ${freq[s]}</b></span>`).join(""): `<span>Add skills in your profile to see them here.</span>`;
}
function matchScore(job) {
  let score = 62;
  const text = (job.title + " " + job.company + " " + job.location + " " + job.tags.join(" ")).toLowerCase();
  const keywords = [state.profile.targetRole, state.profile.headline, state.profile.branch, ... state.profile.skills].join(" ").toLowerCase().split(/\W+/).filter(x => x.length > 2);
  const unique = [ ... new Set(keywords)];
  unique.forEach(word =>  {
    if (text.includes(word)) score += 4
  });
  if (state.profile.preferredLocation && job.location.toLowerCase().includes(state.profile.preferredLocation.toLowerCase())) score += 8;
  if (state.profile.experience && job.years === state.profile.experience) score += 7;
  return Math.min(99, Math.max(55, score));
}
function toggleSave(id) {
  const index = state.saved.indexOf(id);
  if (index === - 1) {
    state.saved.push(id);
    toast("Job saved to your shortlist ♥")
  }
  else {
    state.saved.splice(index, 1);
    toast("Job removed from your shortlist")
  }
  store.set("fh_saved", state.saved);
  render();
  updateBadges();
}
function applyJob(id) {
  if (state.applications.some(a => a.jobId === id)) {
    toast("You have already applied to this job.");
    return
  }
  const job = state.jobs.find(j => j.id === id);
  if (!job) return;
  state.applications.unshift({
    id: Date.now(), jobId: id, status: "Applied", appliedAt: new Date().toISOString()
  });
  store.set("fh_apps", state.applications);
  render();
  updateBadges();
  toast(`Application submitted to ${job.company} ✓`);
  closeModal();
}
function openJob(id) {
  const job = state.jobs.find(j => j.id === id);
  if (!job) return;
  const saved = state.saved.includes(id),
  applied = state.applications.some(a => a.jobId === id);
  $("jobModalContent").innerHTML = `<div class="modal-job-head"><div class="company-logo">${escapeHTML(companyInitials(job.company))}</div><div><h2 id="jobModalTitle">${escapeHTML(job.title)}</h2><p>${escapeHTML(job.company)} · ${escapeHTML(job.location)} · ${escapeHTML(job.salary)} · ${matchScore(job)}% match</p></div></div>
 <div class="modal-section"><h3>About the role</h3><p>${escapeHTML(job.description)}</p></div>
 <div class="modal-section">
  <h3>Key requirements</h3>
  <ul>${job.requirements.map(r => `
    <li>
      ${escapeHTML(r)}
    </li>
  `).join("")}</ul>
 </div>
 <div class="modal-section">
  <h3>Skills</h3>
  <div class="job-tags">${job.tags.map(t => `
    <span class="tag">
      ${escapeHTML(t)}
    </span>
  `).join("")}</div>
 </div>
 <div class="modal-actions"><button class="button secondary" data-action="save" data-id="${job.id}">${saved ? "♥ Saved" : "♡ Save job"}</button><button class="button primary" data-action="apply" data-id="${job.id}" ${applied ? "disabled" : ""}>${applied ? "Applied ✓" : "Apply now"}</button></div>`;
  $("jobModal").classList.remove("hidden");
}
function bindModal() {
  $("modalClose").addEventListener("click", closeModal);
  $("jobModal").addEventListener("click", e =>  {
    if (e.target === $("jobModal")) closeModal()
  });
  document.addEventListener("keydown", e =>  {
    if (e.key === "Escape") {
      closeModal(); $("notificationPopover").classList.add("hidden")
    }
  })
}
function closeModal() {
  $("jobModal").classList.add("hidden")
}
function bindNotifications() {
  $("notificationButton").addEventListener("click", () => $("notificationPopover").classList.toggle("hidden"));
  $("closeNotifications").addEventListener("click", () => $("notificationPopover").classList.add("hidden"));
}
function updateBadges() {
  $("savedBadge").textContent = state.saved.length;
  $("applicationBadge").textContent = state.applications.length;
  $("newJobsBadge").textContent = state.jobs.filter(j => j.hours <= 6).length;
}
function loadTheme() {
  const theme = localStorage.getItem("fh_theme") || "light";
  document.documentElement.dataset.theme = theme;
  $("themeIcon").textContent = theme === "dark" ? "☀": "☾";
  $("themeToggle").addEventListener("click", () =>  {
    const next = document.documentElement.dataset.theme === "dark" ? "light": "dark"; document.documentElement.dataset.theme = next; localStorage.setItem("fh_theme", next); $("themeIcon").textContent = next === "dark" ? "☀": "☾";
  });
}
function maybeWelcome() {
  if (store.get("fh_seenWelcome", false) || state.profile.fullName) return;
  setTimeout(() => $("welcomeModal").classList.remove("hidden"), 450);
}
function addJobNotification(job) {
  const notification = document.createElement("div");
  notification.className = "notification-item";
  notification.innerHTML = `
    <span>⚡</span>
    <div>
      <strong>${escapeHTML(job.title)} at ${escapeHTML(job.company)}</strong>
      <p>${escapeHTML(job.location)} · ${escapeHTML(job.salary)} · New job just arrived.</p>
    </div>
  `;
  $("notificationPopover").appendChild(notification);
  $("notificationButton").classList.add("new-notification");
  setTimeout(() => $("notificationButton").classList.remove("new-notification"), 2600);
}

function simulateFreshFeed() {
  const freshJobs = [{
    title: "Frontend Engineer", company: "NextGen Labs", location: "Mumbai", salary: "₹8–12 LPA", years: "fresher", tags: ["JavaScript", "React", "TypeScript", "Web"], description: "Build modern product interfaces with a collaborative engineering team.", requirements: ["JavaScript", "React", "Responsive UI", "API integration", "Problem solving"]
  },  {
    title: "React UI Developer", company: "BrightByte", location: "Pune", salary: "₹7–10 LPA", years: "fresher", tags: ["React", "JavaScript", "CSS", "Git"], description: "Create responsive interfaces and reusable components for a growing product team.", requirements: ["React", "JavaScript", "CSS", "Git", "Responsive design"]
  },  {
    title: "Junior Frontend Developer", company: "NovaWorks", location: "Bangalore", salary: "₹6–9 LPA", years: "fresher", tags: ["HTML", "CSS", "JavaScript", "REST API"], description: "Work with designers and engineers to build accessible customer-facing web experiences.", requirements: ["HTML", "CSS", "JavaScript", "REST APIs", "Accessibility"]
  },  {
    title: "UI Developer", company: "CodeNest", location: "Hyderabad", salary: "₹7–11 LPA", years: "fresher", tags: ["JavaScript", "React", "TypeScript", "Testing"], description: "Build polished UI components and help maintain a consistent frontend design system.", requirements: ["JavaScript", "React", "TypeScript", "Testing", "Component design"]
  }];
  let feedIndex = 0;
  function addFreshJob() {
    const template = freshJobs[feedIndex % freshJobs.length];
    feedIndex += 1;
    const job =  {
      ... template,
      id: Date.now(),
      hours: 0
    };
    state.jobs.unshift(job);
    // Update only the job-related UI. Do not rebuild the profile form.
    renderHome();
    renderJobs();
    renderSaved();
    renderApplications();
    renderAnalytics();
    updateBadges();
    addJobNotification(job);
    $("feedTime").textContent = "just now";
    toast("⚡ A fresh frontend opportunity arrived");
  }
  // Add a different fresh job notification after 45 seconds, then every 45 seconds.
  setTimeout(() =>  {
    addFreshJob();
    setInterval(addFreshJob, 45000);
  }, 45000);
}
function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase() || "G";
}
function companyInitials(name) {
  return name.split(/\s+/).map(x => x[0]).join("").slice(0, 2).toUpperCase()
}
function salaryNumber(s) {
  const nums = s.match(/\d+/g);
  return nums ? Number(nums[nums.length - 1]): 0
}
function timeLabel(h) {
  return h < 24 ? `${h}h ago`: `${Math.floor(h / 24)}d ago`
}
function experienceLabel(v) {
  return({
    fresher: "Fresher", "1-3": "1–3 yrs", "3-5": "3–5 yrs", "5+": "5+ yrs"
  })[v] || "Any experience"
}
function escapeHTML(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }
  [c]))
}
function debounce(fn, wait) {
  let t;
  return( ... args) =>  {
    clearTimeout(t);
    t = setTimeout(() => fn( ... args), wait)
  }
}
let toastTimer;
function toast(message) {
  $("toastMessage").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600)
}
window.FirstHire =  {
  state,
  go,
  matchScore,
  render
};
