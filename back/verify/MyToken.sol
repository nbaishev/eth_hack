// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Подключаем OpenZeppelin библиотеки прямо из GitHub
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/utils/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/access/Ownable.sol";

/// @title Simple NFT Marketplace
/// @notice ERC721 NFT + базовый маркетплейс (mint → list → buy)
contract SimpleNFTMarketplace is ERC721URIStorage, ReentrancyGuard, Ownable {
    uint256 private _tokenIds;  // Простой uint256 вместо Counters

    // Цена чеканки (mint) в wei (0 = бесплатно)
    uint256 public mintPrice = 0;

    // Хранение цены продажи по токену
    mapping(uint256 => uint256) public salePrice;

    // События
    event Minted(address indexed minter, uint256 indexed tokenId, string tokenURI);
    event ListedForSale(address indexed owner, uint256 indexed tokenId, uint256 price);
    event SaleCancelled(address indexed owner, uint256 indexed tokenId);
    event Bought(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price);
    event MintPriceUpdated(uint256 newPrice);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

    /// Установить цену за чеканку (только владелец контракта)
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
        emit MintPriceUpdated(_newPrice);
    }

    /// Минтим NFT
    function mint(string calldata tokenURI_) external payable returns (uint256) {
        // ДОБАВИЛИ: Проверка, что tokenURI не пустой
        require(bytes(tokenURI_).length > 0, unicode"tokenURI не может быть пустым");

        _tokenIds++;  // Простой инкремент
        uint256 newId = _tokenIds;

        _safeMint(msg.sender, newId);
        _setTokenURI(newId, tokenURI_);

        // Возврат сдачи (если отправили больше)
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }

        emit Minted(msg.sender, newId, tokenURI_);
        return newId;
    }

    /// Выставить токен на продажу
    function listForSale(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, unicode"Только владелец может выставить токен");
        require(price > 0, unicode"Цена должна быть > 0");

        salePrice[tokenId] = price;
        emit ListedForSale(msg.sender, tokenId, price);
    }

    /// Снять токен с продажи
    function cancelSale(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, unicode"Только владелец может снять с продажи");
        require(salePrice[tokenId] != 0, unicode"Токен не выставлен на продажу");

        salePrice[tokenId] = 0;
        emit SaleCancelled(msg.sender, tokenId);
    }

    /// Купить токен
    function buy(uint256 tokenId) external payable nonReentrant {
        uint256 price = salePrice[tokenId];
        address seller = ownerOf(tokenId);

        require(price > 0, unicode"Токен не выставлен на продажу");
        require(msg.value >= price, unicode"Недостаточно ETH для покупки");
        require(seller != msg.sender, unicode"Нельзя купить свой токен");

        // снять с продажи до перевода (защита от reentrancy)
        salePrice[tokenId] = 0;

        // Отправляем ETH продавцу
        (bool sent, ) = payable(seller).call{value: price}("");
        require(sent, unicode"Не удалось перевести продавцу");

        // Возврат сдачи
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        // Передаём NFT
        safeTransferFrom(seller, msg.sender, tokenId);

        emit Bought(msg.sender, seller, tokenId, price);
    }

    /// Владелец контракта может вывести средства
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, unicode"Недостаточно баланса на контракте");
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, unicode"Вывод не удался");
    }

    /// Проверка — выставлен ли токен
    function isForSale(uint256 tokenId) external view returns (bool) {
        return salePrice[tokenId] > 0;
    }

    /// ДОБАВИЛИ: Получить текущий tokenId (для удобства)
    function currentTokenId() external view returns (uint256) {
        return _tokenIds;
    }

    /// Приём эфира
    receive() external payable {}
    fallback() external payable {}
}