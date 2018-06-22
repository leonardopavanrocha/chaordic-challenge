var HTTP = "http:";
var recommendedProducts = [];
var recommendedProductsId = [];
var slideCount;
var numVisibleProducts;
var numActiveProducts;
var activeProducts;
var halfVisibleProduct;
var numOfRecommendations;



function X(json){
    var reference = json.data.reference;
    var recommendation = json.data.recommendation;

    createReference(reference);
    createRecommendations(recommendation);

}

function createRecommendations(recommendation){
    numOfRecommendations = recommendation.length;
    recommendation.forEach(product => {
        var recommendedProductDOM = createProduct(product);
        recommendedProducts.push(recommendedProductDOM);
        recommendedProductsId.push(product.businessId);
        document.getElementById("recommendedProducts").appendChild(recommendedProductDOM);

    });

    main();
}

function createProduct(product){
    
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

    if(product.oldPrice){
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
    if(hasOldPrice){
        productAnchor.appendChild(oldPrice);
    }
    productAnchor.appendChild(price);
    productAnchor.appendChild(paymentCondition);

    box.appendChild(productAnchor);

    return box;
}

function createReference(reference){
    var DOMElement = createProduct(reference.item);
    document.getElementById("visitedProduct").appendChild(DOMElement);

    /*var image_src = DOMElement.getAttribute('data-src');
    console.log(DOMElement);
    DOMElement.setAttribute('src', image_src);*/

}

function main(){
    slideCount = 0;
    var width = document.getElementById("recommendedProducts").offsetWidth;
    var boxSize = document.getElementById("recommendedProducts").children[0].offsetWidth;

    var numOfProducts = width/boxSize;
    // numActiveProducts contains the number of products that are fully visible in the carousel
    numActiveProducts = Math.floor(numOfProducts);

    maxSlideCount = Math.ceil(numOfRecommendations/numActiveProducts);

    console.log(numActiveProducts);
    activeProducts = [];

    for(var i=0; i<numActiveProducts;i++){
        activeProducts.push(recommendedProductsId[i]);
        addVisibleClass(recommendedProductsId[i]);
    }

    //adds product that is not fully visible
    halfVisibleProduct = recommendedProductsId[numActiveProducts];
    addVisibleClass(halfVisibleProduct); 

    //TODO lazy loads images
    

    //create event listeners
    document.getElementById("right-arrow").addEventListener("click", slideRight);
    document.getElementById("left-arrow").addEventListener("click", slideLeft);

}

function slideRight() {
    slideCount++;
    if(slideCount >= (maxSlideCount)){
        slideCount = maxSlideCount;
    }

    else {
        var halfVisible = true;

        hideActiveProducts();

        var index = slideCount*numActiveProducts;
        var end = index + numActiveProducts;
        activeProducts = [];
        halfVisibleProduct = null;

        if(slideCount == (maxSlideCount-1)){
            var diff = (numActiveProducts*maxSlideCount - numOfRecommendations);
            if(diff==0){
                halfVisible = false;
            }

            else{
                end = index + numActiveProducts - diff;
            }
        }

        for(var i=index; i<end; i++){
            activeProducts.push(recommendedProductsId[i]);
        }

        if(halfVisible){
            halfVisibleProduct = recommendedProductsId[end]; 
        }
        

        //TODO lazy load images
        showActiveProducts();
    }
}

function slideLeft() {
    if(slideCount!=0){

    }
}

function showActiveProducts(){
    for(var i = 0; i <activeProducts.length; i++){
        addVisibleClass(activeProducts[i]);
        console.log(activeProducts[i], i);
        addOrder(activeProducts[i], i+1);

    }

    if(halfVisibleProduct != null){
        addVisibleClass(halfVisibleProduct);
        addOrder(halfVisibleProduct, i+1);
    }
}

function hideActiveProducts(){
    for(var i = 0; i <activeProducts.length; i++){
        addHiddenClass(activeProducts[i]);
        addOrder(activeProducts[i], numOfRecommendations);
    }

    if(halfVisibleProduct != null){
        addOrder(halfVisibleProduct, 1);
    }

}

function addVisibleClass(id){
    //classList could also have been used, but it is not available in IE9
    document.getElementById(id).parentElement.className = "box visible";
}

function addHiddenClass(id){
        document.getElementById(id).parentElement.className = "box hidden";
}

function addOrder(id, order){
    document.getElementById(id).parentElement.style.order = order;
}