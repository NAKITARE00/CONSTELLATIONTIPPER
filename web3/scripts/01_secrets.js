const { SecretsManager } = require("@chainlink/functions-toolkit");
const fs = require("fs");
const path = require("path");

const { signer } = require("../connection.js");
const { networks } = require("../networks.js");

require("@chainlink/env-enc").config();
// require('dotenv').config()

const NETWORK = "polygonMumbai";

const functionsRouterAddress = networks[NETWORK].functionsRouter;
const donId = networks[NETWORK].donId;

const encryptAndUpload = async () => {
    const secretsManager = new SecretsManager({
        signer,
        functionsRouterAddress,
        donId,
    });

    await secretsManager.initialize();


}