const { Contract } = require("ethers");
const fs = require("fs");
const path = require("path");
const { Location } = require("@chainlink/functions-toolkit");
const { abi, bytecode } = require("../artifacts-zk/contracts/TipperDapp.sol/TipperDapp.json");
require("@chainlink/env-enc").config();