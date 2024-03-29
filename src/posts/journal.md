---
title: Journal
excerpt: It’s been just over a year since I started this website and I had every intention of writing more often. Things have changed and I think these posts are going to be more like journal entries than proper articles.
date: "2022-10-11"
---

It’s been just over a year since I started this website and I had every intention of writing more often. I never really knew what I wanted to write about, I just had the urge to get some words out, even if it was just for myself. Over the last year I haven’t written much, or I have but it’s been in bursts. It actually aligns pretty closely with how I work. I get obsessive with something and that’s all I can think about, and then I burn myself out and put it to one side for months. The list of unfinished side projects and proof of concepts on my computer is getting extremely long, this website being one of those.

I think I’ve realized, this website is more like a journal for random thoughts than proper articles like I originally imagined. I’m going to jot some stuff down whenever I’m in the mood. If I’ve learnt anything over the last few years it’s that I can’t force myself to do something unless I’m truly interested in it. I’ll always chase the dopamine of something more intriguing. Who knows, maybe I’ll spin up _another_ website that will have more in-depth articles on the things I’m working on or learning. I know it’s something a few people want when it comes to hearing about my process with all things NFTs and photography. I’m working on that!

As for this post, I thought I’d just list a few things that have been keeping me busy, and how I’ve been feeling.

## Last post retro

[My last post](/self-discovery) was me opening up about my discovery that I’m likely an autistic person and what that has meant for my life day to day, and how it’s been reflecting on it for a few months. The support I got since writing it was overwhelming and made me feel very accepted. One of my fears was that I would lose a bunch of people because of it, but frankly not much has changed which is a good thing!

It’s out there now, and people said some wonderful things in my DM’s, and I’m so appreciative of the support. It was so tough feeling alone in that (outside of my amazing partner), but I’m feeling a lot better about the whole thing.

Would recommend sharing more personal things about yourself, it seems like there will always be someone who can relate if you’re going through a hard time.

## Working

In terms of work stuff, I’ve been working on some really cool things for a couple of new clients. I can’t say too much on what the projects are, but I can probably give a quick summary of what it is I’m doing.

The first project is a lot bigger, but it’s kind of like an NFT kit for a team to get up and running with new projects quickly. They’re onboarding artists to their gallery, and need an easy way to get custom contracts and websites up without spending weeks of time on each one. It’s a set of contracts to do things like pre-minting NFTs, modules for selling them in batches using a mix of auctions and fixed price sales, ERC-721 based editions, membership card early access and discounts, and a whole lot more. Personally I’ve been loving getting more into writing smart contracts, and writing smaller modules in a library fashion has been kind of refreshing. I’ve still got a bit to do on that project but hopefully I’ll be able to share something by the end of the month.

The other smaller project revolves around token-gating a checkout experience. It’s leaning on [Sign In With Ethereum](https://login.xyz/) (SIWE) to prove ownership of wallets, and then [Stripe checkout](https://stripe.com/en-gb/payments/checkout) to handle non-crypto payments if a person owns a specific NFT. It can all be done with NextJS and the API routes which is super nice. I might "white label" it and open source it at some point. It’s actually quite straightforward and I know a bunch of people have been looking for something fairly simple like this. The only annoying part is adding conditions like no repeat orders, which means you need to rely on a database of some sort. As much as I love vercel, I just wish it offered a simple key value store, or a persistent Postgres database or something. Since this project is kind of small and non-tech folks need access to the "database", we’re just using Airtable for now. It’s definitely highlighted the need for me to get more proficient with backend stuff outside of smart contracts.

## Day to day

Outside of work I’ve been playing a lot more [Overwatch](https://overwatch.blizzard.com/en-us/). The new version of the game just released and despite the launch hiccups, I’ve been having a lot of fun playing. I’m back on my main account since it’s now behind SMS protection—RIP to my 5 alt accounts with a much higher skill rating. I haven’t played on this account in maybe 3 years, but it has all my skins on it. The rank has decayed quite a lot which means I’m in games with a lot of n00bs, so I’ve been raging a bit! I get very competitive.

I haven’t been doing much else to be honest. I’ve managed to scan 4 rolls out of the 36 from my trip to America. I’m kind of dreading how long it’s going to take me, but there will likely be a small NFT project that comes out of it. I’ve already got some proof of concept smart contracts working that involve collectors being able to convert their image into an edition within some parameters. Each NFT can deploy a new smart contract with numbered editions as ERC-721 tokens, similar to the "[ground breaking shatter contracts](https://www.transientlabs.xyz/shatter)". I think it’ll be an interesting concept to play around with and it could incentivize some interesting mechanics such as a DAO purchasing a unique NFT and then "shattering" it into editions for their members.

## That’s it

A bit of a hodge-podge post but it feels a lot nicer than tweeting a thread of all the things I’ve been up to.

Before I forget, I’ve set up a discord for collectors of my work. I might open it up to everyone, or at least have the day to day chat be open to everyone because I’d love to talk to some new folks. Check it out at [samking.studio/discord](https://samking.studio/discord).

Thanks for reading, Sam.
