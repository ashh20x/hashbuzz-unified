const ConvertLib = artifacts.require("ConvertLib");
const HashbuzzV201 = artifacts.require("HashbuzzV201");

module.exports = function (deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);

  deployer.deploy(HashbuzzV201);
};
