// ========================================
// Gallery
// ========================================

document.addEventListener("DOMContentLoaded", loadPhotos);


/* ========================================
   Load Photos
======================================== */

async function loadPhotos() {

    const loading =
        document.getElementById("loading");

    const errorBox =
        document.getElementById("error");

    const gallery =
        document.getElementById("gallery");

    const noPhotos =
        document.getElementById("noPhotos");


    try {

        /* --------------------------------
           Get Photos
        -------------------------------- */

        const { data, error } =
            await supabaseClient
                .from("photos")
                .select(`
                    id,
                    title,
                    slug,
                    description,
                    thumbnail_url,
                    preview_url,
                    drive_url,
                    alt_text,
                    is_featured,
                    sort_order,
                    created_at
                `)
                .eq("status", "active")
                .order(
                    "sort_order",
                    { ascending: true }
                )
                .order(
                    "created_at",
                    { ascending: false }
                );


        if (error) {
            throw error;
        }


        /* --------------------------------
           Hide Loading
        -------------------------------- */

        loading.style.display = "none";


        /* --------------------------------
           No Photos
        -------------------------------- */

        if (
            !data ||
            data.length === 0
        ) {

            noPhotos.style.display =
                "block";

            return;
        }


        /* --------------------------------
           Clear Gallery
        -------------------------------- */

        gallery.innerHTML = "";


        /* --------------------------------
           Create Cards
        -------------------------------- */

        data.forEach(photo => {

            const card =
                document.createElement("article");

            card.className =
                "photo-card";


            /* --------------------------------
               Image URL
            -------------------------------- */

            const imageUrl =
                photo.thumbnail_url ||
                photo.preview_url ||
                photo.drive_url ||
                "";


            /* --------------------------------
               Create Link
            -------------------------------- */

            const link =
                document.createElement("a");

            link.href =
                `photo.html?id=${encodeURIComponent(photo.id)}`;

            link.className =
                "photo-link";

            link.setAttribute(
                "aria-label",
                photo.title ||
                "View memory"
            );


            /* --------------------------------
               Image
            -------------------------------- */

            const image =
                document.createElement("img");

            image.className =
                "photo-card-image";

            image.src =
                imageUrl;

            image.alt =
                photo.alt_text ||
                photo.title ||
                "LATA & RAKIB memory";

            image.loading =
                "lazy";

            image.decoding =
                "async";


            /* --------------------------------
               Image Error
            -------------------------------- */

            image.onerror =
                function () {

                    console.warn(
                        "Image failed:",
                        imageUrl
                    );

                    /*
                       Try preview URL
                    */

                    if (
                        photo.preview_url &&
                        this.src !==
                        photo.preview_url
                    ) {

                        this.src =
                            photo.preview_url;

                        return;
                    }


                    /*
                       Try Drive URL
                    */

                    if (
                        photo.drive_url &&
                        this.src !==
                        photo.drive_url
                    ) {

                        this.src =
                            photo.drive_url;

                        return;
                    }


                    /*
                       Hide broken image
                    */

                    this.style.display =
                        "none";
                };


            /* --------------------------------
               Image Wrapper
            -------------------------------- */

            const imageWrapper =
                document.createElement("div");

            imageWrapper.className =
                "photo-image-wrapper";


            imageWrapper.appendChild(
                image
            );


            /* --------------------------------
               Overlay
            -------------------------------- */

            const overlay =
                document.createElement("div");

            overlay.className =
                "photo-card-overlay";


            const overlayTitle =
                document.createElement("div");

            overlayTitle.className =
                "photo-card-title";

            overlayTitle.textContent =
                photo.title ||
                "Untitled";


            overlay.appendChild(
                overlayTitle
            );


            imageWrapper.appendChild(
                overlay
            );


            /* --------------------------------
               Photo Info
            -------------------------------- */

            const info =
                document.createElement("div");

            info.className =
                "photo-info";


            const title =
                document.createElement("h3");

            title.className =
                "photo-title";

            title.textContent =
                photo.title ||
                "Untitled";


            info.appendChild(
                title
            );


            /* --------------------------------
               Description
            -------------------------------- */

            if (photo.description) {

                const description =
                    document.createElement("p");

                description.className =
                    "photo-description";

                description.textContent =
                    photo.description;


                info.appendChild(
                    description
                );
            }


            /* --------------------------------
               Featured Badge
            -------------------------------- */

            if (photo.is_featured) {

                const featured =
                    document.createElement("span");

                featured.className =
                    "featured-badge";

                featured.textContent =
                    "♥ Featured";


                card.appendChild(
                    featured
                );
            }


            /* --------------------------------
               Build Card
            -------------------------------- */

            link.appendChild(
                imageWrapper
            );

            link.appendChild(
                info
            );

            card.appendChild(
                link
            );


            gallery.appendChild(
                card
            );

        });


    } catch (error) {

        console.error(
            "Gallery Error:",
            error
        );


        /* --------------------------------
           Hide Loading
        -------------------------------- */

        if (loading) {

            loading.style.display =
                "none";
        }


        /* --------------------------------
           Show Error
        -------------------------------- */

        if (errorBox) {

            errorBox.style.display =
                "block";

            errorBox.textContent =
                "ছবি লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
        }

    }

}


/* ========================================
   HTML Escape
======================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}