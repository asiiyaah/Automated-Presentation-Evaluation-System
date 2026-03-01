
// Get tag from URL
const params = new URLSearchParams(window.location.search);
const tag = params.get("tag") || "Public Speaking";

document.getElementById("tagTitle").textContent = `Tag: ${tag}`;

// Dummy Data
const scores = [65, 72, 78, 85, 91];

// Score Trend Chart
const ctx1 = document.getElementById("scoreChart");

new Chart(ctx1, {
    type: "line",
    data: {
        labels: ["Video 1", "Video 2", "Video 3", "Video 4", "Video 5"],
        datasets: [{
            label: "Confidence Score",
            data: scores,
            borderColor: "#cbd5f5",
            backgroundColor: "rgba(203,213,245,0.2)",
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        plugins: {
            legend: { labels: { color: "white" } }
        },
        scales: {
            x: { ticks: { color: "white" } },
            y: { ticks: { color: "white" } }
        }
    }
});

// Improvement Chart
const ctx2 = document.getElementById("improvementChart");

new Chart(ctx2, {
    type: "bar",
    data: {
        labels: ["Filler Words", "Posture", "Eye Contact", "Confidence"],
        datasets: [{
            label: "Average Performance",
            data: [70, 80, 75, 88],
            backgroundColor: "#a5b4fc",
            barThickness: 50,
            categoryPercentage: 0.9
        }]
    },
    options: {
        plugins: {
            legend: { labels: { color: "white" } }
        },
        scales: {
            x: { ticks: { color: "white" } },
            y: { ticks: { color: "white" } }
        }
    }
});


/* ===============================
   PROFILE PANEL TOGGLE
================================= */

window.toggleProfile = function () {
    const profilePanel = document.getElementById("profilePanel");
    if (!profilePanel) return;

    profilePanel.classList.toggle("active");
};


/* Close profile when clicking outside */
document.addEventListener("click", (e) => {
    const profilePanel = document.getElementById("profilePanel");
    if (!profilePanel) return;

    const clickedInsideProfile = profilePanel.contains(e.target);
    const clickedProfileIcon = e.target.closest(".profile-icon");

    if (!clickedInsideProfile && !clickedProfileIcon) {
        profilePanel.classList.remove("active");
    }
}); 