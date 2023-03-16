export default class ProductCardImageGallery {   

    constructor(ctx) {
        this._ctx = ctx;
        this._limit = ctx.cardProductImageCount;
        this._cards = document.querySelectorAll(".card-figure.doh");
    }

    init() {
        this._cards.forEach((card) => {
            let defaultImage = card.querySelector(".card-img-container .card-image");

            defaultImage.classList.add("active");
            card.addEventListener("mouseenter", this.onEnter);
        });
    }

    onEnter(e) {
        let card = e.target;
        let container = card.querySelector(".card-img-container");

        let defaultImage = container.children[0];
        let previewImage = container.children[1];
        
        card.addEventListener("mouseleave", cleanup);
        card.classList.add("entered");
        defaultImage.classList.remove("active");
        previewImage.classList.add("active");

        function cleanup() {
            card.removeEventListener("mouseleave", cleanup);            
            card.classList.remove("entered");
            previewImage.classList.remove("active");
            defaultImage.classList.add("active");
        }
    }
}