pragma solidity ^0.5.0;

contract Marketplace {
string public name;
uint public productCount=0;
mapping(uint=>Product) public products;

struct Product{
uint id;
string name;
uint price;
address payable owner;
bool purchased;

}
event ProductCreated(
uint id,
string name,
uint price,
address payable owner,
bool purchased
);
event ProductPurchased(
uint id,
string name,
uint price,
address payable owner,
bool purchased
);


constructor() public{
name="Rohini";

}
function createProduct(string memory _name,uint _price)public{

require(bytes(_name).length>0);
require(_price>0);

     //make sure parameters are correct
        //increment product count
             productCount++;
     //create the products
  products[productCount]=Product(productCount,_name,_price,msg.sender,false);

     //trigger an event

     emit ProductCreated(productCount,_name,_price,msg.sender,false);

}
function purchaseProduct(uint _id)public payable{
//fetch the products
Product memory _product=products[_id];

//fetch the owner
address payable _seller=_product.owner;

//make sure the product has a valid id
require(_product.id > 0 && _product.id<=productCount);

//require that there us enough ether in the transaction

require(msg.value>=_product.price);
//require that the product has not been purchased already
require(!_product.purchased);
//require that the buyer is not the _seller
require(_seller!=msg.sender);

//make sure the product is valid
//transfer ownership to the buyer

_product.owner=msg.sender;
//mark as purchase

_product.purchased=true;
//update the products
products[_id]=_product;

//pay the seller sending them Ether
address(_seller).transfer(msg.value);

//trigger an event
emit ProductPurchased(productCount,_product.name,_product.price,msg.sender,true);



}
}
