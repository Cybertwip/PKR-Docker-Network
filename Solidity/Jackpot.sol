pragma solidity >=0.4.22 <0.7.0;

import "./Authorizable.sol";

interface ERC20Interface {
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
}

/** 
 * @title Jackpot
 * @dev Implements a jackpot that can be winned by a single user
 */
contract Jackpot is Authorizable {
   ERC20Interface tokenContract;

    struct Bet{
        mapping(address => Player) players;
        
    }
    
    
    struct Player {
        address playerAddress;
        uint wonRounds; // the rounds the player has won
        uint lostRounds; // the rounds the player has lost
        uint ranking; // ranking is determined by games won
        bool isPublic; // determines if the player's information is public or not
        uint8 storageFlag;
    }

    mapping(address => Player) private players;


    constructor() public {
    }

    function setERC20ContractAddress(address _address) external onlyAuthorized {
      tokenContract = ERC20Interface(_address);
    }
    
    function getERC20ContractAddress() public view returns(address){
        return address(tokenContract);
    }


    function registerPlayer(address playerAddress, bool isPublic) public onlyAuthorized {

        players[playerAddress] = (Player({
            playerAddress: playerAddress,
            wonRounds: 0,
            lostRounds: 0,
            ranking: 0,
            isPublic: isPublic,
            storageFlag : 1
        }));

    }

    function jackpotIn(address[] memory _players, uint[] memory _bets) public onlyAuthorized{

        
        for(uint i = 0; i<_players.length; ++i){
            require(players[_players[i]].storageFlag != 0);
        }
    }
    
    function jackpotOut(address winner) public onlyAuthorized returns (uint){
        
    }



}
