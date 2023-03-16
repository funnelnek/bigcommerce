BigCommerce Stencil Theme Development
=============================================
https://luckypicks.mybigcommerce.com/  
**Preview Code**: baoktchpln

This BigCommerce project is part of the hiring process for oBundle. The goal is to evaluate how you solve problems and to get you accustom to using BigCommerce Stencil framework.




### The Requirements
The project requires signing-up for a free BigCommerce trail store which will be valid for 15 days. In addition you will need NodeJS and install the Stencil CLI for local development. You may need to install/switch to node version 14.20.0 because the CLI doesn't support node version greater than 14.x. Finally your will also need to sign into your account and create a Stencil API access token with publish permissions. [Learn how to create a Store API access token](https://support.bigcommerce.com/s/article/Store-API-Accounts?language=en_US).

### Setting-up the project
The first problem you will no doubt face is installing the Stencil CLI. Since I'm running node version 18.15.0 (includes npm 9.5.0) I will need to downgrade to node version 14.20.0 via nvm or install it directly. However, I decided to dockerize it by building an image since I wasn't able to locate an image on Docker Hub with the Stencil CLI requirements. 

To build the image from the Dockerfile run this command in your terminal inside the cornerstone root directory which you can [clone from GitHub](git@github.com:bigcommerce/cornerstone.git)  
`docker build -t bigcommerce:stencil-v6 .`  

Next you need to install npm packages via   
`npm i`.   

Once the node packages are installed you need to run the image and access the container's shell via running this command   
`docker run -it --name cornerstone -p 3000:3000 -v $PWD:/theme bigcommerce:stencil-v6 /bin/bash`   

From the container's terminal check your current working directory via `ls -al` which is should list the theme's files system. Initialize the theme via running `stencil init`. This command will ask for your access token and domain name. To start theme development run `stencil start`


### Tasks To Complete
The tasks you will need to complete to move to the next hiring phase are as follow.
 - Create a product called Special Item which will be assigned to a new category called Special Items. Be sure to add at least 2 images during the product creation.
 - The Special Item should be the only item in the Special Items category.
 - Create a feature that will show the second product's image when someone hover on it.
 - Add a button at the top of the category page labeled Add All To Cart and when clicked add the product to the cart.
 - Add a button next to the Add All To Cart labeled Remove All Items and it should only display when there are items in the cart. When clicked clear the cart's items.
 - Both buttons should alert the user after items are added or removed from the cart. In addition both buttons need to utilize the StoreFront API for completion.

 #### Bonus
- If a customer is logged in - at the top of the category page show a banner that shows some customer details (i.e name, email, phone, etc...) and should utilize the data rendered via Handlebars on the [Customer Object](https://developer.bigcommerce.com/theme-objects/schemas#customer).   
   
   
## The Process
The tasks are pretty straightfoward and seems easy to do. Especially if you used BigCommerce before, but that wasn't me and I needed to start from the ground up and learn as much about this framework before turning in this project within 3 to 4 days.   

#### Handlebars Template Engine
BigCommerce use [Handlebars.js](https://handlebarsjs.com/) as their templating engine. These files are located in the [templates folder](https://developer.bigcommerce.com/stencil-docs/storefront-customization/directory-structure) in your project's root directory. The templates folders has three sub-directories which are.
- components
- layout
- pages

Since I will need to make changes to the category page, so the category.html template file is where I will start.  

#### Category Template
Here I injected the category's products into the [jsContext](https://developer.bigcommerce.com/stencil-docs/reference-docs/handlebars-helpers-reference#jscontext) via `{{inject "products" category.products}}`. I also added a theme setting for product's card images and injected it as well via `{{inject "cardProductImageCount" theme_settings.card_product_image_count}}`

### The Display of Hover Feature

#### Card Template
To implement the display on hover feature we need to modify the card.html template located in `templates/components/products/card.html`. In this file I simply loop through the product's images based on the `theme_settings.card_product_image_count` setting via `{{#each (limit images theme_settings.card_product_image_count)}}` block placed between the `<div class='card-img-container'>` element.

#### Category Class 
All template's corresponding javascript files are located in the `assets/js/theme` directory from your project's root directory. Category pages entry point is a `category.js` file located in `assets/js/theme/category.js`. Each page javascript file extends a base class called PageManager which has two key methods which are
- **onReady** = A page initializer method which is just a JQuery `$(document).ready(() => {
            page.onReady.bind(page)();
        })`
- **load** = A class static method to create an instance of PageManager and call it's `page.onReady(context)` method passing in the current context.

This is where I import and initialized the ProductCardImageGallery class located in `assets/js/theme/global/display-on-hover.js`. This handles the on hover feature. Note this file could be placed anywhere you desire as long as you import it into your page's entry javascript file *(in my case category.js)*.

### Add/Remove All Cart Items Feature
#### Navigation Template
To implement this feature will need to modify the header.html template file located `templates/components/common/navigation.html`. Here is where you would add the two buttons needed to add all items and remove all items from/to the cart. The buttons should only appear on category pages, so we must check the page type via `{{#if page_type '===' "category"}}` and if so only then display the buttons.

#### Alert Modal Template
You will need to modify the modal template file located in `templates/components/common/alert/alert-modal.html`. Note you could create a custom alert modal, but I choose to keep it simple and slightly modified the template file and it's corresponding javascript file `assets/js/theme/global/modal.js`

#### CategoryToCart Class
This class is also initialized in the Category class `onReady()` method which fetches the cart if available and injects the category's products via `{{inject "products" category.products}}` in the category template file. The file is located at `assets/js/theme/common/category-to-cart.js`.  

An instance of this class is responsible for adding and removing all items to cart. Note the only items it will not add to the cart are products that has a options which requires an additional variant id post to the StoreFront API. 

### Customer Info Banner Feature
This feature requires enabling banner from within [your control panel](https://support.bigcommerce.com/s/article/Creating-Editing-Banners?language=en_US) and selecting which page it should appear on.

#### Header Template
This template is where the banner is displayed and located at `templates/components/common/header.html`. There's a conditional that checks if banner.top is enabled and if so display the banner. I simply modified this to also check if th customer is login as well before displaying the banner with the customer information. 