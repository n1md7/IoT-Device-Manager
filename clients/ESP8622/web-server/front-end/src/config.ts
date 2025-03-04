document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("config-form") as HTMLFormElement | null;
  const statusDiv = document.getElementById("status") as HTMLDivElement | null;
  const resetButton = document.getElementById(
    "reset-button",
  ) as HTMLButtonElement | null;

  const inputs: { [key: string]: HTMLInputElement | null } = {
    name: document.getElementById("name") as HTMLInputElement | null,
    description: document.getElementById(
      "description",
    ) as HTMLInputElement | null,
    startTime: document.getElementById("startTime") as HTMLInputElement | null,
    managerUrl: document.getElementById(
      "managerUrl",
    ) as HTMLInputElement | null,
  };

  const fetchInfo = async (): Promise<any> => {
    try {
      const response = await fetch("/api/info");
      if (!response.ok) {
        throw new Error("Failed to fetch info: " + response.statusText);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        updateStatus(error.message, false);
      }

      console.error(error);
      updateStatus("Failed to fetch info. Unknown Error", false);
    }
  };

  const resetConfig = async (): Promise<void> => {
    try {
      const response = await fetch("/api/config-reset");
      if (!response.ok) {
        throw new Error(
          "Failed to reset configuration: " + response.statusText,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        updateStatus(error.message, false);
      }

      console.error(error);
      updateStatus("Failed to reset configuration. Unknown Error", false);
    }
  };

  const populateForm = (info: any, by: string = "current"): void => {
    if (!info) return;
    Object.keys(inputs).forEach((key) => {
      const input = inputs[key];
      if (input) {
        input.value = info[by][key] || info.defaults[key] || "";
      }
    });
  };

  const updateStatus = (message: string, isSuccess: boolean = true): void => {
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = isSuccess ? "text-success" : "error-text";
      statusDiv.classList.remove("hidden");
    }
  };

  const info = await fetchInfo();

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(inputs).map(([key, input]) => [
            key,
            input?.value || "",
          ]),
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
  }

  if (resetButton) {
    resetButton.addEventListener("click", async () => {
      await resetConfig();
      populateForm(await info, "defaults");
      updateStatus("Configuration reset to default values.");
    });
  }

  populateForm(await info);
});
