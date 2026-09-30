// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

async function requireAdmin() {

    try {

        // Check logged-in user
        const {
            data: {
                user
            },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (userError || !user) {

            window.location.href = "login.html";
            return null;
        }


        // Check profile
        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("id, role")
            .eq("id", user.id)
            .single();


        if (
            profileError ||
            !profile ||
            profile.role !== "admin"
        ) {

            await supabaseClient.auth.signOut();

            window.location.href = "login.html";

            return null;
        }


        // Admin verified
        return {
            user: user,
            profile: profile
        };

    } catch (error) {

        console.error("Admin authentication error:", error);

        window.location.href = "login.html";

        return null;
    }
}


// ==========================================
// LOGOUT
// ==========================================

async function adminLogout() {

    try {

        await supabaseClient.auth.signOut();

    } catch (error) {

        console.error("Logout error:", error);

    }

    window.location.href = "login.html";
}
