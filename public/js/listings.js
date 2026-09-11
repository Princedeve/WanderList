const viewMoreBtn = document.getElementById("view-more");
const listingContainer = document.getElementById("listing-container");

const filters = document.getElementById("filters");
const filterRight = document.getElementById("filter-right");


// ===============================
// View More Listings
// ===============================

if (viewMoreBtn) {

    viewMoreBtn.addEventListener("click", async () => {

        let page = Number(viewMoreBtn.dataset.page) + 1;
        let category = viewMoreBtn.dataset.category;

        let url = `/listings?page=${page}&loadMore=true`;

        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }

        viewMoreBtn.innerText = "Loading...";
        viewMoreBtn.disabled = true;

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to load listings");
            }

            const html = await response.text();

            listingContainer.insertAdjacentHTML("beforeend", html);

            viewMoreBtn.dataset.page = page;

            viewMoreBtn.innerText = "View More";
            viewMoreBtn.disabled = false;

        } catch (error) {

            console.log(error);

            viewMoreBtn.innerText = "View More";
            viewMoreBtn.disabled = false;

        }

    });

}


// ===============================
// Filter Right Arrow
// ===============================

if (filterRight) {

    filterRight.addEventListener("click", () => {

        filters.scrollBy({
            left: 250,
            behavior: "smooth"
        });

    });

}

function checkFilterOverflow() {

    if (filters.scrollWidth > filters.clientWidth) {
        filterRight.style.display = "block";
    } else {
        filterRight.style.display = "none";
    }

}

checkFilterOverflow();

window.addEventListener("resize", checkFilterOverflow);