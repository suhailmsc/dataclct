const form = document.getElementById("profileForm");
const message = document.getElementById("message");

// Safely parse a response that may not be JSON (e.g. a server error page)
async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Saving...";

  const data = new FormData(form);

  try {
    const response = await fetch("/api/profiles", {
      method: "POST",
      body: data
    });

    const result = await readJson(response);

    if (!response.ok) {
      throw new Error(result.error || "Could not save profile");
    }

    message.textContent = result.message;
    form.reset();
    await loadProfiles();
  } catch (error) {
    message.textContent = error.message;
  }
});

async function loadProfiles() {
  const container = document.getElementById("profiles");

  try {
    const response = await fetch("/api/profiles");
    if (!response.ok) throw new Error("Could not load profiles");
    const profiles = await response.json();

    container.replaceChildren();

    profiles.forEach(profile => {
      const card = document.createElement("div");
      card.className = "card";

      const name = document.createElement("h3");
      name.textContent = profile.name;

      const id = document.createElement("p");
      id.textContent = "ID: " + profile.user_id;

      const country = document.createElement("p");
      country.textContent = "Country: " + profile.country;

      card.append(name, id, country);

      if (profile.photo) {
        const image = document.createElement("img");
        image.src = profile.photo;
        image.alt = "Profile photo";
        image.width = 100;
        card.append(image);
      }

      container.append(card);
    });
  } catch (error) {
    container.textContent = error.message;
  }
}

loadProfiles();
