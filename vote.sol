pragma solidity ^0.4.25;
contract Vote {
    struct candidate{
        string candidateName;
        uint candidateId;
        uint numberOfVote;
    }
    candidate[] candidates;
    uint idCount = 0;
    uint C1 = 1;
    uint C2 = 1;
    uint[] id = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    function createCandidate(string name) returns (uint){
        if (idCount<10){
            candidates.push(candidate(name, id[idCount], 0));
            idCount += 1;
        }
        return candidates[idCount-1].candidateId;
    }
    function getC1() returns (uint c1){
        return C1;
    }
    function getC2() returns (uint c2){
        return C2;
    }
    function keyAndVote(string s, uint c1, uint c2) {
        uint rand = uint(keccak256(abi.encodePacked(s)));
        if(rand==105777642032448366460234198415590594741299614061019231004883639673054673335513){
            C1 *= c1;
            C2 *= c2;
        }
    }
    function decode(uint p, uint x) returns (uint m) {
        uint K = C1;
        for(uint i=0; i<x-1; i++){
            K = K*C1%p;
        }
        for(uint i=0; i<2000; i++){
            if (K*i%p == 1){
                uint nk=i;
                break;
            }
        }
        uint M=C2*nk%p;
        vote(M);
        return M;
    }
    function vote(uint id){
        uint len = candidates.length;
        for(uint i=0; i<len; i++){
            if(candidates[i].candidateId == id){
                candidates[i].numberOfVote +=1;
            }
        }
    }
    function openBallot() returns (string s){
        uint len = candidates.length;
        uint max = 0;
        uint id;
        for(uint i=0; i<len; i++){
            if(candidates[i].numberOfVote > max){
                max = candidates[i].numberOfVote;
                id = i;
            }
        }
        return candidates[id].candidateName;
    }
}
