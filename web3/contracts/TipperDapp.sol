//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

contract TipperDapp is OwnerIsCreator {
    IRouterClient private router;
    IERC20 private linkToken;
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error DestinationChainNotWhitelisted(uint64 destinationChainSelector);
    error NothingToWithdraw();

    event TokensTransferred(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );

    constructor(address _router, address _linkToken) {
        linkToken = IERC20(_linkToken);
        router = IRouterClient(_router);
    }

    address[] public users;

    struct Artist {
        string name;
        address user_address;
    }

    mapping(address => Artist) public artists;
    event ArtistRegistered(string NAME, address ARTIST);

    function transferTokens(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) internal onlyOwner returns (bytes32 messageId) {
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        // Build the CCIP Message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 0, strict: false})
            ),
            feeToken: address(linkToken)
        });

        // CCIP Fees Management
        uint256 fees = router.getFee(_destinationChainSelector, message);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        linkToken.approve(address(router), fees);

        // Approve Router to spend CCIP-BnM tokens we send
        IERC20(_token).approve(address(router), _amount);

        // Send CCIP Message
        messageId = router.ccipSend(_destinationChainSelector, message);

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(linkToken),
            fees
        );
    }

    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }

    receive() external payable {}

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
