/* =====================================================
   LATA & RAKIB - SUPABASE REALTIME CHAT SYSTEM (LOCKED)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const db = window.supabaseClient || supabaseClient;

    if (!db) {
        console.error("Supabase client is not loaded!");
        return;
    }

    // 🔑 সিক্রেট পাসওয়ার্ড এখানে সেট করুন
    const SECRET_PASSWORD = "667968"; // আপনার পছন্দমত পাসওয়ার্ড দিন

    // Elements
    const chatToggleBtn = document.getElementById("chatToggleBtn");
    const chatWindow = document.getElementById("chatWindow");
    const chatCloseBtn = document.getElementById("chatCloseBtn");
    
    // Lock Elements
    const chatLockContainer = document.getElementById("chatLockContainer");
    const chatPasswordInput = document.getElementById("chatPasswordInput");
    const unlockChatBtn = document.getElementById("unlockChatBtn");
    const lockErrorMsg = document.getElementById("lockErrorMsg");

    // Chat Elements
    const chatNameContainer = document.getElementById("chatNameContainer");
    const chatUserNameInput = document.getElementById("chatUserNameInput");
    const saveNameBtn = document.getElementById("saveNameBtn");
    const chatMessages = document.getElementById("chatMessages");
    const chatInputArea = document.getElementById("chatInputArea");
    const chatMessageInput = document.getElementById("chatMessageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const chatUnreadDot = document.getElementById("chatUnreadDot");

    let isUnlocked = sessionStorage.getItem("chat_unlocked") === "true";
    let currentUserName = localStorage.getItem("chat_user_name") || "";
    let isChatOpen = false;

    // UI Toggle Handler
    chatToggleBtn.addEventListener("click", () => {
        isChatOpen = !isChatOpen;
        chatWindow.style.display = isChatOpen ? "flex" : "none";
        if (isChatOpen) {
            chatUnreadDot.style.display = "none";
            checkChatState();
        }
    });

    chatCloseBtn.addEventListener("click", () => {
        isChatOpen = false;
        chatWindow.style.display = "none";
    });

    // Handle Unlock
    function handleUnlock() {
        const inputPass = chatPasswordInput.value.trim();
        if (inputPass === SECRET_PASSWORD) {
            isUnlocked = true;
            sessionStorage.setItem("chat_unlocked", "true"); // ব্রাউজার সেশন চলাকালীন আনলক থাকবে
            lockErrorMsg.style.display = "none";
            chatPasswordInput.value = "";
            checkChatState();
        } else {
            lockErrorMsg.style.display = "block";
        }
    }

    unlockChatBtn.addEventListener("click", handleUnlock);
    chatPasswordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleUnlock();
    });

    // Check Chat State (Lock -> Name -> Chat)
    function checkChatState() {
        if (!isUnlocked) {
            chatLockContainer.style.display = "flex";
            chatNameContainer.style.display = "none";
            chatMessages.style.display = "none";
            chatInputArea.style.display = "none";
        } else if (!currentUserName) {
            chatLockContainer.style.display = "none";
            chatNameContainer.style.display = "flex";
            chatMessages.style.display = "none";
            chatInputArea.style.display = "none";
        } else {
            chatLockContainer.style.display = "none";
            chatNameContainer.style.display = "none";
            chatMessages.style.display = "flex";
            chatInputArea.style.display = "flex";
            loadMessages();
        }
    }

    // Save Name
    saveNameBtn.addEventListener("click", () => {
        const name = chatUserNameInput.value.trim();
        if (name) {
            currentUserName = name;
            localStorage.setItem("chat_user_name", currentUserName);
            checkChatState();
        }
    });

    // Fetch Messages
    async function loadMessages() {
        chatMessages.innerHTML = "";
        
        const { data, error } = await db
            .from("messages")
            .select("*")
            .order("created_at", { ascending: true })
            .limit(50);

        if (error) {
            console.error("Error loading chat messages:", error);
            return;
        }

        if (data) {
            data.forEach(renderMessage);
            scrollToBottom();
        }
    }

    // Render Message
    function renderMessage(msg) {
        const isSelf = msg.sender_name.toLowerCase() === currentUserName.toLowerCase();
        
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-msg ${isSelf ? "msg-self" : "msg-other"}`;

        const timeStr = new Date(msg.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        msgDiv.innerHTML = `
            ${!isSelf ? `<span class="chat-msg-sender">${escapeHtml(msg.sender_name)}</span>` : ''}
            <div>${escapeHtml(msg.message)}</div>
            <span class="chat-msg-time">${timeStr}</span>
        `;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    // Send Message
    async function sendMessage() {
        const text = chatMessageInput.value.trim();
        if (!text || !currentUserName) return;

        chatMessageInput.value = "";

        const { error } = await db
            .from("messages")
            .insert([
                { sender_name: currentUserName, message: text }
            ]);

        if (error) {
            console.error("Error sending message:", error);
        }
    }

    sendMessageBtn.addEventListener("click", sendMessage);
    chatMessageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // Realtime Listener
    try {
        db.channel("public:messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    const newMsg = payload.new;
                    if (isUnlocked) {
                        renderMessage(newMsg);
                    }

                    if (!isChatOpen) {
                        chatUnreadDot.style.display = "block";
                    }
                }
            )
            .subscribe();
    } catch (err) {
        console.error("Realtime subscription error:", err);
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
});