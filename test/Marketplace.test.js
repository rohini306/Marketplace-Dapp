const Marketplace=artifacts.require('./Marketplace.sol')
require('chai')
.use(require('chai-as-promised'))
.should()
contract('Marketplace',([deployer, seller, buyer])=>{

  let marketplace
  before(async ()=>{
    marketplace=await Marketplace.deployed()
  })
describe('deployment',async()=>{
  it('deploys successfully',async()=>{
    const address=await marketplace.address
    assert.notEqual(address,0x0)
    assert.notEqual(address,'')
    assert.notEqual(address,null)
    assert.notEqual(address,undefined)


  })


it('has a name',async()=>{
  const name=await marketplace.name()
  assert.equal(name,'Rohini')
})

})

describe('products',async()=>{
  let result, productCount
  before(async ()=>{
    result=await marketplace.createProduct('Iphone X',web3.utils.toWei('1','Ether'),{from:seller})
    productCount=await marketplace.productCount()
  })

it('creates Products',async()=>{
//success
  assert.equal(productCount,1)
  const event =result.logs[0].args
  assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
  assert.equal(event.name,'Iphone X','name is correct')
  assert.equal(event.price,'1000000000000000000','price is correct')
  assert.equal(event.owner,seller,'is correct')
  assert.equal(event.purchased,false,'purchased is correct')
//failure:product must have a _name
await await marketplace.createProduct('',web3.utils.toWei('1','Ether'),{from:seller}).should.be.rejected;
await await marketplace.createProduct('Iphone X',0,{from:seller}).should.be.rejected;
})

it('lists products',async()=>{
  const product=await marketplace.products(productCount)
  assert.equal(product.id.toNumber(),productCount.toNumber(),'id is correct')
  assert.equal(product.name,'Iphone X','name is correct')
  assert.equal(product.price,'1000000000000000000','price is correct')
  assert.equal(product.owner,seller,'is correct')
  assert.equal(product.purchased,false,'purchased is correct')

})


it('sells products',async()=>{

//track the seller balance before purchased
let oldSellerBalance
oldSellerBalance=await web3.eth.getBalance(seller)
oldSellerBalance=new web3.utils.BN(oldSellerBalance)


//success : buyer makes a purchase
  result=await marketplace.purchaseProduct(productCount,{from:buyer, value:web3.utils.toWei('1','Ether')})
//check logs
const event =result.logs[0].args
assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
assert.equal(event.name,'Iphone X','name is correct')
assert.equal(event.price,'1000000000000000000','price is correct')
assert.equal(event.owner,buyer,'is correct')
assert.equal(event.purchased,true,'purchased is correct')
//check that the seller receiver funds

 let newSellerBalance
 newSellerBalance=await web3.eth.getBalance(seller)
 newSellerBalance=new web3.utils.BN(newSellerBalance)

 let price=web3.utils.toWei('1','Ether')
 price=new web3.utils.BN(price)
 const expectedBalance=oldSellerBalance.add(price)
 assert.equal(newSellerBalance.toString(),expectedBalance.toString())

//failure
//invalid id ,,product that does not exist

await marketplace.purchaseProduct(99,{from:buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
//buyer tries to buy without enough Ether

await marketplace.purchaseProduct(productCount,{from:buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected

//failure: deployer tries to buy the product , product cant be purchased twice
await marketplace.purchaseProduct(productCount,{from:deployer, value:web3.utils.toWei('1','Ether')}).should.be.rejected

// buyer tries to buy again ir buyer cant be the _seller
await marketplace.purchaseProduct(productCount,{from:deployer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
})

})







})
