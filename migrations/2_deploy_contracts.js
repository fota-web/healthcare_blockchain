var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Payable = artifacts.require("./Payable.sol");


module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Payable);
};
