// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserProfile {

    struct User {
        string username;
        string email;
        address account;
    }

    mapping(address => User) private users;

    event UserRegistered(address indexed account, string username, string email);
    event UserUpdated(address indexed account, string username, string email);

    function registerUser(string memory _username, string memory _email) public {
        require(bytes(users[msg.sender].username).length == 0, "Already registered");
        require(bytes(_username).length >= 2 && bytes(_username).length <= 32, "Username: 2-32 chars");
        require(bytes(_email).length > 0 && bytes(_email).length <= 64, "Email: 1-64 chars");

        users[msg.sender] = User({
            username: _username,
            email: _email,
            account: msg.sender
        });

        emit UserRegistered(msg.sender, _username, _email);
    }

    function updateUser(string memory _username, string memory _email) public {
        require(bytes(users[msg.sender].username).length > 0, "Not registered");
        require(bytes(_username).length >= 2 && bytes(_username).length <= 32, "Username: 2-32 chars");
        require(bytes(_email).length > 0 && bytes(_email).length <= 64, "Email: 1-64 chars");

        users[msg.sender].username = _username;
        users[msg.sender].email = _email;

        emit UserUpdated(msg.sender, _username, _email);
    }

    function getUserInfo(address _account) public view returns (string memory, string memory, address) {
        require(bytes(users[_account].username).length > 0, "User not found");
        User memory u = users[_account];
        return (u.username, u.email, u.account);
    }

    function isRegistered(address _account) public view returns (bool) {
        return bytes(users[_account].username).length > 0;
    }
}
