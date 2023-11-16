//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract TipperDapp is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public donId; // DON ID for the Functions DON to which the requests are sent

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    string private source;
    FunctionsRequest.Location private secretsLocation;
    bytes private encryptedSecretsReference;
    bytes[] private bytesArgs;
    uint64 private subscriptionId;
    uint32 private callbackGasLimit;

    constructor(
        string memory _source,
        FunctionsRequest.Location _secretsLocation,
        bytes memory _encryptedSecrestsReference,
        bytes[] memory _bytesArgs,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,
        address router,
        bytes32 _donId
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        donId = _donId;
        source = _source;
        secretsLocation = _secretsLocation;
        encryptedSecretsReference = _encryptedSecrestsReference;
        bytesArgs = _bytesArgs;
        subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
    }

    /**
     * @notice Set the DON ID
     * @param newDonId New DON ID
     */
    function setDonId(bytes32 newDonId) external onlyOwner {
        donId = newDonId;
    }

    function sendRequest(string[] calldata args) external onlyOwner {
        FunctionsRequest.Request memory req; // Struct API reference: https://docs.chain.link/chainlink-functions/api-reference/functions-request
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );
        req.secretsLocation = secretsLocation;
        req.encryptedSecretsReference = encryptedSecretsReference;
        if (args.length > 0) {
            req.setArgs(args);
        }
        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            callbackGasLimit,
            donId
        );
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        s_lastResponse = response;
        s_lastError = err;
    }

    address[] public users;

    struct Artist {
        string name;
        address user_address;
    }

    mapping(address => Artist) public artists;
    event ArtistRegistered(string NAME, address ARTIST);

    function registerArtist(string memory _name) public {
        Artist memory artist;
        artist = Artist(_name, msg.sender);
        artists[msg.sender] = artist;
        emit ArtistRegistered(_name, msg.sender);
    }

    //Function used by Election.sol to get and verify if an address exists and set Elector role
    function getArtist(address _userAddress) public view returns (address) {
        Artist memory user = artists[_userAddress];
        return (user.user_address);
    }

    struct Tipper {
        string name;
        address user_address;
    }

    mapping(address => Tipper) public tippers;
    event TipperRegistered(string NAME, address TIPPER);

    //register user function
    function registerTipper(string memory _name) public {
        Tipper memory tipper;
        tipper = Tipper(_name, msg.sender);
        tippers[msg.sender] = tipper;
        emit TipperRegistered(_name, msg.sender);
    }

    //function that makes a tip
    function make_Tip(address _artistAddress) public payable {
        (bool callSuccess, ) = payable(_artistAddress).call{value: msg.value}(
            ""
        );
        require(callSuccess, "Call failed");
    }

    //Function used by Election.sol to get and verify if an address exists and set Elector role
    function getUser(address _userAddress) public view returns (address) {
        Tipper memory user = tippers[_userAddress];
        return (user.user_address);
    }

    //Only Users Can Access Some Functions

    struct Candidate {
        string name;
        address user_address;
        uint256 votes;
    }
    mapping(address => Candidate) public candidates;
    address[] candidateAddress;

    struct Election {
        address owner;
        uint256 Id;
        string electionName;
        uint256 voteToken;
        address[] candidateAddress;
        string image;
    }
    struct Voted {
        bool voted;
    }
    struct ElectionResult {
        uint256 electionId;
        string electionName;
        address[] candidateAddress;
        string[] candidateName;
        uint256[] votes;
        string image;
    }

    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(address => Voted)) public electionvoters;
    mapping(uint256 => ElectionResult) public electionresults;
    uint256 public numberOfElections = 0;

    event ElectionCreated(string Name, uint256 Token, address[] Candidates);

    //function that creates an election and specifies participants
    function createElection(
        address _owner,
        string memory _electionName,
        uint256 _voteToken,
        string memory _image,
        address[] memory _candidateAddress
    ) public returns (uint256) {
        Election storage election = elections[numberOfElections];
        election.Id = numberOfElections++;
        election.electionName = _electionName;
        election.voteToken = _voteToken;
        election.image = _image;
        election.owner = _owner;

        candidateAddress = _candidateAddress;

        for (uint i = 0; i < candidateAddress.length; i++) {
            address user_address = candidateAddress[i];
            Candidate storage candidate = candidates[user_address];
            candidate.name = artists[user_address].name;
            candidate.user_address = artists[user_address].user_address;
        }
        elections[election.Id].candidateAddress = candidateAddress;
        emit ElectionCreated(
            elections[election.Id].electionName,
            elections[election.Id].voteToken,
            elections[election.Id].candidateAddress
        );
        return (election.Id);
    }

    function makeVote(
        uint256 _electionId,
        address _candidateAddress
    ) public payable {
        require(
            !electionvoters[_electionId][msg.sender].voted,
            "Already Voted"
        );
        // require(
        //     elections[_electionId].voteToken == msg.value,
        //     "Not Enough Tokens To Vote"
        // );
        (bool callSuccess, ) = payable(_candidateAddress).call{
            value: msg.value
        }("");
        require(callSuccess, "Call failed");
        electionvoters[_electionId][msg.sender].voted = (
            electionvoters[_electionId][msg.sender].voted
        );

        Candidate storage candidate = candidates[_candidateAddress];
        candidate.votes++;

        ElectionResult storage electionresult = electionresults[_electionId];
        electionresult.electionId = _electionId;
        electionresult.electionName = elections[_electionId].electionName;
        electionresult.candidateAddress.push(_candidateAddress);
        electionresult.candidateName.push(candidate.name);
        electionresult.votes.push(candidate.votes);
        electionresults[_electionId] = electionresult;
    }

    function viewResults(
        uint256 _electionId
    ) public view returns (address[] memory, uint256[] memory) {
        ElectionResult storage electionresult = electionresults[_electionId];
        return (electionresult.candidateAddress, electionresult.votes);
    }

    function getElections() public view returns (Election[] memory) {
        Election[] memory allElections = new Election[](numberOfElections);
        for (uint i = 0; i < numberOfElections; i++) {
            Election storage item = elections[i];

            allElections[i] = item;
        }

        return (allElections);
    }
}
