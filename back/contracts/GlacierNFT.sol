// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/access/Ownable.sol";

/**
 * @title GlacierNFT
 * @notice NFT токенизация искусственных ледников с функцией инвестирования
 */
contract GlacierNFT is ERC721URIStorage, Ownable {
    uint256 public nextId;
    uint256 public totalInvested;

    event GlacierMinted(uint256 indexed tokenId, address indexed owner, string uri);
    event Invested(address indexed investor, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor() ERC721("Artificial Glacier", "GLCR") Ownable(msg.sender) {}

    /// Минт NFT ледника (только владелец контракта)
    function mintGlacier(address to, string calldata tokenURI) external onlyOwner returns (uint256) {
        nextId++;
        uint256 tokenId = nextId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit GlacierMinted(tokenId, to, tokenURI);
        return tokenId;
    }

    /// Инвестирование в проект ледников
    function invest() external payable {
        require(msg.value > 0, "Investment must be > 0");
        totalInvested += msg.value;
        emit Invested(msg.sender, msg.value);
    }

    /// Вывод собранных средств (только владелец)
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw");
        payable(owner()).transfer(amount);
        emit Withdrawn(owner(), amount);
    }

    /// Просмотр баланса контракта
    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
