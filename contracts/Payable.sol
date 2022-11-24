pragma solidity >=0.4.21 <0.7.0;

contract  Payable {
    uint amount =0;
    event Received(uint value);

    function payme() payable public{
        amount = msg.value;
    }
    function getamount() public view returns (uint){
        return amount;
    }
    function get() external payable {
        emit Received(amount);
    }
}

