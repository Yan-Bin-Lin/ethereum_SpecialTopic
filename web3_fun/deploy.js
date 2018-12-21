const fs = require('fs')
const Web3 = require('web3');

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('ethereum_SpecialTopic/contract/vote.abi').toString())
const bytecode = '0x' + fs.readFileSync('ethereum_SpecialTopic/contract/vote.bin').toString()
let election = new web3.eth.Contract(abi)

web3.eth.getAccounts().then(function (accounts) {

    // deploy contract

    election.deploy({
        data: bytecode
    }).send({
        from: accounts[0],/*one of account-----------------------------------------------------*/
        gas: 1500000,
        gasPrice: 30000000000000,
    }).on('receipt', function(newElection){
        // instance with the new contract address
        console.log(newElection);
        fs.writeFileSync('./address.txt', newElection.contractAddress);
    })

})