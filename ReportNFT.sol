// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReportNFT {
    struct Report {
        string hash;    // File hash or IPFS CID
        address owner;  // Uploader's wallet
    }

    Report[] private reports;

    // 🔹 Events for frontend listeners
    event ReportStored(uint indexed reportId, string hash, address indexed owner);
    event ReportEdited(uint indexed reportId, string oldHash, string newHash, address indexed owner);

    // 🔹 Upload a new report
    function storeReportHash(string memory hash) public returns (bool) {
        reports.push(Report(hash, msg.sender));
        emit ReportStored(reports.length - 1, hash, msg.sender);
        return true;
    }

    // 🔹 Edit a report (only owner can edit)
    function editReport(uint index, string memory newHash) public returns (bool) {
        require(index < reports.length, "Invalid report ID");
        require(reports[index].owner == msg.sender, "Not owner");

        string memory oldHash = reports[index].hash;
        reports[index].hash = newHash;

        emit ReportEdited(index, oldHash, newHash, msg.sender);
        return true;
    }

    // 🔹 View all reports (public)
    function getAllReports() public view returns (Report[] memory) {
        return reports;
    }

    // 🔹 View reports uploaded by the caller
    function getMyReports() public view returns (Report[] memory) {
        uint count = 0;

        // Count how many belong to msg.sender
        for (uint i = 0; i < reports.length; i++) {
            if (reports[i].owner == msg.sender) {
                count++;
            }
        }

        // Copy only my reports
        Report[] memory myReports = new Report[](count);
        uint j = 0;
        for (uint i = 0; i < reports.length; i++) {
            if (reports[i].owner == msg.sender) {
                myReports[j] = reports[i];
                j++;
            }
        }
        return myReports;
    }

    // 🔹 Get total reports count
    function getReportsCount() public view returns (uint) {
        return reports.length;
    }
}
