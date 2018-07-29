---
layout: post
title:  "Distributed Traffic Matrix Measurement in OpenFlow Enabled Networks"
date:   2014-07-23
excerpt: "Distributed Traffic Matrix Measurement in OpenFlow Enabled Networks, using opensource tools"
project: true
tag:
- Network 
- OpenFlow
- SDN
comments: true
---

# Distributed Traffic Matrix Measurement

The current network architecture is constrained. The development of new protocols to cope with 
new demands in computer networks such as real time streaming and voice over IP is not an 
easy task. Other than developing new protocols, computer networks should be able to rapidly 
deploy changes across networking equipment. Software-Defined Networking promises to 
simplify network management tasks and enable rapid developments of new protocols. SDN 
separates the control plane from the data planes in the switches, bringing a level of abstraction 
needed to manage sets of switches from a central location. OpenFlow has become a de facto 
standard for communication between control plane and data planes. 

One key information for network planning and management is the traffic matrix (TM). TM is 
defined as the volume of traffic transported by the network during a period of time from any 
ingress node to any egress node in a network. OpenFlow-based networks in particular must be 
able to continuously monitor performance metrics, in order to quickly adapt forwarding rules to 
utilize network resources in the best possible manner. However, current solutions for monitoring 
either require special monitoring equipment or impose significant measurement overhead. 

In this thesis, we propose a distributed way of measuring traffic, where every ingress node in 
the network is responsible for measuring a portion of the traffic matrix. We only used a set of 
features already available in the latest version of OpenFlow without any need of modification in 
the platform. Therefore our framework can be deployed on any OpenFlow (version 1.3 or 
higher) enabled network. The effectiveness of our solution is demonstrated through series of 
emulation in Mininet and in a test-bed with low-end OpenFlow switches.

#

You can download the thesis below:

[Download Thesis]({{ site.url }}/assets/download/Distributed Traffic Matrix Measurement in OpenFlow Enabled Networks.pdf){: .btn}