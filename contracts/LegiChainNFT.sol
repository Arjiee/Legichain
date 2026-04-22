// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LegiChainNFT
 * @dev Blockchain-verified Barangay Project Document Registry
 * Deployed on Polygon Amoy Testnet
 */
contract LegiChainNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // Document metadata structure
    struct Document {
        string title;
        string ipfsHash;
        address uploadedBy;
        uint256 timestamp;
        string barangay;
        bool verified;
    }

    // Mapping from token ID to Document metadata
    mapping(uint256 => Document) public documents;

    // Events
    event DocumentMinted(
        uint256 indexed tokenId,
        string title,
        string ipfsHash,
        address indexed uploadedBy,
        string barangay
    );

    event DocumentVerified(uint256 indexed tokenId, address indexed verifier);

    constructor() ERC721("LegiChain Documents", "LEGI") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    /**
     * @dev Mint a new document NFT
     * @param _title Document title
     * @param _metadataURI IPFS URI for metadata JSON
     * @param _ipfsHash IPFS hash of the document files
     * @param _barangay Barangay name (Poblacion 1-5)
     * @return tokenId The newly minted token ID
     */
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
     * @dev Verify a document (only owner/admin can verify)
     * @param _tokenId Token ID to verify
     */
    function verifyDocument(uint256 _tokenId) public onlyOwner {
        require(_ownerOf(_tokenId) != address(0), "Document does not exist");
        documents[_tokenId].verified = true;
        emit DocumentVerified(_tokenId, msg.sender);
    }

    /**
     * @dev Get document metadata by token ID
     * @param _tokenId Token ID
     * @return Document struct
     */
    function getDocument(uint256 _tokenId) public view returns (Document memory) {
        require(_ownerOf(_tokenId) != address(0), "Document does not exist");
        return documents[_tokenId];
    }

    /**
     * @dev Get total number of documents minted
     * @return Total count
     */
    function getTotalDocuments() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Get all documents uploaded by a specific address
     * @param _uploader Address of the uploader
     * @return Array of token IDs
     */
    function getDocumentsByUploader(address _uploader) public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIdCounter;
        uint256 count = 0;

        // Count documents by uploader
        for (uint256 i = 1; i <= totalSupply; i++) {
            if (documents[i].uploadedBy == _uploader) {
                count++;
            }
        }

        // Create array and populate
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (documents[i].uploadedBy == _uploader) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Get all documents by barangay
     * @param _barangay Barangay name
     * @return Array of token IDs
     */
    function getDocumentsByBarangay(string memory _barangay) public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIdCounter;
        uint256 count = 0;

        // Count documents by barangay
        for (uint256 i = 1; i <= totalSupply; i++) {
            if (keccak256(bytes(documents[i].barangay)) == keccak256(bytes(_barangay))) {
                count++;
            }
        }

        // Create array and populate
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (keccak256(bytes(documents[i].barangay)) == keccak256(bytes(_barangay))) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }
}
