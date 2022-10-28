---
title: TIFU—web3 edition
excerpt: I fucked up in a very silly way and got some ETH stuck. It could have been way worse, but I was also able to recover the funds using an interesting technique.
date: "2022-10-28"
---

Today, well yesterday, I fucked up. The mistake was incredibly small and silly, and luckily I was able to retrieve lost funds, but it was a journey. Since it was pretty interesting how I got the funds back, I thought I’d share my process. Be warned, this might get technical but I’ve tried to keep it as friendly as possible.

## What actually happened?

So for the past few weeks I’ve been working on some contracts and website templates with [Fount Gallery](https://fount.gallery). Yesterday we were launching the first project that was making use of that work, [The Garden](https://thegarden.fount.gallery).

More specifically, we were launching an NFT contract that has batched releases e.g. 33 NFTs are released first, and you can only release the next 33 once the previous 33 have been sold. We were calling these “arrangements”. Each arrangement could have it’s own contract to manage the sale of those NFTs. This is important for what happened, but it allowed us to run the first arrangement as an auction, only for holders of a specific NFT. The second and third arrangements could be something else entirely, but for now we were just dealing with the first auction contract.

Everything was looking good, the website was all hooked up, the contracts were passing all the tests. I even a wrote a full end to end test for the entire NFT sale process, from deploying and configuring the contracts, to running the first auction, releasing new arrangements, and making sure funds could be withdrawn.

We deployed the contracts and everything went as planned, the double checking and extra tests worked. Now it was time to point the website to the newly deployed contracts, and release it to the public.

In testing, we were using the goerli testnet which has a chain ID of 5. In production, we wanted to use mainnet which has a chain ID of 1. I was using the following code to swap the address based on the version of the website. Those with a keen eye can probably already see my mistake.

```typescript{3-5,11-13}
export const theGardenContract = {
  address:
    chainId == 1
      ? TheGardenNFTGoerli.address
      : TheGardenNFTMainnet.address,
  abi: theGardenAbi,
};

export const arrangementOneContract = {
  address:
    chainId == 1
      ? ArrangementOneGoerli.address
      : ArrangementOneMainnet.address,
  abi: arrangementOneAbi,
};
```

The highlighted lines above basically read “if the chain ID is 1 (mainnet), then use the goerli address, otherwise use the mainnet address”. I had put the addresses the wrong way round. You might now be able to guess what happened.

I didn’t catch this on the development version of the site because I had hard coded the goerli address and commented out my mistake. Before we took the site live, I uncommented the code and didn’t notice it was the wrong way round!

The auctions didn’t start for a few hours after the site went live, so I just sat back and went into standby mode in case anything happened. It reached 6PM my time, and the auctions flipped to the live state, but it was suspiciously quiet.

Then the first user report came in. They placed a bid, and it looked like the transaction went through, but they said the bid never showed up on the site.

I asked for a transaction hash and my heart sank as I loaded up the etherscan link. I recognized the “to” address. It was the same address as the auction contract on the test network. I’d used it so much over the last few days, I was familiar with it. However, this address had no contract on mainnet.

For those that don’t know, if you submit a transaction to a contract address that doesn’t actually have a contract deployed there, your transaction will still go through including any ETH you send. This is what had happened. The user had tried to place a bid from the website, but they essentially sent ETH to an uncontrolled address. Pablo of Fount Gallery also placed a bid after the user report and had the same issue. Both bids were using the reserve price of 0.15 ETH. A total of 0.3 ETH just gone. In $USD value it was just shy of $500.

I quickly checked the website code and my mistake stared me in the face. I’d assumed a build cache error with Vercel or something, but no, it was me. I’d been so thorough with everything else, but not these two small lines of code.

I managed to flip the code and get a build out before anyone else bid and further funds were lost. The first user was refunded so they could bid again, this time on the correct contract, and I reimbursed Fount Gallery and Pablo for my mistake.

I felt so stupid.

## Was it possible to get the funds back?

I distinctly remembered reading something about deploying the same contract to the same address, across different chains. I wondered if there was a way I could deploy the same version of the contract that was on the test network, but on mainnet. I did a little research and I was right.

When deploying smart contracts, the address is derived from a few things:

- The wallet address that is deploying the contract
- The contract bytecode (the compiled contract code)
- The wallets transaction count (called a nonce)

This means if you use the same wallet address, with the same bytecode, and the same transaction count, then you can deploy a contract to the same address.

![Deployment diagram highlighting deploying across chains](../deploy-diagram.png)

I always try to use a fresh wallet for deploying on test networks. I’d created a brand new one for Fount Gallery projects. This is good practice because it means the transaction count (nonce) for these test network wallets is usually zero on mainnet.

The design of Ethereum means you can only ever increment your nonce value by one. You can’t decrease it, or increase it by more than one. This is to prevent replay attacks. [This article](https://help.myetherwallet.com/en/articles/5461509-what-is-a-nonce) is a good explanation of nonces.

I had a look at the deploy transaction on goerli to see what the deployment wallet’s nonce value was when the test contract was deployed. It was 46. The nonce for the same wallet on mainnet was currently 0, completely fresh.

If the nonce value of the address on mainnet was above 46, the funds would be lost forever. This is why I’m so glad I use separate test network wallets.

## The plan

It involved a few steps, some were annoying, and if I messed it up, I’d be locked out and ruin my chance. I had to do the following…

### Get the exact code I deployed before

I’d made some changes by the time the mainnet contract went live, but luckily I still had the deploy output thanks to [forge scripts](https://book.getfoundry.sh/reference/forge/forge-script). It saved a JSON file with all the info including the bytecode, constructor args, and the commit hash of the code. This meant I could easily roll back to the commit where the deploy happened.

### Increase the nonce for the deployment wallet on mainnet

This one was annoying. I had to increase the nonce value to 46 before I could deploy the same contract on mainnet.

First I had to fund the wallet which was the easy part. Remember how the nonce can only be increased one by one? Yeah I had to send 46 transactions. I probably could have automated this step but didn’t want to mess anything up and go too far. If I went over 46, then I’d never be able to reduce the nonce, and would therefore never be able to deploy the contract at the same address.

I did this by sending 0 ETH to myself 46 times. If you want a laugh, you can check out the [etherscan page](https://etherscan.io/address/0x3daccc1cdaec55e8f997544dd5a9d01ce5dd2153) for the wallet.

### Then I had to deploy the code

I just reused the same forge script to do the deploy. The really nice thing about it was that I could simulate the transaction, and check the deployment address before I _actually_ deployed.

One thing that I was worried about was that I’d get the nonce wrong. I ended up stopping at 45 transactions, running the script to see if the deployment addresses matched, and if so, I would just submit it. If not, I’d send one more transaction to myself and check again.

```solidity
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/ArrangementOne.sol";

contract Deploy is Script {
    ArrangementOne public operator;

    function run() public {
        address owner = msg.sender;
        address admin = owner;
        address nft = 0x394ab96833457807caE7C34D89C1aF41812f7eca;
        address fountCard = 0xBa4Fa81eeE18c626388C008f6e6bEe9AbE3F3DE8;

        vm.startBroadcast();
        operator = new ArrangementOne(owner, admin, nft, fountCard);
        vm.stopBroadcast();
    }
}
```

I could run the above script and check the output in the broadcast JSON file for each dry run. I was specifically looking to see if the contract address and nonce values matched the testnet version.

```json{7,21}
{
  "transactions": [
    {
      "hash": "0xa1a581f4778860ec5c7f5f54bab4603bc39e0a804d86810b9baa8a79e19faf30",
      "transactionType": "CREATE",
      "contractName": "ArrangementOne",
      "contractAddress": "0x552b9Ca81EC4615BbD7fe6adF3b5fD73fE0E81E2",
      "function": null,
      "arguments": [
        "0x3DAcCc1CDAec55E8f997544dd5a9D01cE5Dd2153",
        "0x3DAcCc1CDAec55E8f997544dd5a9D01cE5Dd2153",
        "0x394ab96833457807caE7C34D89C1aF41812f7eca",
        "0xBa4Fa81eeE18c626388C008f6e6bEe9AbE3F3DE8"
      ],
      "transaction": {
        "type": "0x02",
        "from": "0x3daccc1cdaec55e8f997544dd5a9d01ce5dd2153",
        "gas": "0x2046d2",
        "value": "0x0",
        "data": "0x60806040526001…",
        "nonce": "0x2e",
        "accessList": []
      },
      "additionalContracts": []
    }
  ]
}
```

I got the nonce to 45 and they didn’t match. Now I was really nervous. The nonces in the JSON were different so I knew I had to make one more transaction. As if by magic, it worked! The dry run matched!

### Deploy and withdraw

I was still apprehensive. Since there was already ETH at the address, and there were incoming transactions, I wasn’t sure if the contract could actually be deployed, or if I could interact with it.

I was wrong. It deployed successfully.

All I had to do was use the withdraw function to get the balance out. Luckily the withdraw function just takes the entire balance of the address, and sends it to the one you specify in the call.

```solidity
function withdrawETH(address to) external onlyOwnerOrAdmin {
    // Prevent withdrawing to the zero address
    if (to == address(0)) revert CannotWithdrawToZeroAddress();

    // Check there is eth to withdraw
    uint256 balance = address(this).balance;
    if (balance == 0) revert ZeroBalance();

    // Transfer funds
    (bool success, ) = payable(to).call{value: balance}("");
    if (!success) revert WithdrawFailed();
}
```

I received the stuck funds! It was a success, and I was so relieved.

## But at what cost?

It took me a couple of hours to figure all of this out, fund my test wallet on mainnet, run all the transactions, set up the script again etc. It also cost me about $100 in transaction fees for increasing my nonce and deploying the contract.

Overall it wasn’t a super expensive mistake, but it could have been much worse. If more people had sent ETH to the non-existent contract, and I hadn’t been able to recover anything, I would have been out of pocket. It would have also severely damaged my own, and Fount Gallery’s reputation.

## Lessons learned

1. Double check your shit. This whole thing was because of two lines of code. Frontend tests may have caught it, but maybe not.
2. Deterministic deploys are really cool. They saved my ass.
3. The whole foundry ecosystem is amazing. The broadcast logs were really helpful in getting back to the state I needed. Scripts were helpful to simulate transactions before broadcasting. If you write Solidity, just use foundry/forge.
4. Separate. Test. Wallets. Chances are, you’ll do way more transactions on mainnet than a testnet, and there’s no way to lower your nonce. The fact the nonce was zero on mainnet was one of the only reasons I was able to do this. If not for the nonces, then please just for OpSec.

This whole thing hasn’t put me off or made me super scared. It’s just made me confident that I can get out of these situations if they ever happen in the future, although I’m really hoping they don’t!

Also, I have some availability in a few weeks if there’s a project idea you’d like me to work with you on, so long as this post hasn’t put you off. Shoot me a message on [Twitter](https://twitter.com/samkingco) or via the [studio](https://samking.studio).

Thanks for reading, Sam.

<small class="subtle">P.S. Pablo and Cheryl, if you’re reading this, thank you for being patient and understanding in a stressful time!</small>
