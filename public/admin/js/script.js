// Button Status 

const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");

            }
            window.location.href = url.href;
        })
    })
}

// End Button Status

//Form Search

const formSearch = document.querySelector("#form-search");
if (formSearch) {

    let url = new URL(window.location.href);
     
    formSearch.addEventListener("submit", (e) => {

        e.preventDefault();
        const keyword = e.target.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
        
    });

}

//End Form Search

// Pagination

const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    });
}

// End Pagination

// Delete Item

const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {

    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");


    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Do you want delete this items");

            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = action;
                
                formDeleteItem.submit();
            }
        });
    });

}

// End Delete Item

