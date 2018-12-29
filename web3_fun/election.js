const fs = require('fs')
const Web3 = require('web3')

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('./contract/vote.abi').toString())
const address = fs.readFileSync('./address.txt').toString()
let election = new web3.eth.Contract(abi, address)

let id = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

module.exports = {

    create : function(creater, candidate, password){
        //add pasword
        let sha3 = web3.utils.soliditySha3(password)
        election.methods.AddKeys(sha3).send({
            from : creater,
            gas : 3400000
        }).then(function (receipt) {
            console.log('Add key success')
            console.log(receipt)
            return receipt
        }).then(function(callback){
            for(let i = 0;i < 3;i ++){
                //create a new vote
                election.methods.createCandidate(candidate.name[i]).send({
                    from: creater,//who create a vote
                    gas: 3400000
                }).then(function (receipt) {
                    console.log('add candiate[' + i.toString() + '] success')
                    console.log(receipt)
                });
            }
        })

    },

    vote : function(caller, candiateID, password, key){
        let y = Math.floor(Math.random() * (key.p / 2 - 3)) + 2;
        console.log("y = " + y.toString())

        function pow(base, power, mod){
            let n = 1;
            for(let i = 0;i < power;i ++){
                n = n * base % mod;
            }
            return n;
        }

        let C1 = pow(key.g, y, key.p);
        console.log("c1 = " + C1.toString())

        let s = pow(key.h, y, key.p);
        console.log("s = " + s.toString())
        let C2 = (candiateID * s) % key.p;
        console.log("c2 = " + C2.toString())

        //vote
        let message = election.methods.keyAndVote(password, C1, C2, key.p).send({
            from: caller,//who want to a vote
            gas: 3400000
        }).then(function (receipt) {
            console.log('vote success')
            console.log(receipt)
        });

    },

    open : function(creater, candidate, key){
        //opening
        election.methods.decode(key.p, key.x).call({
            from: creater, //who create a vote
            gas: 3400000
        }).then(function (receipt) {
            console.log('open success')
            console.log(receipt)

            //initialize
            let count = []
            for(let i = 0; i < candidate.num;i ++){
                count.push(0)
            }

            while(receipt > 1){
                for(let i = 0;i < candidate.num; i ++){
                    if(receipt % id[i] == 0){
                        count[i] ++;
                        receipt /= id[i]
                    }
                }
            }

            candidate.count = count
            return candidate
        });

    }

}