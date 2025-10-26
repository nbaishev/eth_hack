// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/utils/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/access/Ownable.sol";

/// @title Glacier NFT Marketplace
/// @notice Пользователь минтит NFT, а владелец получает оплату
contract GlacierNFTMarketplace is ERC721URIStorage, ReentrancyGuard, Ownable {
    uint256 private _tokenIds;
    uint256 public mintPrice = 0.01 ether; // цена за один NFT

    event Minted(address indexed buyer, uint256 indexed tokenId, string tokenURI, uint256 price);
    event MintPriceUpdated(uint256 newPrice);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
        Ownable(msg.sender)
    {}

    /// Установить цену за минт (только владелец)
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
        emit MintPriceUpdated(_newPrice);
    }

    /// Минтит NFT: пользователь платит, NFT получает
    function mint(string calldata tokenURI_) external payable nonReentrant returns (uint256) {
        require(msg.value >= mintPrice, "Not enough ETH to mint");
        require(bytes(tokenURI_).length > 0, "Token URI required");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI_);

        // ✅ Отправляем оплату владельцу контракта
        (bool sent, ) = payable(owner()).call{value: mintPrice}("");
        require(sent, "Payment to owner failed");

        // ✅ Если пользователь переплатил — вернуть сдачу
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }

        emit Minted(msg.sender, newTokenId, tokenURI_, mintPrice);
        return newTokenId;
    }

    /// Владелец может снять средства, если есть остаток
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Withdraw failed");
        emit FundsWithdrawn(owner(), amount);
    }

    /// Получение текущего ID токена
    function currentTokenId() external view returns (uint256) {
        return _tokenIds;
    }

    receive() external payable {}
    fallback() external payable {}
}
