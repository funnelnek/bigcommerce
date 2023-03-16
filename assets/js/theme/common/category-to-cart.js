import { api } from '@bigcommerce/stencil-utils'
import { alertModal, defaultModal, ModalEvents, showAlertModal } from "../global/modal";

export default class CategoryToCart { 

    constructor(ctx) {
        this.$products = ctx.products;
        this.$clear = $(".navUser-item--remove-all");
        this.$all = $(".navUser-item--add-all");
        this.$baseUrl = "https://luckypicks.mybigcommerce.com/api/storefront/carts";
    }

    init() {
        this.$all.on("click", this.allToCart.bind(this));
        this.$clear.on("click", this.clear.bind(this));
        
        api.cart.getCart({}, (err, cart) => {
            if (err) { return }

            this.$cart = cart;
            
            if (cart) {
                let quantity = this.getCartQuantity();
    
                if(quantity) {
                    this.$clear.show();
                }
            }            
        });
    }

    allToCart() { 
        let $all = this.$all;      
        $all.prop("disabled", true);

        
        let products = products.filter(product => product.has_options === false);;
        let cart = this.$cart;
        
        this.$affectedItems = products.length;

        let body = JSON.stringify({
            lineItems: products.map(product => ({
                productId: product.id,
                quantity: 1
            }))
        });

        if (cart) {
            return this.addItems(cart.id, body);
        }

        this.createCart(body);
    }

    addItems(cartId, products) {
        let method = "POST";        
        let url = this.$baseUrl + `/${cartId}/items`;
        let xhr = new XMLHttpRequest();
        
        this.$affectedItems = products.length;
        xhr.responseType = "json";            
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let status = xhr.status;                    
                let data = xhr.response;

                // Error has occurred
                if (status >= 400) {
                    return;
                }

                if (status === 200) {
                    this.$cart = data;
                    this.confirm();
                    return;
                }               
            }
        });
        xhr.open(method, url);
        xhr.send(products);
    }

    createCart(products) {
        let method = "POST";        
        let url = this.$baseUrl;        
        let xhr = new XMLHttpRequest();

        xhr.responseType = "json";
        xhr.open(method, url);
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === XMLHttpRequest.DONE && (xhr.status >= 200 && xhr.status < 400)) {
                let res = xhr.response;

                this.$cart = res;
                this.confirm();
            }
        });
        xhr.send(products);
    }

    confirm() {
        let message = "";
        let quantity = this.$affectedItems;
        let items = this.getCartQuantity();

        if (items) {
            message += `${quantity} items was added to your cart.`;
        } else {
            message += `${quantity} items was removed from your cart.`;
        }

        $(".modal-background").on("click", this.onConfirm);
        showAlertModal(message, { icon: "success", onConfirm: this.onConfirm });
    }

    onConfirm() {
        window.location.reload();
    }

    getCartQuantity() {
        return this.getItems().length;        
    }

    getItems() {
        let cart = this.$cart;

        return !cart ? [] : [].concat(
            cart.lineItems.physicalItems,
            cart.lineItems.digitalItems,
            cart.lineItems.customItems,
            cart.lineItems.giftCertificates,
        );
    }

    clear() { 
        let cart = this.$cart;
        let method = "DELETE";    
        let baseUrl = this.$baseUrl;
        
        if (cart) {
            let items = this.getItems();
            this.$affectedItems = items.length;            

            let url = baseUrl + `/${cart.id}`;
            let xhr = new XMLHttpRequest();

            xhr.responseType = "json";
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4) {
                    this.$cart = xhr.response;
                    this.confirm();
                }
            });

            xhr.open(method, url);
            xhr.send();
        }
    }
}