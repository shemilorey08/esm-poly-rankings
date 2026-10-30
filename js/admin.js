document.addEventListener("DOMContentLoaded", function () {
    const supabase = window.esmSupabase;

    const loginForm = document.getElementById("adminLoginForm");
    const loginSection = document.getElementById("loginSection");
    const dashboardSection = document.getElementById("dashboardSection");
    const loginMessage = document.getElementById("loginMessage");
    const logoutButton = document.getElementById("adminLogout");

    if (!supabase) {
        loginMessage.textContent = "Database connection failed. Refresh the page.";
        return;
    }

    async function showDashboard(user) {
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("display_name, role")
            .eq("id", user.id)
            .single();

        if (error || !profile ||
            !["admin", "editor"].includes(profile.role)) {

            await supabase.auth.signOut();

            loginMessage.textContent =
                "Access denied. This account is not authorised.";
            return;
        }

        loginSection.hidden = true;
        dashboardSection.hidden = false;

        document.getElementById("adminName").textContent =
            profile.display_name || "Administrator";
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        loginMessage.textContent = "Signing in...";

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            loginMessage.textContent = error.message;
            return;
        }

        await showDashboard(data.user);
    });

    logoutButton.addEventListener("click", async function () {
        await supabase.auth.signOut();

        dashboardSection.hidden = true;
        loginSection.hidden = false;
        loginForm.reset();

        loginMessage.textContent = "You have logged out.";
    });

    async function checkExistingSession() {
        const { data, error } = await supabase.auth.getSession();

        if (!error && data.session) {
            await showDashboard(data.session.user);
        }
    }

    checkExistingSession();
});
