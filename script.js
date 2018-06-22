function X(json) {
    var HTTP = "http:";
    var recommendedProducts = [];
    var recommendedProductsId = [];
    var slideCount;
    var numVisibleProducts;
    var numActiveProducts;
    var activeProducts;
    var halfVisibleProduct;
    var numOfRecommendations;

    var reference = json.data.reference;
    var recommendation = json.data.recommendation;


    function createRecommendations(recommendation) {
        numOfRecommendations = recommendation.length;
        recommendation.forEach(product => {
            var recommendedProductDOM = createProduct(product);
            recommendedProducts.push(recommendedProductDOM);
            recommendedProductsId.push(product.businessId);
            document.getElementById("recommendedProducts").appendChild(recommendedProductDOM);

        });

        main();
    }

    function createProduct(product) {

        var hasOldPrice = false;

        // create div box
        var box = document.createElement("div");
        box.className = "box hidden";
        /*order is used to show the recommendations in the carousel. All boxes are set to 
        the number of recommendations (guaranteed to be greater than the number of visible products) and
        the visible products will have a smaller order number*/

        box.style.order = numOfRecommendations;

        //create div product
        var productAnchor = document.createElement("a");
        productAnchor.className = "product";
        productAnchor.id = product.businessId;
        productAnchor.href = HTTP + product.detailUrl;

        var imageBox = document.createElement("div");
        imageBox.className = "imageBox";

        //create img tag
        var productImage = document.createElement("img");
        productImage.className = "productImage";
        productImage.src = HTTP + product.imageName;
        productImage.setAttribute("data-src", HTTP + product.imageName);

        //set image tag as child of imageBox div
        imageBox.appendChild(productImage);

        var productName = document.createElement("div");
        productName.className = "productName";
        productName.innerText = product.name;

        if (product.oldPrice) {
            var oldPrice = document.createElement("div");
            oldPrice.className = "oldPrice";
            oldPrice.innerText = "De: " + product.oldPrice;

            hasOldPrice = true;
        }

        var price = document.createElement("div");
        price.className = "price";
        var strong = document.createElement("strong");
        strong.innerText = product.price;
        price.innerHTML = "Por: ";
        price.appendChild(strong);

        var paymentCondition = document.createElement("div");
        paymentCondition.className = "paymentCondition";
        paymentCondition.innerHTML = product.productInfo.paymentConditions;
        paymentCondition.appendChild(document.createElement("br"));
        paymentCondition.innerHTML += "sem juros";

        productAnchor.appendChild(imageBox);
        productAnchor.appendChild(productName);
        if (hasOldPrice) {
            productAnchor.appendChild(oldPrice);
        }
        productAnchor.appendChild(price);
        productAnchor.appendChild(paymentCondition);

        box.appendChild(productAnchor);

        return box;
    }

    function createReference(reference) {
        var DOMElement = createProduct(reference.item);
        document.getElementById("visitedProduct").appendChild(DOMElement);
        
        //data-src is used for lazy loading the images. Every image receives a 'data-src' attribute which contains the
        //url for the image. When needed, we can get the 'data-src' value and assign it to 'src', this waz loading the image.
        //Since image loading is a synchronous process, it needs to finish before making another request. In this example, we
        //only have 11 images, but in a real application it would be interesting to apply lazy loading in order to reduce loading time
        
        /*var image_src = DOMElement.getAttribute('data-src');
        console.log(DOMElement);
        DOMElement.setAttribute('src', image_src);*/

    }

    function main() {
        slideCount = 0;
        var width = document.getElementById("recommendedProducts").offsetWidth;
        var boxSize = document.getElementById("recommendedProducts").children[0].offsetWidth;

        var numOfProducts = width / boxSize;
        // numActiveProducts contains the number of products that are fully visible in the carousel
        numActiveProducts = Math.floor(numOfProducts);

        maxSlideCount = Math.ceil(numOfRecommendations / numActiveProducts);

        
        initialize();

        //TODO lazy loads images
        //Next step would be to implement the lazy loading. Images that should appear, would have the data-src value assigned to src.

        //create event listeners
        document.getElementById("right-arrow").addEventListener("click", slideRight);
        document.getElementById("left-arrow").addEventListener("click", slideLeft);

    }

    function slideRight() {
        slideCount++;
        console.log(slideCount);
        if (slideCount >= (maxSlideCount)) {
            slideCount = 0;
            clearCarousel();

        } else {
            var halfVisible = true;

            hideActiveProducts(true);

            var index = slideCount * numActiveProducts;
            var end = index + numActiveProducts;
            activeProducts = [];
            halfVisibleProduct = null;

            if (slideCount == (maxSlideCount - 1)) {
                var diff = (numActiveProducts * maxSlideCount - numOfRecommendations);
                if (diff == 0) {
                    halfVisible = false;
                } else {
                    end = index + numActiveProducts - diff;
                }
            }

            for (var i = index; i < end; i++) {
                activeProducts.push(recommendedProductsId[i]);
            }

            if (halfVisible) {
                halfVisibleProduct = recommendedProductsId[end];
            }


            //TODO lazy load images
            showActiveProducts(true);
        }
    }

    function slideLeft() {
        
        slideCount--;
        console.log(slideCount);
        if (slideCount < 0) {
            slideCount = 0;
        } 
        else {

            var halfVisible = true;
            console.log("entrour");
            hideActiveProducts(false);

            var index = slideCount * numActiveProducts;
            var end = index + numActiveProducts;
            activeProducts = [];
            halfVisibleProduct = null;

            for (var i = index; i < end; i++) {
                activeProducts.push(recommendedProductsId[i]);
            }

            if (halfVisible) {
                halfVisibleProduct = recommendedProductsId[end];
            }


            //TODO lazy load images
            showActiveProducts(false);
        }

        
    }

    function showActiveProducts(right) {
        if(right) {
            for (var i = 0; i < activeProducts.length; i++) {
                addVisibleClass(activeProducts[i]);
                addOrder(activeProducts[i], i + 1);

            }

            if (halfVisibleProduct != null) {
                addVisibleClass(halfVisibleProduct);
                addOrder(halfVisibleProduct, i + 1);
            }
        }

        else {
            for (var i = 0; i < activeProducts.length; i++) {
                addVisibleClass(activeProducts[i]);
                addOrder(activeProducts[i], i + 1);

            }

            if (halfVisibleProduct != null) {
                addVisibleClass(halfVisibleProduct);
                addOrder(halfVisibleProduct, i + 1);
            }
        }
    }

    function hideActiveProducts(right) {
        if(right){
            for (var i = 0; i < activeProducts.length; i++) {
                addHiddenClass(activeProducts[i]);
                addOrder(activeProducts[i], numOfRecommendations);
            }

            if (halfVisibleProduct != null) {
                addOrder(halfVisibleProduct, 1);
            }
        }

        else {
            //i starts in 1 because the first product will be the halfvisibleProduct on leftClick
            for (var i = 1; i < activeProducts.length; i++) {
                addHiddenClass(activeProducts[i]);
                addOrder(activeProducts[i], numOfRecommendations);
            }

            if (halfVisibleProduct != null) {
                addHiddenClass(halfVisibleProduct);
                addOrder(halfVisibleProduct, numOfRecommendations);
            }

            halfVisibleProduct = activeProducts[0];
        }

    }

    function addVisibleClass(id) {
        //classList could also have been used, but it is not available in IE9
        document.getElementById(id).parentElement.className = "box visible";
    }

    function addHiddenClass(id) {
        document.getElementById(id).parentElement.className = "box hidden";
    }

    function addOrder(id, order) {
        document.getElementById(id).parentElement.style.order = order;
    }

    function initialize(){
        activeProducts = [];
        console.log(numActiveProducts);
        for (var i = 0; i < numActiveProducts; i++) {
            console.log(recommendedProductsId[i]);
            
            activeProducts.push(recommendedProductsId[i]);
            addVisibleClass(recommendedProductsId[i]);
        }

        //adds product that is not fully visible
        halfVisibleProduct = recommendedProductsId[numActiveProducts];
        addVisibleClass(halfVisibleProduct);
    }

    function clearCarousel() {
        for(var i=0; i<activeProducts.length; i++){
            addOrder(activeProducts[i], numOfRecommendations);
        }

        if(halfVisibleProduct != null){
            addOrder(activeProducts[i], numOfRecommendations);
        }

        initialize();
    }


    createReference(reference);
    createRecommendations(recommendation);

}