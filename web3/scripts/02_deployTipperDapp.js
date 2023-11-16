const { abi, bytecode } = require("../artifacts-zk/contracts/TipperDapp.sol/TipperDapp.json");
const { wallet, signer } = require("../connection.js");
const { networks } = require("../networks.js");
const { ContractFactory, utils } = require("ethers");
const fs = require("fs");
const { Location } = require("@chainlink/functions-toolkit")
require("@chainlink/env-enc").config();


const NETWORK = "polygonMumbai";

const routerAddress = networks[NETWORK].functionsRouter;
const donIdBytes32 = utils.formatBytes32String(networks[NETWORK].donId);
const source = fs
    .readFileSync(path.resolve(__dirname, "../source.js"))
    .toString();
const encryptedSecretsRef = "";
const subscriptionId = "";
const callbackGasLimit = 300_000;


const deployTipperDappContract = async () => {
    const contractFactory = new ContractFactory(abi, bytecode, wallet);

    console.log(
        `\nDeployment of TipperDapp contract on ${NETWORK}`
    );

    const tipperDappContract = await contractFactory
        .connect(signer)
        .deploy(source, Location.DONHosted, encryptedSecretsRef, [],
            subscriptionId, callbackGasLimit, routerAddress, donIdBytes32
        )

    await tipperDappContract.deployed();
    console.log(`\nDeployed at address ${tipperDappContract.address}`);
};

deployTipperDappContract().catch(err => {
    console.log("Error during deployment", err)
});