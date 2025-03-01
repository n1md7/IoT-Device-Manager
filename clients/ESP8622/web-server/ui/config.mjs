document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("config-form");
  const statusDiv = document.getElementById("status");
  const resetButton = document.getElementById("reset-button");

  const fetchInfo = async () => {
    const response = await fetch("/api/info");
    if (response.ok) {
      return response.json();
    }
    throw new Error("Failed to fetch info");
  };

  const populateForm = (info) => {
    document.getElementById("name").value =
      info.current.name || info.defaults.name;
    document.getElementById("description").value =
      info.current.description || info.defaults.description;
    document.getElementById("startTime").value =
      info.current.startTime || info.defaults.startTime;
    document.getElementById("managerUrl").value =
      info.current.managerUrl || info.defaults.managerUrl;
  };

  const updateStatus = (message, isSuccess = true) => {
    statusDiv.textContent = message;
    statusDiv.className = isSuccess ? "text-success" : "error-text";
    statusDiv.classList.remove("hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const params = new URLSearchParams(formData).toString();

    const response = await fetch(`/api/config-update?${params}`);
    if (response.status === 204) {
      updateStatus("Configuration updated successfully!");
    } else {
      updateStatus("Failed to update configuration.", false);
    }
  });

  resetButton.addEventListener("click", async () => {
    const info = await fetchInfo();
    populateForm(info.defaults);
    updateStatus("Configuration reset to default values.");
  });

  try {
    const info = await fetchInfo();
    populateForm(info);
  } catch (error) {
    updateStatus("Failed to load configuration.", false);
  }
});
