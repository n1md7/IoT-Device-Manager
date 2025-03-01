document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("config-form");
  const statusDiv = document.getElementById("status");
  const resetButton = document.getElementById("reset-button");

  const inputs = {
    name: document.getElementById("name"),
    description: document.getElementById("description"),
    startTime: document.getElementById("startTime"),
    managerUrl: document.getElementById("managerUrl"),
  };

  const fetchInfo = async () => {
    try {
      const response = await fetch("/api/info");
      if (!response.ok)
        throw new Error("Failed to fetch info: " + response.statusText);
      return await response.json();
    } catch (error) {
      updateStatus(error.message, false);
    }
  };

  const resetConfig = async () => {
    try {
      const response = await fetch("/api/config-reset");
      if (!response.ok)
        throw new Error(
          "Failed to reset configuration: " + response.statusText,
        );
    } catch (error) {
      updateStatus(error.message, false);
    }
  };

  const populateForm = (info, by = "current") => {
    if (!info) return;
    Object.keys(inputs).forEach((key) => {
      inputs[key].value = info[by][key] || info.defaults[key] || "";
    });
  };

  const updateStatus = (message, isSuccess = true) => {
    statusDiv.textContent = message;
    statusDiv.className = isSuccess ? "text-success" : "error-text";
    statusDiv.classList.remove("hidden");
  };

  const info = fetchInfo();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(inputs).map(([key, input]) => [key, input.value]),
      ),
    );

    try {
      const response = await fetch(`/api/config-update?${params.toString()}`);
      updateStatus(
        response.ok
          ? "Configuration updated successfully!"
          : "Failed to update configuration.",
        response.ok,
      );
    } catch {
      updateStatus("Failed to update configuration.", false);
    }
  });

  resetButton.addEventListener("click", async () => {
    await resetConfig();
    populateForm(await info, "defaults");
    updateStatus("Configuration reset to default values.");
  });

  populateForm(await info);
});
