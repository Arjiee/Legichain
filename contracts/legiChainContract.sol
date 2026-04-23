// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LegiChainNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct Document {
        string title;
        string ipfsHash; // This points to the LATEST metadata JSON
        address uploadedBy;
        uint256 timestamp;
        string barangay;
        bool verified;
    }

    mapping(uint256 => Document) public documents;

    event DocumentMinted(uint256 indexed tokenId, string title, string ipfsHash, address indexed uploadedBy, string barangay);
    event DocumentVerified(uint256 indexed tokenId, address indexed verifier);
    // New event for tracking project updates
    event DocumentUpdated(uint256 indexed tokenId, string newIpfsHash, uint256 timestamp);

    constructor() ERC721("LegiChain Documents", "LEGI") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    function mintDocument(
        string memory _title,
        string memory _metadataURI,
        string memory _ipfsHash,
        string memory _barangay
    ) public returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _metadataURI);

        documents[newTokenId] = Document({
            title: _title,
            ipfsHash: _ipfsHash,
            uploadedBy: msg.sender,
            timestamp: block.timestamp,
            barangay: _barangay,
            verified: false
        });

        emit DocumentMinted(newTokenId, _title, _ipfsHash, msg.sender, _barangay);
        return newTokenId;
    }

    /**
     * @dev UPDATED: Allows the uploader or admin to update project metadata (e.g. Status change)
     * This minimizes gas by reusing the same Token ID instead of minting new ones.
     */
    function updateDocumentMetadata(uint256 _tokenId, string memory _newMetadataURI, string memory _newIPFSHash) public {
        require(_ownerOf(_tokenId) != address(0), "Document does not exist");
        require(msg.sender == documents[_tokenId].uploadedBy || msg.sender == owner(), "Not authorized to update");

        // Update the URI (what OpenSea/Marketplaces see)
        _setTokenURI(_tokenId, _newMetadataURI);
        
        // Update our internal registry pointer
        documents[_tokenId].ipfsHash = _newIPFSHash;
        documents[_tokenId].timestamp = block.timestamp;

        emit DocumentUpdated(_tokenId, _newIPFSHash, block.timestamp);
    }

    function verifyDocument(uint256 _tokenId) public onlyOwner {
        require(_ownerOf(_tokenId) != address(0), "Document does not exist");
        documents[_tokenId].verified = true;
        emit DocumentVerified(_tokenId, msg.sender);
    }

    function getDocument(uint256 _tokenId) public view returns (Document memory) {
        require(_ownerOf(_tokenId) != address(0), "Document does not exist");
        return documents[_tokenId];
    }

    function getTotalDocuments() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // ... (keep getDocumentsByUploader and getDocumentsByBarangay as they were)
}