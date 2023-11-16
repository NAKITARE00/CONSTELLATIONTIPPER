//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";

contract TipperDapp {
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
