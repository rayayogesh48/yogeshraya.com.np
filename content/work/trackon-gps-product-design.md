---
title: "Trackon GPS: Designing a Better Vehicle Tracking Experience"
seoTitle: "Trackon GPS Case Study: Vehicle Tracking App Design"
role: "Product Designer"
timeline: "Mobile & Web Product Design"
summary: "Making real-time vehicle tracking clearer, more reliable, and easier to act on for vehicle owners and fleets."
description: "How I designed Trackon GPS to make real-time vehicle tracking and fleet management clearer, more reliable, and easier to trust."
updated: "2026-10-18"
tags:
  - "Trackon GPS"
  - "Product Design"
  - "Vehicle Tracking"
  - "Fleet Management"
  - "Mobile & Web App Design"
cover:
  src: "/images/case-studies/trackon-gps-product-design.jpg"
  alt: "Trackon GPS app logo on a dark textured gradient."
  width: 1024
  height: 537
gallery: null
featuredOrder: 3
relatedInsights:
  - "designing-clearer-product-flows"
  - "what-should-a-dashboard-show-first"
kind: "case-study"
status: "published"
---

# Trackon GPS: Designing a Better Vehicle Tracking Experience

*Making real-time vehicle tracking clearer, more reliable, and easier to act on.*

Here's something I didn't fully get when I started on [Trackon GPS](https://www.trackon-gps.com/): a tracking app is only useful if people trust what it tells them.

A map can show you a little marker where your vehicle is. But is that where it is right now? Or where it was twenty minutes ago, before the signal dropped? Those two answers look exactly the same on screen.

That gap between what the screen shows and what's really happening became the thread running through all my work. This page is the starting point. It tells the big story, and each deep-dive article linked below picks up one piece of it.

## The product

[Trackon GPS](https://www.trackon-gps.com/) is a vehicle tracking and fleet-management product from Nepal. It's used by people who own one car or bike, and by businesses running a whole fleet of buses, trucks, or delivery vehicles.

On the surface, it's an app with a map. Underneath, it's a chain of things that all have to work together:

1. A small GPS tracker gets installed in the vehicle, usually by a local technician.
2. A SIM card inside it connects to the mobile network.
3. The tracker sends its location and events up to [Trackon GPS](https://www.trackon-gps.com/)'s cloud.
4. The app turns that into live locations, trip history, alerts, and reports.
5. A person looks at all of that and decides what to do next.

See what that means? By the time someone opens the app, a lot has already happened that I couldn't touch. The tracker might have lost power. The SIM might be out of data. The vehicle might be parked in a basement with no GPS signal.

The screen still has to make sense of it all. That's where I came in.

## My role

I was the lead, and only, product designer on [Trackon GPS](https://www.trackon-gps.com/). No design team behind me, no senior designer to check my thinking. Just me, the product, and the founders, who were genuinely easy to collaborate with.

[Trackon GPS](https://www.trackon-gps.com/) brought me in on a contract. The product was already live, people were relying on it, and a lot of UX problems had piled up along the way. Fixing those was the reason I was there.

The founders had already done most of the research before I joined. They knew where the product was falling short. My job was to take those flaws, decide which ones to tackle first, and turn them into better designs that could actually ship.

I'll be honest, being solo was both the best and hardest part. I had real ownership. But I also had nobody to blame when I got something wrong, and nobody to tell me I was overthinking a button.

## The challenge

When I first looked at [Trackon GPS](https://www.trackon-gps.com/), I thought the work would be mostly about the map. Cleaner markers, better layout, that kind of thing.

I was wrong. The hardest problems weren't visual at all. They lived in the space between the real world and the screen.

Here are the questions that kept coming up:

- **Is this location actually live?** A stale position looks just as confident as a fresh one.
- **Why is my vehicle offline?** Is it the device, the SIM, the network, or the GPS signal? Users can't tell, and honestly, sometimes neither can the app.
- **Does this alert matter?** When every event feels equally urgent, people start ignoring all of them.
- **What happened yesterday?** A line on a map doesn't explain where someone stopped, for how long, or why.
- **Did my command actually work?** Locking an engine remotely isn't like liking a post. It affects a real vehicle with real people around it.
- **Which vehicle needs me right now?** A screen that works for two vehicles falls apart at two hundred.

None of these had a quick fix. Each one needed me to think about states, edge cases, and trust, not just pixels.

Here's one that stuck with me. A vehicle could stop sending updates, and the app would keep showing its last position as if nothing had changed. Same marker, same look, no hint that the data was old. To the person checking on their car, it looked live. It wasn't.

## How I approached it

I couldn't fix everything at once. So I kept coming back to one simple question: what decision is the user trying to make right now, and what's getting in their way?

That question helped me sort the big problems from the small annoyances. It also gave me a way to explain my choices to developers, who often had very good reasons why something worked the way it did.

I didn't start from a blank page. The founders had already gathered a lot of research and knew where people were struggling. So my first job was to listen, ask a lot of questions, and really understand what they'd found.

Then I went through the product myself, flow by flow, the way a new user would. I wrote down every moment where I got confused or had to guess what the screen meant.

From there, the founders and I sorted the list together. We asked two things about each problem: how often does it hurt people, and how badly? The ones that broke trust, like stale locations or unclear command status, almost always went to the top.

Over time, a handful of principles started guiding almost every decision I made:

1. **Trust before polish.** A beautiful map is useless if you can't tell whether its data is current.
2. **Never make uncertain data look certain.** Show when something was last updated, and say so when it's stale.
3. **Help people find exceptions.** Nobody wants to stare at a map all day waiting for something to go wrong.
4. **Every alert needs context and a next step.** Otherwise it's just noise, or worse, anxiety.
5. **History should tell a story.** Stops, times, and sequence matter more than the line itself.
6. **High-stakes actions need honest feedback.** Don't say "done" until the device actually confirms it.
7. **Failure states are normal.** Offline, delayed, and partial data aren't edge cases in this product. They're Tuesday.

## What it taught me

If you'd asked me before [Trackon GPS](https://www.trackon-gps.com/) what a good tracking app looks like, I'd have talked about the map.

Now I'd talk about trust. Can the person tell how fresh the data is? Do they know what to do when something looks wrong? Do they believe the app when it says a command worked?

Designing a real-time product isn't really about showing live data. It's about helping people trust that data, understand what it means, and make the right call when the real world doesn't behave the way the screen expects.

That lesson has followed me into everything I've designed since. And I think it's the most useful thing I can share with you here.
