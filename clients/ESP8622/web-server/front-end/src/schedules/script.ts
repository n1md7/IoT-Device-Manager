document.addEventListener("DOMContentLoaded", () => {
  // Get references to the input fields and buttons in the HTML document
  const startTimeInput = document.getElementById(
    "start-time",
  ) as HTMLInputElement;
  const endTimeInput = document.getElementById("end-time") as HTMLInputElement;
  const websiteRestrictions = document.getElementById(
    "website-restrictions",
  ) as HTMLInputElement;
  const saveButton = document.getElementById(
    "save-schedule",
  ) as HTMLButtonElement;
  const weekdayCheckboxes =
    document.querySelectorAll<HTMLInputElement>(".weekdays input");

  // Define the structure of the schedule data
  interface Schedule {
    start_time: string;
    end_time: string;
    website_restrictions: string;
    weekdays: string[];
  }

  // Function to fetch the existing schedule from the server and update the UI
  function fetchSchedule(): void {
    fetch("/api/schedules") // Send GET request to the server
      .then((response) => response.json()) // Parse response as JSON
      .then((data: Schedule) => {
        // Populate the input fields with retrieved schedule data
        startTimeInput.value = data.start_time;
        endTimeInput.value = data.end_time;
        websiteRestrictions.value = data.website_restrictions;

        // Update weekday checkboxes based on the saved schedule
        weekdayCheckboxes.forEach((checkbox) => {
          checkbox.checked = data.weekdays.includes(checkbox.id);
        });
      })
      .catch((error) => console.error("Error fetching schedule:", error)); // Handle errors
  }

  // Function to save the updated schedule to the server
  function saveSchedule(): void {
    const scheduleData: Schedule = {
      start_time: startTimeInput.value, // Get start time from input field
      end_time: endTimeInput.value, // Get end time from input field
      website_restrictions: websiteRestrictions.value, // Get restricted websites
      weekdays: Array.from(weekdayCheckboxes) // Convert NodeList to an array
        .filter((checkbox) => checkbox.checked) // Filter checked checkboxes
        .map((checkbox) => checkbox.id), // Extract IDs of checked boxes
    };

    fetch("/api/schedules", {
      method: "POST", // Send a POST request to update the schedule
      headers: { "Content-Type": "application/json" }, // Specify JSON format
      body: JSON.stringify(scheduleData), // Convert schedule object to JSON string
    })
      .then((response) => response.json()) // Parse server response as JSON
      .then((data) => console.log("Schedule saved:", data)) // Log confirmation message
      .catch((error) => console.error("Error saving schedule:", error)); // Handle errors
  }

  // Attach event listener to the save button to trigger saving on click
  saveButton.addEventListener("click", saveSchedule);

  // Fetch and display the schedule when the page loads
  fetchSchedule();
});
