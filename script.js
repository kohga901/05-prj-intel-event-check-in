const GOAL = 50;

// Load from localStorage or initialize
let totalCount = parseInt(localStorage.getItem("totalCount")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0
};
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// Elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

const attendeeList = document.getElementById("attendeeList");

// ---------- Initialize UI from saved data ----------
function initializeUI() {
  attendeeCountSpan.textContent = totalCount;
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;

  updateProgressBar();
  renderAttendeeList();
}

function updateProgressBar() {
  const percent = Math.min((totalCount / GOAL) * 100, 100);
  progressBar.style.width = percent + "%";
}

function saveData() {
  localStorage.setItem("totalCount", totalCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  attendees.forEach(person => {
    const div = document.createElement("div");
    div.textContent = `${person.name} — ${person.teamLabel}`;
    attendeeList.appendChild(div);
  });
}

function getWinningTeam() {
  let max = 0;
  let winner = "";

  for (let team in teamCounts) {
    if (teamCounts[team] > max) {
      max = teamCounts[team];
      winner = team;
    }
  }

  if (!winner) return "";

  if (winner === "water") return "🌊 Team Water Wise";
  if (winner === "zero") return "🌿 Team Net Zero";
  if (winner === "power") return "⚡ Team Renewables";
}

// ---------- Form Submit ----------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  if (!name || !team) return;

  const selectedOption = teamSelect.options[teamSelect.selectedIndex];
  const teamLabel = selectedOption.text;

  // Increment counts
  totalCount++;
  teamCounts[team]++;

  // Store attendee
  attendees.push({ name, teamLabel });

  // Update UI
  attendeeCountSpan.textContent = totalCount;
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;

  updateProgressBar();
  renderAttendeeList();
  saveData();

  // Greeting
  greeting.style.display = "block";
  greeting.classList.add("success-message");
  greeting.textContent = `Welcome ${name}! You’ve joined ${teamLabel}.`;

  // Celebration if goal reached
  if (totalCount === GOAL) {
    const winner = getWinningTeam();
    greeting.textContent = `🎉 Goal reached! ${winner} wins with the highest turnout!`;
  }

  form.reset();
});

// Initialize on load
initializeUI();